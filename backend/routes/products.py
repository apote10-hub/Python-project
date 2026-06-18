from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from database import get_db
from models.product import Product
from schemas.product import ProductCreate, ProductUpdate, ProductOut
from utils.dependencies import get_current_user, admin_only

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Product).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db), current_user=Depends(admin_only)):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db), current_user=Depends(admin_only)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in product.dict(exclude_unset=True).items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user=Depends(admin_only)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}


@router.get("/alerts/lowstock", response_model=list[ProductOut])
def low_stock_alert(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Product).filter(Product.quantity <= Product.min_stock_level).all()


@router.get("/alerts/expiry", response_model=list[ProductOut])
def expiry_alert(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    threshold = date.today() + timedelta(days=30)
    return db.query(Product).filter(
        Product.expiry_date != None,
        Product.expiry_date <= threshold
    ).all()