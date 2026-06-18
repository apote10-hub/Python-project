from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.stock import router as stock_router

app = FastAPI(
    title="Smart Inventory Management System",
    description="Inventory management API built for the Nepali market",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
<<<<<<< HEAD
app.include_router(stock_router)
=======
from routes.users import router as users_router
app.include_router(users_router)
>>>>>>> origin/sagal/feature

@app.get("/")
def root():
    return {
        "message": "Smart Inventory API is running",
        "version": "1.0.0",
        "date": "2026"
    }