from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product
from schemas import ProductCreate
from typing import List
from datetime import date, timedelta

router = APIRouter()

# Get all products
@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

# Get single product
@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Add new product
@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(
        name=product.name,
        category=product.category,
        sku=product.sku,
        quantity=product.quantity,
        min_stock_level=product.min_stock_level,
        buy_price=product.buy_price,
        sell_price=product.sell_price,
        expiry_date=product.expiry_date
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# Update product
@router.put("/{product_id}")
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.name = product.name
    db_product.category = product.category
    db_product.sku = product.sku
    db_product.quantity = product.quantity
    db_product.min_stock_level = product.min_stock_level
    db_product.buy_price = product.buy_price
    db_product.sell_price = product.sell_price
    db_product.expiry_date = product.expiry_date
    db.commit()
    db.refresh(db_product)
    return db_product

# Delete product
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}

# Smart Feature 1 — Low stock alert
@router.get("/alerts/lowstock")
def low_stock_alert(db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.quantity <= Product.min_stock_level
    ).all()
    return products

# Smart Feature 2 — Expiry alert
@router.get("/alerts/expiry")
def expiry_alert(db: Session = Depends(get_db)):
    threshold = date.today() + timedelta(days=30)
    products = db.query(Product).filter(
        Product.expiry_date != None,
        Product.expiry_date <= threshold
    ).all()
    return products