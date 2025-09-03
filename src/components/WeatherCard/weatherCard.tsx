// src/components/WeatherCard/WeatherCard.tsx
import React from 'react';
import '../../App.css';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  description?: string;
  children?: React.ReactNode;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  value,
  unit,
  icon,
  description,
  children,
}) => {
  return (
    <div className="weather-card card">
      <div className="weather-card-header">
        <h3>{title}</h3>
        {icon && <img src={icon} alt={description} className="weather-icon" />}
      </div>
      <div className="weather-card-content">
        <div className="weather-value">
          {value} {unit && <span className="weather-unit">{unit}</span>}
        </div>
        {description && <p className="weather-description">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default WeatherCard;