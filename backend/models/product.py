from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime
from sqlalchemy.sql import func
from database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100))
    sku = Column(String(100), unique=True)
    quantity = Column(Integer, default=0)
    min_stock_level = Column(Integer, default=5)
    buy_price = Column(Numeric(10, 2))
    sell_price = Column(Numeric(10, 2))
    expiry_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())