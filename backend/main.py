from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.stock import router as stock_router
from routes.festivals import router as festivals_router
from routes.weather import router as weather_router
from routes.reports import router as reports_router

app = FastAPI(
    title="Smart Inventory Management System",
    description="Inventory management API built for the Nepali market",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True
)