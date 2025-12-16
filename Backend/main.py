import os
import time
import threading
import requests
import json
from datetime import datetime, timedelta
from functools import wraps
from urllib import parse as urllib_parse
from flask import Flask, jsonify, request, redirect, url_for, session
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import jwt
from authlib.integrations.flask_client import OAuth
# from SentimentPredictor import SentimentPredictor  # Not needed for products
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from dateutil.relativedelta import relativedelta
import certifi 

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET = os.getenv("SECRET_KEY", "dev_jwt_secret")
JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", 86400))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:8080")
PORT = int(os.getenv("PORT", 5000))

app = Flask(__name__)
# Allow all origins for development to avoid CORS issues
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.secret_key = JWT_SECRET


client = MongoClient(
    MONGODB_URI, 
    tls=True, 
    tlsAllowInvalidCertificates=False,
    tlsCAFile=certifi.where()
)
db = client['userinfo']
users_col = db['users']
products_col = db['products']
products_col.create_index([("created_at", ASCENDING)])

oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

try:
    app.logger.info("Loaded Google server_metadata keys: %s", list(google.server_metadata.keys()))
    app.logger.info("Google userinfo_endpoint: %s", google.server_metadata.get("userinfo_endpoint"))
except Exception:
    app.logger.exception("Unable to read google.server_metadata (discovery may have failed)")

def create_default_user(user_id: str) -> dict:
    user_doc = {
        "user_id": user_id,
    }
    users_col.insert_one(user_doc)
    return user_doc

def get_user(user_id: str) -> dict:
    user = users_col.find_one({"user_id": user_id})
    if not user:
        user = create_default_user(user_id)
    return user

def update_user(user_id: str, update_dict: dict) -> None:
    update_dict["updated_at"] = datetime.utcnow()
    users_col.update_one({"user_id": user_id}, {"$set": update_dict})

def create_jwt_for_user(user_doc: dict) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": str(user_doc.get("user_id", user_doc.get("username"))),
        "email": user_doc.get("email"),
        "name": user_doc.get("name"),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(seconds=JWT_EXP_SECONDS)).timestamp()),
        "provider": user_doc.get("provider", "oauth")
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def upsert_oauth_user(email: str, name: str = None, provider: str = "google", extra: dict = None) -> dict:
    query = {"email": email}
    now = datetime.utcnow()
    update = {
        "$set": {
            "username": name,
            "email": email,
            "name": name,
            "provider": provider,
            "updated_at": now
        },
        "$setOnInsert": {
            "created_at": now,
            "balance": 100000.0,
            "portfolio": [],
            "tradeHistory": []
        }

    }
    users_col.update_one(query, update, upsert=True)
    user = users_col.find_one(query)
    if user:
        user["user_id"] = user.get("username")
        user.pop("_id", None)
    return user

@app.route("/auth/google", methods=["GET"])
def auth_google():
    redirect_uri = url_for("auth_google_callback", _external=True)
    app.logger.info("auth_google redirect_uri: %s", redirect_uri)
    return google.authorize_redirect(redirect_uri)

@app.route("/auth/google/callback", methods=["GET"])
def auth_google_callback():
    token = google.authorize_access_token()
    userinfo = google.get("https://www.googleapis.com/oauth2/v2/userinfo").json()
    email = userinfo.get("email")
    name = userinfo.get("name") or userinfo.get("given_name") or (email.split("@")[0] if email else None)
    if not email:
        return jsonify({"error": "No email returned"}), 400
    user = upsert_oauth_user(email=email, name=name, provider="google")
    jwt_token = create_jwt_for_user(user)
    redirect_url = FRONTEND_ORIGIN.rstrip("/") + "/auth-callback?token=" + urllib_parse.quote(jwt_token)
    return redirect(redirect_url)

# Product API Endpoints
@app.route("/api/products", methods=["GET"])
def get_products():
    """Fetch all products from the database with optional filtering"""
    try:
        query = {}
        
        # Filter by Category
        category = request.args.get("category")
        if category and category != "all":
            query["category"] = category
            
        # Filter by Search Text
        search = request.args.get("search")
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]

        products = list(products_col.find(query, {"_id": 0}).sort("created_at", -1))
        return jsonify({"success": True, "products": products}), 200
    except Exception as e:
        app.logger.error(f"Error fetching products: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/products/<product_id>", methods=["GET"])
def get_product(product_id):
    """Fetch a single product by ID"""
    try:
        product = products_col.find_one({"id": product_id}, {"_id": 0})
        if not product:
            return jsonify({"success": False, "error": "Product not found"}), 404
        return jsonify({"success": True, "product": product}), 200
    except Exception as e:
        app.logger.error(f"Error fetching product {product_id}: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/products", methods=["POST"])
def create_product():
    """Create a new product listing"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["title", "description", "price", "badge", "image"]
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing field: {field}"}), 400
        
        # Generate unique ID
        import uuid
        product_id = str(uuid.uuid4())
        
        product = {
            "id": product_id,
            "title": data["title"],
            "description": data["description"],
            "price": float(data["price"]),
            "badge": data["badge"],
            "image": data["image"],
            "category": data.get("category"),
            "seller_id": data.get("seller_id", "anonymous"),
            "created_at": datetime.utcnow(),
            "status": "active"
        }
        
        products_col.insert_one(product)
        product.pop("_id", None)  # Remove MongoDB _id from response
        
        return jsonify({"success": True, "product": product}), 201
    except Exception as e:
        app.logger.error(f"Error creating product: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
