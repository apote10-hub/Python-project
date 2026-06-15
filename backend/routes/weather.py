from fastapi import APIRouter
import httpx
import os
from dotenv import load_dotenv
load_dotenv()
 
router = APIRouter(prefix='/weather', tags=['Weather'])
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
CITY = 'Kathmandu'
 
def get_suggestions(condition: str, temp: float):
   condition = condition.lower()
   if 'rain' in condition:
       return ['umbrellas', 'raincoats', 'waterproof bags', 'gumboots']
   elif 'clear' in condition and temp > 25:
       return ['cold drinks', 'sunscreen', 'fans', 'cotton clothing']
   elif temp < 10:
       return ['heaters', 'jackets', 'blankets', 'hot beverages']
   elif 'snow' in condition:
       return ['warm clothing', 'heaters', 'hot beverages', 'boots']
   else:
       return ['light jackets', 'umbrellas']
 
@router.get('/suggestions')
async def weather_suggestions():
   if not WEATHER_API_KEY:
       return {'error': 'Weather API key not set in .env file'}
   url = f'https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={WEATHER_API_KEY}&units=metric'
   async with httpx.AsyncClient() as client:
       response = await client.get(url)
       data = response.json()
   condition = data['weather'][0]['description']
   temp = data['main']['temp']
   suggestions = get_suggestions(condition, temp)
   return {
       'city': CITY,
       'weather': condition,
       'temperature_celsius': temp,
       'stock_suggestions': suggestions,
       'advice': f'Current weather: {condition} at {temp}C. Stock up on: {", ".join(suggestions)}'
   }
 