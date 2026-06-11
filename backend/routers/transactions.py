from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Transaction, Product
from schemas import TransactionCreate

router = APIRouter()

# Log a transaction
@router.post("/")
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == transaction.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if transaction.type == "stock_in":
        product.quantity += transaction.quantity
    elif transaction.type == "stock_out":
        if product.quantity < transaction.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")
        product.quantity -= transaction.quantity

    new_transaction = Transaction(
        product_id=transaction.product_id,
        type=transaction.type,
        quantity=transaction.quantity,
        note=transaction.note,
        user_id=1
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

# Get all transactions
@router.get("/")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()