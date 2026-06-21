from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.product import Product
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
load_dotenv()

router = APIRouter(prefix='/notifications', tags=['Notifications'])

class EmailRequest(BaseModel):
    email: str

@router.post('/send-low-stock-alert')
def send_low_stock_alert(request: EmailRequest, db: Session = Depends(get_db)):
    low_stock = db.query(Product).filter(Product.quantity <= Product.min_stock_level).all()
    
    if not low_stock:
        return {'message': 'No low stock items found'}
    
    product_list = '\n'.join([
        f'- {p.name}: {p.quantity} units remaining (min: {p.min_stock_level})'
        for p in low_stock
    ])
    
    try:
        msg = MIMEMultipart()
        msg['From'] = os.getenv('MAIL_USERNAME')
        msg['To'] = request.email
        msg['Subject'] = 'Low Stock Alert — Smart Inventory System'
        
        body = f'''Dear Admin,

The following products are running low on stock:

{product_list}

Please restock these items as soon as possible.

Best regards,
Smart Inventory Management System'''
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(os.getenv('MAIL_USERNAME'), os.getenv('MAIL_PASSWORD'))
        server.sendmail(os.getenv('MAIL_USERNAME'), request.email, msg.as_string())
        server.quit()
        
        return {'message': f'Low stock alert sent to {request.email}'}
    except Exception as e:
        return {'error': str(e)}

@router.post('/send-expiry-alert')
def send_expiry_alert(request: EmailRequest, db: Session = Depends(get_db)):
    from datetime import date, timedelta
    threshold = date.today() + timedelta(days=30)
    expiring = db.query(Product).filter(
        Product.expiry_date != None,
        Product.expiry_date <= threshold
    ).all()
    
    if not expiring:
        return {'message': 'No expiring products found'}
    
    product_list = '\n'.join([
        f'- {p.name}: expires on {p.expiry_date}'
        for p in expiring
    ])
    
    try:
        msg = MIMEMultipart()
        msg['From'] = os.getenv('MAIL_USERNAME')
        msg['To'] = request.email
        msg['Subject'] = 'Expiry Alert — Smart Inventory System'
        
        body = f'''Dear Admin,

The following products are expiring within 30 days:

{product_list}

Please take action immediately.

Best regards,
Smart Inventory Management System'''
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(os.getenv('MAIL_USERNAME'), os.getenv('MAIL_PASSWORD'))
        server.sendmail(os.getenv('MAIL_USERNAME'), request.email, msg.as_string())
        server.quit()
        
        return {'message': f'Expiry alert sent to {request.email}'}
    except Exception as e:
        return {'error': str(e)}