from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import get_db, engine, Base
from . import models, schemas
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Create database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the BrewIQ API!"}

@app.get("/api/dashboard", response_model=schemas.DashboardDataSchema)
def get_dashboard_data(db: Session = Depends(get_db)):
    stats = db.query(models.Stat).all()
    operations = db.query(models.OperationSummary).all()
    recent_ops = db.query(models.RecentOperation).all()
    products = db.query(models.Product).all()
    forecasts = db.query(models.Forecast).all()
    branches = db.query(models.Branch).all()

    # Mapping RecentOperation's from_loc and to_loc to from and to
    formatted_recent_ops = []
    for ro in recent_ops:
        formatted_recent_ops.append({
            "ref": ro.ref,
            "type": ro.type,
            "typeColor": ro.type_color,
            "from": ro.from_loc,
            "to": ro.to_loc,
            "item": ro.item,
            "qty": ro.qty,
            "status": ro.status,
            "statusColor": ro.status_color,
            "date": ro.date
        })

    return {
        "stats": [
            {
                "id": f"s{s.id}",
                "label": s.label,
                "value": s.value,
                "trend": s.trend,
                "trendType": s.trend_type
            } for s in stats
        ],
        "operations": [
            {
                "id": f"oc{o.id}",
                "label": o.label,
                "value": o.value,
                "sub": o.sub,
                "badge": o.badge,
                "badgeColor": o.badge_color
            } for o in operations
        ],
        "recentOperations": formatted_recent_ops,
        "products": products,
        "forecast": [
            {
                "day": f.day,
                "value": f.value,
                "color": f.color,
                "border": f.border,
                "desc": f.description
            } for f in forecasts
        ],
        "branches": [
            {
                "name": b.name,
                "loc": b.loc,
                "status": b.status,
                "statusColor": b.status_color,
                "capacity": b.capacity,
                "items": b.items,
                "value": b.value,
                "score": b.score,
                "util": b.util,
                "utilDesc": b.util_desc
            } for b in branches
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"} # Placeholder for actual DB health check

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
