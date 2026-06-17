from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.transaction import Transaction
from models.product import Product
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import io

router = APIRouter(tags=["Stock"])

class StockInput(BaseModel):
    product_id: int
    quantity: int
    note: Optional[str] = None
    user_id: int = 1

@router.post("/stock/in")
def stock_in(data: StockInput, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.quantity += data.quantity
    txn = Transaction(product_id=data.product_id, type="stock_in",
                      quantity=data.quantity, note=data.note, user_id=data.user_id)
    db.add(txn)
    db.commit()
    return {"message": "Stock added", "new_quantity": product.quantity}

@router.post("/stock/out")
def stock_out(data: StockInput, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.quantity < data.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    product.quantity -= data.quantity
    txn = Transaction(product_id=data.product_id, type="stock_out",
                      quantity=data.quantity, note=data.note, user_id=data.user_id)
    db.add(txn)
    db.commit()
    return {"message": "Stock removed", "new_quantity": product.quantity}

@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.created_at.desc()).all()

@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    low_stock = db.query(Product).filter(Product.quantity <= Product.min_stock_level).count()
    total_transactions = db.query(Transaction).count()
    total_value = db.query(func.sum(Product.quantity * Product.sell_price)).scalar() or 0
    return {
        "total_products": total_products,
        "low_stock_count": low_stock,
        "total_transactions": total_transactions,
        "total_stock_value_npr": round(float(total_value), 2)
    }

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    data = [{
        "ID": p.id, "Name": p.name, "Category": p.category,
        "SKU": p.sku, "Quantity": p.quantity,
        "Min Stock": p.min_stock_level,
        "Buy Price (NPR)": p.buy_price,
        "Sell Price (NPR)": p.sell_price,
        "Expiry Date": p.expiry_date
    } for p in products]
    df = pd.DataFrame(data)
    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=inventory.csv"}
    )