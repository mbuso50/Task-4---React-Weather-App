import type { WeatherData, ForecastData } from '../variable-types/types';

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message || 'Failed to fetch weather data');
    }

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchForecast = async (location: string): Promise<ForecastData> => {
  try {
    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message || 'Failed to fetch forecast data');
    }

    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};