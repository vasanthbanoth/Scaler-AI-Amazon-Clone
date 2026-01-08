import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import engine, SessionLocal, Base
from database.models import Product

sample_products = [
    {
        "name": "Apple iPhone 15 Pro (128 GB) - Natural Titanium",
        "description": "FORGED IN TITANIUM — iPhone 15 Pro has a strong and light aerospace-grade titanium design with a textured matte-glass back.",
        "price": 127990.00,
        "stock": 50,
        "category": "Electronics",
        "image_main": "https://m.media-amazon.com/images/I/31KxpX7Xk7L._SY300_SX300_QL70_ML2_.jpg",
        "images": [
            "https://m.media-amazon.com/images/I/51brdXeugJL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71657TiFeHL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/712CBkmhLhL._SL1500_.jpg"
        ],
        "specifications": {
            "Brand": "Apple",
            "Model": "iPhone 15 Pro",
            "Screen Size": "6.1 Inches",
            "Hard Disk": "128 GB"
        }
    },
    {
        "name": "Echo Dot (5th Gen) | Smart speaker with Alexa",
        "description": "OUR BEST SOUNDING ECHO DOT YET — Enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals and deeper bass.",
        "price": 4449.00,
        "stock": 100,
        "category": "Electronics",
        "image_main": "https://m.media-amazon.com/images/I/71jNr0MoZEL._SL1500_.jpg",
        "images": [
            "https://m.media-amazon.com/images/I/81VttNsrDwL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61lPcAKY+vL._SL1500_.jpg"
        ],
        "specifications": {
            "Brand": "Amazon",
            "Speaker Type": "Smart Speaker",
            "Connectivity": "Wi-Fi, Bluetooth"
        }
    },
    {
        "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "description": "The WH-1000XM5 headphones rewrite the rules for distraction-free listening.",
        "price": 26990.00,
        "stock": 30,
        "category": "Electronics",
        "image_main": "https://m.media-amazon.com/images/I/51aXvjzcukL._SL1500_.jpg",
        "images": [
            "https://m.media-amazon.com/images/I/51gaT35OeML._SL1080_.jpg",
            "https://m.media-amazon.com/images/I/81+4fB1ehJL._SL1500_.jpg"
        ],
        "specifications": {
            "Brand": "Sony",
            "Battery Life": "30 Hours",
            "Noise Cancelling": "Yes"
        }
    },
    {
        "name": "Kindle Paperwhite (16 GB) - 6.8 inch display",
        "description": "Kindle Paperwhite is thin, lightweight, and travels easily so you can enjoy your favorite books at any time.",
        "price": 13999.00,
        "stock": 75,
        "category": "Books",
        "image_main": "https://m.media-amazon.com/images/I/61nmCTbSCoL._SL1001_.jpg",
        "images": [
            "https://m.media-amazon.com/images/I/516ioi1kzGL._SL1001_.jpg",
            "https://m.media-amazon.com/images/I/615k-eig6RL._SL1001_.jpg"
        ],
        "specifications": {
            "Brand": "Amazon",
            "Display": "6.8 Inches",
            "Storage": "16 GB"
        }
    },
    {
        "name": "Logitech G502 Hero High Performance Wired Gaming Mouse",
        "description": "Hero 25K sensor through a software update from G HUB, this upgrade is free to all players.",
        "price": 3995.00,
        "stock": 150,
        "category": "Computers",
        "image_main": "https://m.media-amazon.com/images/I/61mpMH5TzkL._SL1500_.jpg",
        "images": [
            "https://m.media-amazon.com/images/I/71BYvNUoumL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71sgEIlSvfL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/612np2rcdBL._SL1500_.jpg"
        ],
        "specifications": {
            "Brand": "Logitech",
            "Movement Detection": "Optical",
            "Buttons": "11"
        }
    }
]

async def seed_db():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        
    async with SessionLocal() as db:
        # Check if already seeded to avoid duplicates
        from sqlalchemy import select
        result = await db.execute(select(Product))
        if result.first():
            print("Database already seeded.")
            return

        for p_data in sample_products:
            product = Product(**p_data)
            db.add(product)
        
        await db.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
