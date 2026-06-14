from routes.festivals import router as festivals_router
from routes.weather import router as weather_router
app.include_router(festivals_router)
app.include_router(weather_router)