import React from "react";

interface ForecastItem {
  dt: number;
  temp: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  pop?: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

interface ForecastProps {
  hourly: ForecastItem[];
  daily: ForecastItem[];
  unit: "metric" | "imperial";
}

const Forecast: React.FC<ForecastProps> = ({ hourly, daily, unit }) => {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  const formatTime = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDay = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

  const rainChance = (pop: number | undefined) =>
    pop !== undefined ? `${Math.round(pop * 100)}%` : "—";

  if (hourly.length === 0 && daily.length === 0) return null;

  return (
    <div className="forecast-container">
      {/* ── Hourly Forecast ── */}
      {hourly.length > 0 && (
        <div className="forecast-section card">
          <div className="card-header">
            <h3 className="card-title">Hourly Forecast</h3>
          </div>
          <div className="forecast-scroll">
            {hourly.slice(0, 24).map((item, index) => (
              <div key={index} className="forecast-item hourly-item">
                {/* Time */}
                <p className="forecast-time">{formatTime(item.dt)}</p>

                {/* Weather icon */}
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather.icon}@2x.png`}
                  alt={item.weather.description}
                  className="forecast-icon"
                />

                {/* Temperature */}
                <p className="forecast-temp">
                  {Math.round(item.temp)}
                  {tempUnit}
                </p>

                {/* Rain chance */}
                <p className="forecast-rain" title="Chance of rain">
                  {rainChance(item.pop)}
                </p>

                {/* Humidity */}
                {item.humidity !== undefined && (
                  <p className="forecast-humidity" title="Humidity">
                    {item.humidity}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Daily Forecast ── */}
      {daily.length > 0 && (
        <div className="forecast-section card">
          <div className="card-header">
            <h3 className="card-title">7-Day Forecast</h3>
          </div>
          <div className="daily-list">
            {daily.slice(0, 7).map((item, index) => (
              <div key={index} className="forecast-item daily-item">
                {/* Day label */}
                <p className="forecast-day">
                  {index === 0 ? "Today" : formatDay(item.dt)}
                </p>

                {/* Weather icon + description */}
                <div className="forecast-weather-info">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather.icon}@2x.png`}
                    alt={item.weather.description}
                    className="forecast-icon"
                  />
                  <span className="forecast-desc">{item.weather.main}</span>
                </div>

                {/* Temperature */}
                <p className="forecast-temp">
                  {Math.round(item.temp)}
                  {tempUnit}
                </p>

                {/* Feels like */}
                {item.feels_like !== undefined && (
                  <p className="forecast-feels">
                    Feels {Math.round(item.feels_like)}
                    {tempUnit}
                  </p>
                )}

                {/* Rain chance */}
                <p className="forecast-rain" title="Chance of rain">
                  {rainChance(item.pop)}
                </p>

                {/* Humidity */}
                {item.humidity !== undefined && (
                  <p className="forecast-humidity">{item.humidity}%</p>
                )}

                {/* Wind speed */}
                {item.wind_speed !== undefined && (
                  <p className="forecast-wind">
                    {item.wind_speed} {windUnit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecast;
