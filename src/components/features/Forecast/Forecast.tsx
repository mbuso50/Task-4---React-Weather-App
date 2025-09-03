
import React from 'react';

interface ForecastItem {
  dt: number;
  temp: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

interface ForecastProps {
  hourly: ForecastItem[];
  daily: ForecastItem[];
  unit: 'metric' | 'imperial';
}

const Forecast: React.FC<ForecastProps> = ({ hourly, daily, unit }) => {
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Don't render if both arrays are empty
  if (hourly.length === 0 && daily.length === 0) {
    return null;
  }

  return (
    <div className="forecast-container">
      {hourly.length > 0 && (
        <div className="hourly-forecast card">
          <div className="card-header">
            <h3 className="card-title">Hourly Forecast</h3>
          </div>
          <div className="forecast-scroll">
            {hourly.slice(0, 24).map((item, index) => (
              <div key={index} className="forecast-item">
                <p>{formatTime(item.dt)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather.icon}.png`}
                  alt={item.weather.description}
                />
                <p>{Math.round(item.temp)}{temperatureUnit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {daily.length > 0 && (
        <div className="daily-forecast card">
          <div className="card-header">
            <h3 className="card-title">Daily Forecast</h3>
          </div>
          {daily.slice(0, 7).map((item, index) => (
            <div key={index} className="forecast-item">
              <p>{formatDate(item.dt)}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather.icon}.png`}
                alt={item.weather.description}
              />
              <p>{Math.round(item.temp)}{temperatureUnit}</p>
              <p>{item.weather.main}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forecast;