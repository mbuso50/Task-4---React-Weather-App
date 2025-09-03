// src/components/pages/Home-page.tsx
import React, { useState } from 'react';
import { useWeatherApp } from '../hooks/useWeatherApp';
import WeatherCard from '../WeatherCard/weatherCard';
import LocationList from '../features/LocationList/LocationList';
import Forecast from '../features/Forecast/Forecast';

const HomePage: React.FC = () => {
    const {
        currentLocation,
        savedLocations,
        weatherData,
        loading,
        error,
        settings,
        weatherAlerts,
        handleSearch,
        saveLocation,
        removeLocation,
        switchLocation,
        toggleUnit,
        toggleTheme,
        toggleNotifications,
    } = useWeatherApp();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const results = await handleSearch(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
    };

    const handleLocationSelect = (location: any) => {
        switchLocation(location);
        setShowSearchResults(false);
        setSearchQuery('');
    };

    const handleSaveLocation = () => {
        if (currentLocation) {
            saveLocation(currentLocation);
        }
    };

    const temperatureUnit = settings.unit === 'metric' ? '°C' : '°F';
    const speedUnit = settings.unit === 'metric' ? 'm/s' : 'mph';

    return (
        <div className={`app ${settings.theme}`}>
            <header className="header">
                <div className="header-content container">
                    <div>
                        <h1 className="header-title">Weather Forecast</h1>
                        <p className="header-subtitle">Real-time weather updates</p>
                    </div>
                    <div className="form-actions">
                        <button onClick={toggleUnit} className="btn btn-secondary">
                            {settings.unit === 'metric' ? '°F' : '°C'}
                        </button>
                        <button onClick={toggleTheme} className="btn btn-secondary">
                            {settings.theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button onClick={toggleNotifications} className="btn btn-secondary">
                            {settings.notifications ? '🔕' : '🔔'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content container">
                <div className="search-section">
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <div className="form-group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a location..."
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>

                    {showSearchResults && searchResults.length > 0 && (
                        <div className="search-results card">
                            <h3>Search Results</h3>
                            {searchResults.map((result) => (
                                <div
                                    key={`${result.lat}-${result.lon}`}
                                    className="search-result-item"
                                    onClick={() => handleLocationSelect(result)}
                                >
                                    {result.name}, {result.state && `${result.state}, `}
                                    {result.country}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {weatherAlerts && weatherAlerts.length > 0 && (
                    <div className="error-message">
                        <strong>Weather Alerts:</strong>
                        <ul>
                            {weatherAlerts.map((alert, index) => (
                                <li key={index}>{alert}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading weather data...</p>
                    </div>
                ) : weatherData ? (
                    <>
                        <div className="current-location-section card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    {currentLocation?.name}
                                    {!savedLocations.some((loc) => loc.id === currentLocation?.id) && (
                                        <button onClick={handleSaveLocation} className="btn btn-primary btn-small">
                                            Save Location
                                        </button>
                                    )}
                                </h2>
                            </div>

                            <div className="weather-grid">
                                <WeatherCard
                                    title="Temperature"
                                    value={Math.round(weatherData.current.temp)}
                                    unit={temperatureUnit}
                                    icon={`https://openweathermap.org/img/wn/${weatherData.current.weather.icon}@2x.png`}
                                    description={weatherData.current.weather.description}
                                />

                                <WeatherCard
                                    title="Feels Like"
                                    value={Math.round(weatherData.current.feels_like)}
                                    unit={temperatureUnit}
                                />

                                <WeatherCard
                                    title="Humidity"
                                    value={weatherData.current.humidity}
                                    unit="%"
                                />

                                <WeatherCard
                                    title="Wind Speed"
                                    value={weatherData.current.wind_speed}
                                    unit={speedUnit}
                                />

                                <WeatherCard
                                    title="Pressure"
                                    value={weatherData.current.pressure}
                                    unit="hPa"
                                />

                                <WeatherCard
                                    title="Sunrise"
                                    value={new Date(weatherData.current.sunrise * 1000).toLocaleTimeString()}
                                />

                                <WeatherCard
                                    title="Sunset"
                                    value={new Date(weatherData.current.sunset * 1000).toLocaleTimeString()}
                                />
                            </div>
                        </div>

                        <div className="view-toggle">
                            <button
                                onClick={() => setViewMode('hourly')}
                                className={viewMode === 'hourly' ? 'btn btn-primary' : 'btn btn-secondary'}
                            >
                                Hourly Forecast
                            </button>
                            <button
                                onClick={() => setViewMode('daily')}
                                className={viewMode === 'daily' ? 'btn btn-primary' : 'btn btn-secondary'}
                            >
                                Daily Forecast
                            </button>
                        </div>

                        {viewMode === 'hourly' ? (
                            <Forecast hourly={weatherData.hourly} daily={[]} unit={settings.unit} />
                        ) : (
                            <Forecast hourly={[]} daily={weatherData.daily} unit={settings.unit} />
                        )}

                        <LocationList
                            locations={savedLocations}
                            onRemoveLocation={removeLocation}
                            onSwitchLocation={switchLocation}
                            currentLocation={currentLocation}
                        />
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-content">
                            <div className="empty-icon">🌤️</div>
                            <h2>Welcome to Weather App</h2>
                            <p>Search for a location or allow location access to see current weather information.</p>
                        </div>
                    </div>
                )}
            </main>

            <footer className="footer">
                <div className="container">
                    <p>Weather App &copy; 2025. Mbuso.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;