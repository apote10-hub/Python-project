from fastapi import APIRouter
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix='/weather', tags=['Weather'])

WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
CITY = 'Kathmandu'


def get_suggestions(condition, temp):

    condition = condition.lower()

    if 'rain' in condition:
        return [
            'umbrellas',
            'raincoats',
            'waterproof bags',
            'gumboots'
        ]

    elif 'clear' in condition and temp > 25:
        return [
            'cold drinks',
            'sunscreen',
            'fans',
            'cotton clothing'
        ]

    elif temp < 10:
        return [
            'heaters',
            'jackets',
            'blankets',
            'hot beverages'
        ]

    elif 'cloud' in condition:
        return [
            'light jackets',
            'umbrellas'
        ]

    return ['general seasonal items']


@router.get('/suggestions')
async def weather_suggestions():

    if not WEATHER_API_KEY:
        return {
            'error': 'Weather API key not found'
        }

    url = (
        f'https://api.openweathermap.org/data/2.5/weather'
        f'?q={CITY}&appid={WEATHER_API_KEY}&units=metric'
    )

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
        'advice': f'Current weather in {CITY}: {condition} at {temp}°C. Consider stocking: {", ".join(suggestions)}'
    }