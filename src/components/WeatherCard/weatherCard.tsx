import React from 'react';
import type { WeatherCardProps } from '../variable-types/types';
import './WeatherCard.css';

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  unit,
  onToggleUnit,
  showHourly = false,
  onToggleView
}) => {
  const temperature = weatherData.main?.temp ?? 'N/A';
  const humidity = weatherData.main?.humidity ?? 'N/A';
  const windSpeed = weatherData.wind?.speed ?? 'N/A';
  const pressure = weatherData.main?.pressure ?? 'N/A';
  const conditions = weatherData.weather?.[0]?.description ?? 'N/A';
  const icon = weatherData.weather?.[0]?.icon;
  const location = weatherData.name || 'Unknown Location';

  const getTemperatureSymbol = () => {
    return unit === 'metric' ? '°C' : '°F';
  };

  const getWindSpeedUnit = () => {
    return unit === 'metric' ? 'm/s' : 'mph';
  };

  return (
    <div className="weather-card card">
      <div className="weather-header">
        <h2 className="weather-location">{location}</h2>
        <button
          onClick={onToggleUnit}
          className="btn btn-secondary btn-small unit-toggle"
          aria-label={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
        >
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      </div>

      {onToggleView && (
        <button
          onClick={onToggleView}
          className="btn btn-secondary btn-small view-toggle"
        >
          {showHourly ? 'Show Daily' : 'Show Hourly'}
        </button>
      )}

      <div className="weather-main">
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={conditions}
            className="weather-icon"
          />
        )}
        <div className="temperature">
          {typeof temperature === 'number' ? Math.round(temperature) : temperature}
          <span className="temperature-unit">{getTemperatureSymbol()}</span>
        </div>
        <p className="weather-description">{conditions}</p>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">
            {typeof windSpeed === 'number' ? windSpeed.toFixed(1) : windSpeed} {getWindSpeedUnit()}
          </span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{pressure} hPa</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">
            {weatherData.main?.feels_like ? Math.round(weatherData.main.feels_like) : 'N/A'}
            {getTemperatureSymbol()}
          </span>
        </div>
      </div>

      {showHourly && (
        <div className="hourly-forecast">
          <h3>Hourly Forecast</h3>
          <div className="hourly-items">
            {/* This would be populated with hourly data */}
            <div className="hourly-item">
              <span>12:00</span>
              <span>25°C</span>
            </div>
            {/* Add more hourly items */}
          </div>
        </div>
      )}
    </div>
  );
};