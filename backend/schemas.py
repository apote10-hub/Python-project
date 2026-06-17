from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "staff"

class UserLogin(BaseModel):
    username: str
    password: str

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    sku: Optional[str] = None
    quantity: int = 0
    min_stock_level: int = 5
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None
    expiry_date: Optional[date] = None

class TransactionCreate(BaseModel):
    product_id: int
    type: str
    quantity: int
    note: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str