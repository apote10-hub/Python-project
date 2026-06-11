from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Transaction, Product
from datetime import date

router = APIRouter()

# Smart Feature 3 — Most and Least Selling Products
@router.get("/selling")
def selling_products(db: Session = Depends(get_db)):
    results = db.query(
        Transaction.product_id,
        func.sum(Transaction.quantity).label("total_sold"),
        Product.name
    ).join(Product).filter(
        Transaction.type == "stock_out"
    ).group_by(
        Transaction.product_id, Product.name
    ).order_by(
        func.sum(Transaction.quantity).desc()
    ).all()

    products = [{"product_id": r.product_id, "name": r.name, "total_sold": r.total_sold} for r in results]

    return {
        "most_selling": products[:5],
        "least_selling": products[-5:]
    }

# Smart Feature 4 — Season Recommendations
@router.get("/season")
def season_recommendation(db: Session = Depends(get_db)):
    month = date.today().month
    if month in [10, 11, 12, 1, 2]:
        season = "Winter"
        categories = ["jacket", "sweater", "heater", "blanket", "boots"]
    else:
        season = "Summer"
        categories = ["fan", "sunscreen", "cold drink", "shorts", "sandals"]

    return {
        "current_season": season,
        "recommended_categories": categories,
        "message": f"Stock up on {season} products now!"
    }

# Smart Feature 5 — Dashboard Stats
@router.get("/dashboard")
def dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    low_stock = db.query(Product).filter(
        Product.quantity <= Product.min_stock_level
    ).count()
    total_transactions = db.query(Transaction).count()
    stock_in = db.query(func.sum(Transaction.quantity)).filter(
        Transaction.type == "stock_in"
    ).scalar() or 0
    stock_out = db.query(func.sum(Transaction.quantity)).filter(
        Transaction.type == "stock_out"
    ).scalar() or 0

    return {
        "total_products": total_products,
        "low_stock_count": low_stock,
        "total_transactions": total_transactions,
        "total_stock_in": stock_in,
        "total_stock_out": stock_out
    }