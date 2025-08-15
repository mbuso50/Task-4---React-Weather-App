import React from 'react';
import type { WeatherData } from '../services/WeatherAPI';

interface WeatherCardProps {
  weatherData: WeatherData;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weatherData, 
  unit, 
  onToggleUnit 
}) => {
  const temp = unit === 'C' 
    ? weatherData.main.temp 
    : (weatherData.main.temp * 9/5) + 32;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">{weatherData.name}</h2>
        <button 
          onClick={onToggleUnit}
          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-md dark:text-white"
        >
          °{unit}
        </button>
      </div>
      
      <div className="mt-4 flex items-center">
        <img 
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
          alt={weatherData.weather[0].description}
        />
        <span className="text-4xl font-bold ml-2 dark:text-white">
          {Math.round(temp)}°{unit}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-300">Humidity</p>
          <p className="dark:text-white">{weatherData.main.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-300">Wind</p>
          <p className="dark:text-white">{weatherData.wind.speed} m/s</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-300">Conditions</p>
          <p className="capitalize dark:text-white">{weatherData.weather[0].description}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-300">Pressure</p>
          <p className="dark:text-white">{weatherData.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};