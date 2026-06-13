from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.dependencies import admin_only
from pydantic import BaseModel

router = APIRouter(prefix='/users', tags=['Users'])

class RoleUpdate(BaseModel):
    role: str

@router.get('/')
def get_users(db: Session = Depends(get_db), _=Depends(admin_only)):
    return db.query(User).all()

@router.put('/{id}/role')
def update_role(id: int, data: RoleUpdate, db: Session = Depends(get_db), _=Depends(admin_only)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    user.role = data.role
    db.commit()
    return {'message': 'Role updated'}

@router.put('/{id}/deactivate')
def deactivate_user(id: int, db: Session = Depends(get_db), _=Depends(admin_only)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    user.is_active = False
    db.commit()
    return {'message': 'User deactivated'}