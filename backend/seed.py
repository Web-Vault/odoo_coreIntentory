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
        for p in data["products"]:
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
