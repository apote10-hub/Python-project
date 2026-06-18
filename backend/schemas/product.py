from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = None
    sku: Optional[str] = None
    quantity: int = 0
    min_stock_level: int = 5
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None
    expiry_date: Optional[date] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    quantity: Optional[int] = None
    min_stock_level: Optional[int] = None
    buy_price: Optional[float] = None
    sell_price: Optional[float] = None
    expiry_date: Optional[date] = None

class ProductOut(BaseModel):
    id: int
    name: str
    category: Optional[str]
    sku: Optional[str]
    quantity: int
    min_stock_level: int
    buy_price: Optional[float]
    sell_price: Optional[float]
    expiry_date: Optional[date]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True