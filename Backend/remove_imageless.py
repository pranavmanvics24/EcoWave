import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    print("Error: MONGODB_URI not found in environment")
    exit(1)

# Connect to MongoDB
is_local_mongo = "localhost" in MONGODB_URI or "127.0.0.1" in MONGODB_URI

try:
    if is_local_mongo:
        client = MongoClient(MONGODB_URI)
    else:
        client = MongoClient(
            MONGODB_URI, 
            tls=True, 
            tlsAllowInvalidCertificates=False,
            tlsCAFile=certifi.where()
        )
    
    db = client['userinfo']
    products_col = db['products']
    
    # Delete products with missing or empty image field
    result = products_col.delete_many({
        "$or": [
            {"image": {"$exists": False}},
            {"image": None},
            {"image": ""}
        ]
    })
    
    print(f"Successfully removed {result.deleted_count} listings without images.")

except Exception as e:
    print(f"Error during cleanup: {e}")
