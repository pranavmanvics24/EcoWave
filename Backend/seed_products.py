import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi
from datetime import datetime
import uuid

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(
    MONGODB_URI, 
    tls=True, 
    tlsAllowInvalidCertificates=False,
    tlsCAFile=certifi.where()
)
db = client['userinfo']
products_col = db['products']

# Clear existing products to avoid duplicates
products_col.delete_many({})

sample_products = [
    {
        "id": str(uuid.uuid4()),
        "title": "Bamboo Water Bottle",
        "description": "Stay hydrated sustainably with our premium bamboo water bottle. Made from natural bamboo with a stainless steel interior.",
        "price": 500,
        "badge": "Eco-Friendly",
        "image": "https://images.unsplash.com/photo-1602143407151-01114192003f?auto=format&fit=crop&w=400&q=80",
        "category": "accessories",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Organic Cotton Tote",
        "description": "Carry your essentials in style with our 100% organic cotton tote bag. Durable, reusable, and washable.",
        "price": 150,
        "badge": "Reusable",
        "image": "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=400&q=80",
        "category": "clothing",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Solar Power Bank",
        "description": "Never run out of power with our innovative solar power bank. Charges your devices using the sun's energy.",
        "price": 800,
        "badge": "Solar Powered",
        "image": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=400&q=80",
        "category": "electronics",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Recycled Notebook Set",
        "description": "Express your thoughts while protecting the planet. Made from 100% post-consumer recycled paper.",
        "price": 80,
        "badge": "100% Recycled",
        "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
        "category": "books",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Biodegradable Phone Case",
        "description": "Protect your phone and the planet. Made from wheat straw and plant-based bioplastics.",
        "price": 250,
        "badge": "Biodegradable",
        "image": "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=400&q=80",
        "category": "accessories",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Reusable Produce Bags",
        "description": "Set of 5 lightweight, durable mesh bags for fruit and vegetables.",
        "price": 120,
        "badge": "Zero Waste",
        "image": "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Bamboo Toothbrush Pack",
        "description": "Pack of 4 biodegradable bamboo toothbrushes with charcoal-infused bristles.",
        "price": 180,
        "badge": "Plastic Free",
        "image": "https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Stainless Steel Straw Set",
        "description": "4 reusable steel straws with cleaning brush and carrying pouch.",
        "price": 90,
        "badge": "Reusable",
        "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Eco-Friendly Yoga Mat",
        "description": "Non-slip yoga mat made from natural cork and recycled rubber.",
        "price": 1200,
        "badge": "Natural Material",
        "image": "https://images.unsplash.com/photo-1592432678016-e910b452f9a9?auto=format&fit=crop&w=400&q=80",
        "category": "other",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Solar Garden Lights",
        "description": "Pack of 6 waterproof solar LED lights for your garden or pathway.",
        "price": 850,
        "badge": "Solar Powered",
        "image": "https://images.unsplash.com/photo-1563514227144-d99c4a877d9e?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Hemp T-Shirt",
        "description": "Breathable and durable t-shirt made from 100% organic hemp fabric.",
        "price": 450,
        "badge": "Organic",
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
        "category": "clothing",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Beeswax Food Wraps",
        "description": "A natural alternative to plastic wrap. Set of 3 sizes.",
        "price": 300,
        "badge": "Plastic Free",
        "image": "https://images.unsplash.com/photo-1624638765275-cba3483602f3?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Upcycled Denim Jacket",
        "description": "Unique denim jacket created from upcycled jeans.",
        "price": 1500,
        "badge": "Upcycled",
        "image": "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=400&q=80",
        "category": "clothing",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Bamboo Cutlery Set",
        "description": "Portable cutlery set in a cloth travel pouch.",
        "price": 110,
        "badge": "Travel Ready",
        "image": "https://images.unsplash.com/photo-1588619461327-040854b41b16?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Organic Coffee Beans",
        "description": "Fair-trade, shade-grown organic coffee beans.",
        "price": 350,
        "badge": "Fair Trade",
        "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80",
        "category": "other",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Recycled Glass Vase",
        "description": "Hand-blown glass vase made entirely from recycled bottles.",
        "price": 400,
        "badge": "Artisan",
        "image": "https://images.unsplash.com/photo-1581783342308-f792ca18df6e?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Wooden Sunglasses",
        "description": "Stylish sunglasses with polarized lenses and lightweight bamboo frames.",
        "price": 600,
        "badge": "Stylish",
        "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
        "category": "accessories",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Seed Paper Greeting Cards",
        "description": "Pack of 10 greeting cards embedded with wildflower seeds.",
        "price": 150,
        "badge": "Plantable",
        "image": "https://images.unsplash.com/photo-1606103986047-98774e537233?auto=format&fit=crop&w=400&q=80",
        "category": "books",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Compost Bin",
        "description": "Compact kitchen counter compost bin with odor-blocking carbon filter.",
        "price": 550,
        "badge": "Zero Waste",
        "image": "https://images.unsplash.com/photo-1632367280877-5120531bfa2b?auto=format&fit=crop&w=400&q=80",
        "category": "home",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Natural Luffa Body Sponge",
        "description": "100% plant-based exfoliating sponge. Fully compostable.",
        "price": 60,
        "badge": "Natural",
        "image": "https://images.unsplash.com/photo-1615233500854-325db000c283?auto=format&fit=crop&w=400&q=80",
        "category": "other",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Ethical Wool Scarf",
        "description": "Warm, cozy scarf made from ethically sourced wool.",
        "price": 700,
        "badge": "Ethical",
        "image": "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80",
        "category": "clothing",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Rechargeable Batteries",
        "description": "Pack of 4 AA high-capacity rechargeable batteries.",
        "price": 650,
        "badge": "Energy Saving",
        "image": "https://images.unsplash.com/photo-1616422237838-8d45d8b9d31f?auto=format&fit=crop&w=400&q=80",
        "category": "electronics",
        "seller_id": "seed_script",
        "created_at": datetime.utcnow(),
        "status": "active"
    }
]

products_col.insert_many(sample_products)
print(f"Successfully added {len(sample_products)} products to the database!")
