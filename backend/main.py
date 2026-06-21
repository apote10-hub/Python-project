from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.stock import router as stock_router
from routes.festivals import router as festivals_router
from routes.weather import router as weather_router
from routes.reports import router as reports_router
from routes.products import router as products_router
from routes.notifications import router as notifications_router


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
app.include_router(products_router)
app.include_router(stock_router)
app.include_router(festivals_router)
app.include_router(weather_router)
app.include_router(reports_router)
app.include_router(notifications_router)

@app.get("/")
def root():
    return {
        "message": "Smart Inventory API is running",
        "version": "1.0.0",
        "date": "2026"
    }