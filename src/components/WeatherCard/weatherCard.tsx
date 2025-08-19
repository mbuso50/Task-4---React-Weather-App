import React from 'react';
import type { WeatherData, TemperatureUnit } from '../variable-types/types';

interface WeatherCardProps {
  weatherData: WeatherData;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  unit,
  onToggleUnit
}) => {
  const temp = unit === 'C'
    ? weatherData.main?.temp ?? 0
    : ((weatherData.main?.temp ?? 0) * 9 / 5) + 32;

  const weatherCondition = weatherData.weather?.[0] ?? {
    icon: '',
    description: 'N/A'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">{weatherData.name || 'Unknown Location'}</h2>
        <button
          onClick={onToggleUnit}
          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-md dark:text-white"
        >
          °{unit}
        </button>
      </div>

      <div className="mt-4 flex items-center">
        {weatherCondition.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weatherCondition.icon}@2x.png`}
            alt={weatherCondition.description}
          />
        )}
        <span className="text-4xl font-bold ml-2 dark:text-white">
          {Math.round(temp)}°{unit}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-300">Humidity</p>
          <p className="dark:text-white">{weatherData.main?.humidity ?? 'N/A'}%</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-300">Wind</p>
          <p className="dark:text-white">{weatherData.wind?.speed ?? 'N/A'} m/s</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-300">Conditions</p>
          <p className="capitalize dark:text-white">
            {weatherCondition.description}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-300">Pressure</p>
          <p className="dark:text-white">{weatherData.main?.pressure ?? 'N/A'} hPa</p>
        </div>
      </div>
    </div>
  );
};