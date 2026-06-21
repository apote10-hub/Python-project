from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.product import Product
from pydantic import BaseModel
from typing import Optional
from datetime import date, timedelta

router = APIRouter(prefix="/products", tags=["Products"])

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    sku: Optional[str] = None
    quantity: int = 0
    min_stock_level: int = 5
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None
    expiry_date: Optional[date] = None

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/alerts/lowstock")
def low_stock_alert(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.quantity <= Product.min_stock_level).all()

@router.get("/alerts/expiry")
def expiry_alert(db: Session = Depends(get_db)):
    threshold = date.today() + timedelta(days=30)
    return db.query(Product).filter(
        Product.expiry_date != None,
        Product.expiry_date <= threshold
    ).all()

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/{product_id}")
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}