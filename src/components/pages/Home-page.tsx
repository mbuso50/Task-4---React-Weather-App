import React, { useState } from 'react';
import { WeatherCard } from '../WeatherCard/weatherCard';
import { LocationList } from '../features/LocationList/LocationList';
import { ThemeToggle } from '../features/layout/Theme';
import { useWeatherApp } from '../hooks/useWeatherApp';
import '../../App.css';


export const HomePage: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const {
        weatherData,
        savedLocations,
        unit,
        theme,
        loading,
        error,
        showHourly,
        handleSearch,
        getCurrentLocation,
        toggleUnit,
        toggleTheme,
        toggleView,
        removeLocation,
        setError
    } = useWeatherApp();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchInput);
        setSearchInput('');
    };

    const handleUseCurrentLocation = () => {
        setError(null);
        getCurrentLocation();
    };

    return (
        <div className={`app ${theme}`}>
            <div className="container">
                <header className="header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1 className="header-title">Weather App</h1>
                            <p className="header-subtitle">Get real-time weather updates</p>
                        </div>
                        <ThemeToggle currentTheme={theme} onToggle={toggleTheme} />
                    </div>
                </header>

                <main className="main-content">
                    {/* Search Section */}
                    <section className="search-section card">
                        <div className="card-header">
                            <h2 className="card-title">Search Location</h2>
                            <p className="card-subtitle">Enter a city name to get weather information</p>
                        </div>

                        <form onSubmit={handleSubmit} className="search-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Enter city name..."
                                    className="form-input"
                                    aria-label="City name"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    className="btn btn-secondary"
                                    disabled={loading}
                                >
                                    Use Current Location
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="error-message" role="alert">
                                {error}
                            </div>
                        )}
                    </section>

                    {/* Weather Display Section */}
                    {weatherData && (
                        <section className="weather-section">
                            <WeatherCard
                                weatherData={weatherData}
                                unit={unit}
                                onToggleUnit={toggleUnit}
                                showHourly={showHourly}
                                onToggleView={toggleView}
                            />
                        </section>
                    )}

                    {/* Saved Locations Section */}
                    {savedLocations.length > 0 && (
                        <section className="locations-section card">
                            <div className="card-header">
                                <h2 className="card-title">Saved Locations</h2>
                                <p className="card-subtitle">Click on a location to view its weather</p>
                            </div>

                            <LocationList
                                locations={savedLocations}
                                onSelect={handleSearch}
                                onRemove={removeLocation}
                            />
                        </section>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <span>Loading weather data...</span>
                        </div>
                    )}

                    {/* Empty State */}
                    {!weatherData && !loading && savedLocations.length === 0 && (
                        <section className="empty-state card">
                            <div className="empty-content">
                                <div className="empty-icon">🌤️</div>
                                <h2>Welcome to Weather App</h2>
                                <p>Search for a location or use your current location to get started</p>
                            </div>
                        </section>
                    )}
                </main>

                <footer className="footer">
                    <p>&copy; 2025 Mbuso Muludzi.</p>
                </footer>
            </div>
        </div>
    );
};