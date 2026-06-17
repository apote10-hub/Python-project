from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.transaction import Transaction
from models.product import Product
from models.alert import Alert
from datetime import datetime, timedelta

router = APIRouter(tags=['Reports'])

@router.get('/reports/movement')
def stock_movement(db: Session = Depends(get_db)):
    stock_in = db.query(func.sum(Transaction.quantity)).filter(Transaction.type == 'stock_in').scalar() or 0
    stock_out = db.query(func.sum(Transaction.quantity)).filter(Transaction.type == 'stock_out').scalar() or 0
    top_products = db.query(
        Product.name, func.sum(Transaction.quantity).label('total_out')
    ).join(Transaction, Transaction.product_id == Product.id
    ).filter(Transaction.type == 'stock_out'
    ).group_by(Product.name).order_by(func.sum(Transaction.quantity).desc()).limit(5).all()
    return {
        'total_stock_in': int(stock_in),
        'total_stock_out': int(stock_out),
        'top_selling_products': [{'name': r[0], 'units_sold': int(r[1])} for r in top_products]
    }

@router.get('/reports/dead-stock')
def dead_stock(days: int = 30, db: Session = Depends(get_db)):
    cutoff = datetime.utcnow() - timedelta(days=days)
    active_ids = db.query(Transaction.product_id).filter(Transaction.created_at >= cutoff).distinct().all()
    active_ids = [r[0] for r in active_ids]
    dead = db.query(Product).filter(~Product.id.in_(active_ids), Product.quantity > 0).all()
    return {
        'days_threshold': days,
        'dead_stock_count': len(dead),
        'products': [{'id': p.id, 'name': p.name, 'quantity': p.quantity, 'category': p.category} for p in dead]
    }

@router.get('/alerts')
def get_alerts(db: Session = Depends(get_db)):
    low_stock = db.query(Product).filter(Product.quantity <= Product.min_stock_level).all()
    alerts = []
    for p in low_stock:
        alerts.append({
            'type': 'low_stock',
            'product': p.name,
            'quantity': p.quantity,
            'min_level': p.min_stock_level,
            'message': f'{p.name} is low on stock: {p.quantity} remaining'
        })
    return {'total_alerts': len(alerts), 'alerts': alerts}

@router.put('/alerts/{id}/read')
def mark_read(id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == id).first()
    if alert:
        alert.is_read = True
        db.commit()
    return {'message': 'Alert marked as read'}