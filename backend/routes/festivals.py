from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Date, Numeric
from database import get_db, Base
from datetime import date
 
class Festival(Base):
   __tablename__ = 'festivals'
   id = Column(Integer, primary_key=True)
   name = Column(String(100))
   start_date = Column(Date)
   end_date = Column(Date)
   surge_multiplier = Column(Numeric(3,1))
   affected_categories = Column(String(255))
 
router = APIRouter(prefix='/festivals', tags=['Festivals'])
 
@router.get('/upcoming')
def upcoming_festivals(db: Session = Depends(get_db)):
   today = date.today()
   festivals = db.query(Festival).filter(Festival.end_date >= today).order_by(Festival.start_date).all()
   result = []
   for f in festivals:
       days_until = (f.start_date - today).days
       result.append({
           'name': f.name,
           'start_date': str(f.start_date),
           'end_date': str(f.end_date),
           'days_until': days_until,
           'surge_multiplier': float(f.surge_multiplier),
           'affected_categories': f.affected_categories.split(',')
       })
   return result
 
@router.get('/suggestions')
def festival_suggestions(db: Session = Depends(get_db)):
   today = date.today()
   upcoming = db.query(Festival).filter(Festival.start_date >= today).order_by(Festival.start_date).first()
   if not upcoming:
       return {'message': 'No upcoming festivals', 'suggestions': []}
   days_until = (upcoming.start_date - today).days
   categories = upcoming.affected_categories.split(',')
   return {
       'festival': upcoming.name,
       'days_until': days_until,
       'surge_multiplier': float(upcoming.surge_multiplier),
       'stock_up_categories': categories,
       'advice': f'Stock up {float(upcoming.surge_multiplier)}x on {", ".join(categories)} before {upcoming.name}'
   }