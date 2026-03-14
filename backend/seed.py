import json
import os
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend import models

def seed_db():
    # Load JSON data
    # The path should be relative to the project root
    json_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "dashboardData.json")
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    db = SessionLocal()
    
    try:
        # Clear existing data to avoid duplicates if re-running
        db.query(models.Stat).delete()
        db.query(models.OperationSummary).delete()
        db.query(models.RecentOperation).delete()
        db.query(models.Product).delete()
        db.query(models.Forecast).delete()
        db.query(models.Branch).delete()
        db.query(models.AIReply).delete()
        db.query(models.User).delete()
        
        # Seed Stats
        for s in data["stats"]:
            db_stat = models.Stat(
                label=s["label"],
                value=str(s["value"]),
                trend=s["trend"],
                trend_type=s["trendType"]
            )
            db.add(db_stat)
            
        # Seed OperationSummaries
        for op in data["operations"]:
            db_op = models.OperationSummary(
                label=op["label"],
                value=op["value"],
                sub=op["sub"],
                badge=op["badge"],
                badge_color=op["badgeColor"]
            )
            db.add(db_op)
            
        # Seed RecentOperations
        for ro in data["recentOperations"]:
            db_ro = models.RecentOperation(
                ref=ro["ref"],
                type=ro["type"],
                type_color=ro["typeColor"],
                from_loc=ro["from"],
                to_loc=ro["to"],
                item=ro["item"],
                qty=ro["qty"],
                status=ro["status"],
                status_color=ro["statusColor"],
                date=ro["date"]
            )
            db.add(db_ro)
            
        # Seed Products
        rich_products = [
            # Mumbai Branch
            {"sku": "CB-001", "name": "Arabica Coffee Beans", "category": "Coffee", "categoryColor": "amber", "branch": "Mumbai", "onHand": 2.1, "unit": "kg", "forecast": -2.9, "rule": "Min-Max", "price": "₹850/kg", "status": "Critical", "statusColor": "red", "progress": 8},
            {"sku": "CB-002", "name": "Robusta Coffee Beans", "category": "Coffee", "categoryColor": "amber", "branch": "Mumbai", "onHand": 15.0, "unit": "kg", "forecast": 5.0, "rule": "Min-Max", "price": "₹650/kg", "status": "OK", "statusColor": "green", "progress": 75},
            {"sku": "ML-001", "name": "Whole Milk", "category": "Dairy", "categoryColor": "sky", "branch": "Mumbai", "onHand": 45.0, "unit": "L", "forecast": 12.0, "rule": "Min-Max", "price": "₹65/L", "status": "OK", "statusColor": "green", "progress": 85},
            {"sku": "SY-001", "name": "Vanilla Syrup", "category": "Syrups", "categoryColor": "berry", "branch": "Mumbai", "onHand": 1.0, "unit": "btl", "forecast": -2.0, "rule": "Urgent", "price": "₹420/btl", "status": "Critical", "statusColor": "red", "progress": 10},
            {"sku": "CR-001", "name": "Butter Croissants", "category": "Bakery", "categoryColor": "caramel", "branch": "Mumbai", "onHand": 6.0, "unit": "pcs", "forecast": -34.0, "rule": "Daily", "price": "₹120/pc", "status": "Critical", "statusColor": "red", "progress": 15},
            
            # Pune Branch
            {"sku": "ML-002", "name": "Whole Milk", "category": "Dairy", "categoryColor": "sky", "branch": "Pune", "onHand": 32.0, "unit": "L", "forecast": 18.0, "rule": "Min-Max", "price": "₹65/L", "status": "OK", "statusColor": "green", "progress": 64},
            {"sku": "ML-003", "name": "Oat Milk", "category": "Dairy Alt", "categoryColor": "sky", "branch": "Pune", "onHand": 4.0, "unit": "L", "forecast": 16.0, "rule": "MTO", "price": "₹160/L", "status": "Low", "statusColor": "amber", "progress": 20},
            {"sku": "CB-003", "name": "Espresso Roast", "category": "Coffee", "categoryColor": "amber", "branch": "Pune", "onHand": 8.4, "unit": "kg", "forecast": -1.5, "rule": "Min-Max", "price": "₹920/kg", "status": "Low", "statusColor": "amber", "progress": 35},
            {"sku": "SY-002", "name": "Caramel Syrup", "category": "Syrups", "categoryColor": "berry", "branch": "Pune", "onHand": 12.0, "unit": "btl", "forecast": 4.0, "rule": "Min-Max", "price": "₹450/btl", "status": "OK", "statusColor": "green", "progress": 90},
            {"sku": "BK-001", "name": "Chocolate Muffins", "category": "Bakery", "categoryColor": "caramel", "branch": "Pune", "onHand": 2.0, "unit": "pcs", "forecast": -10.0, "rule": "Daily", "price": "₹95/pc", "status": "Expiring", "statusColor": "red", "progress": 5},
            
            # Delhi Branch
            {"sku": "CB-004", "name": "Cold Brew Blend", "category": "Coffee", "categoryColor": "amber", "branch": "Delhi", "onHand": 18.0, "unit": "kg", "forecast": 10.0, "rule": "Min-Max", "price": "₹880/kg", "status": "OK", "statusColor": "green", "progress": 80},
            {"sku": "ML-004", "name": "Almond Milk", "category": "Dairy Alt", "categoryColor": "sky", "branch": "Delhi", "onHand": 3.0, "unit": "L", "forecast": 15.0, "rule": "MTO", "price": "₹180/L", "status": "Low", "statusColor": "amber", "progress": 15},
            {"sku": "SY-003", "name": "Hazelnut Syrup", "category": "Syrups", "categoryColor": "berry", "branch": "Delhi", "onHand": 0.5, "unit": "btl", "forecast": -4.5, "rule": "Urgent", "price": "₹420/btl", "status": "Critical", "statusColor": "red", "progress": 5},
            {"sku": "ML-005", "name": "Fresh Cream", "category": "Dairy", "categoryColor": "sky", "branch": "Delhi", "onHand": 2.0, "unit": "L", "forecast": -8.0, "rule": "Urgent", "price": "₹210/L", "status": "Critical", "statusColor": "red", "progress": 10},
            {"sku": "TP-001", "name": "Paper Cups 8oz", "category": "Packaging", "categoryColor": "mocha", "branch": "Delhi", "onHand": 1200.0, "unit": "pcs", "forecast": 500.0, "rule": "Bulk", "price": "₹4/pc", "status": "OK", "statusColor": "green", "progress": 95}
        ]
        
        for p in rich_products:
            db_p = models.Product(
                sku=p["sku"],
                name=p["name"],
                category=p["category"],
                category_color=p["categoryColor"],
                branch=p["branch"],
                on_hand=p["onHand"],
                unit=p["unit"],
                forecast=p["forecast"],
                rule=p["rule"],
                price=p["price"],
                status=p["status"],
                status_color=p["statusColor"],
                progress=p["progress"]
            )
            db.add(db_p)
            
        # Seed Forecasts
        for f in data["forecast"]:
            db_f = models.Forecast(
                day=f["day"],
                value=f["value"],
                color=f["color"],
                border=f.get("border"),
                description=f["desc"]
            )
            db.add(db_f)
            
        # Seed Branches
        for b in data["branches"]:
            db_b = models.Branch(
                name=b["name"],
                loc=b["loc"],
                status=b["status"],
                status_color=b["statusColor"],
                capacity=b["capacity"],
                items=b["items"],
                value=b["value"],
                score=b["score"],
                util=b["util"],
                util_desc=b["utilDesc"]
            )
            db.add(db_b)
            
        # Seed AI Replies
        for q, r in data["aiReplies"].items():
            db_reply = models.AIReply(
                question=q,
                reply=r
            )
            db.add(db_reply)
            
        # Seed Default User
        db_user = models.User(
            email="admin@brewiq.com",
            password="password123",
            name="BrewIQ Admin",
            role="System Manager"
        )
        db.add(db_user)
            
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.close()

import mysql.connector
from mysql.connector import errorcode
from backend.database import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DB

def create_database():
    try:
        cnx = mysql.connector.connect(user=MYSQL_USER, password=MYSQL_PASSWORD, host=MYSQL_HOST, port=MYSQL_PORT)
        cursor = cnx.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DB} DEFAULT CHARACTER SET 'utf8'")
        print(f"Database {MYSQL_DB} created or already exists.")
        cnx.close()
    except mysql.connector.Error as err:
        print(f"Failed creating database: {err}")
        # We don't exit here because the DB might already exist and SQLAlchemy might handle it,
        # but usually this means connection failed altogether.

if __name__ == "__main__":
    create_database()
    # Ensure tables are created
    models.Base.metadata.create_all(bind=engine)
    seed_db()
