import React from 'react';
import type { ForecastData, TemperatureUnit } from '../../variable-types/types';

interface ForecastProps {
  forecastData: ForecastData;
  unit: TemperatureUnit;
}

export const Forecast: React.FC<ForecastProps> = ({ forecastData, unit }) => {
  const dailyForecast = forecastData.list?.reduce((acc: any, item: any) => {
    const date = item.dt_txt?.split(' ')[0];
    if (!date) return acc;

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {}) || {};

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(dailyForecast).map(([date, items]: [string, any]) => {
          const dayTemp = items[0]?.main?.temp ?? 0;
          const displayTemp = unit === 'C'
            ? Math.round(dayTemp)
            : Math.round((dayTemp * 9 / 5) + 32);

          return (
            <div key={date} className="bg-white p-3 rounded shadow">
              <p className="font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <img
                src={`https://openweathermap.org/img/wn/${items[0]?.weather?.[0]?.icon}.png`}
                alt={items[0]?.weather?.[0]?.description || 'Weather icon'}
              />
              <p>
                {displayTemp}°{unit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};