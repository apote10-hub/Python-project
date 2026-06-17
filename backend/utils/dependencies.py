from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from utils.auth import decode_token
from jose import JWTError

bearer = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
):
    try:
        token = credentials.credentials
        payload = decode_token(token)
        user = db.query(User).filter(User.id == int(payload['sub'])).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail='Invalid user')
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid token')

def admin_only(current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail='Admin access required')
    return current_user