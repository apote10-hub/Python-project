from sqlalchemy import Column, Integer, String, Enum, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Alert(Base):
    __tablename__ = 'stock_alerts'
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=True)
    alert_type = Column(Enum('low_stock', 'expiry'), nullable=False)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())