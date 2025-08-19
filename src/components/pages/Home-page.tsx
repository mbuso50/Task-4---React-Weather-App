import React from 'react';
import { WeatherCard } from '../WeatherCard/weatherCard';
import { Forecast } from '../features/Forecast/Forecast';
import { ThemeToggle } from '../features/layout/Theme';
import { LocationList } from '../features/LocationList/LocationList';
import { useWeatherApp } from '../hooks/useWeatherApp';

export const HomePage: React.FC = () => {
    const {
        location,
        setLocation,
        weatherData,
        forecastData,
        unit,
        error,
        loading,
        darkMode,
        savedLocations,
        handleSearch,
        toggleUnit,
        toggleDarkMode,
        removeLocation,
        handleLocationSelect
    } = useWeatherApp();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Loading weather data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200 relative">
            <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />

            <div className="max-w-4xl mx-auto pt-16"> {/* Added pt-16 for top padding */}
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        Weather App
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Get real-time weather updates for any location
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter city name..."
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 p-4 rounded-lg mb-6 text-red-800 dark:text-red-200">
                        ⚠️ {error}
                    </div>
                )}

                {/* Weather Content */}
                {weatherData ? (
                    <div className="space-y-6">
                        {/* Current Weather */}
                        <WeatherCard
                            weatherData={weatherData}
                            unit={unit}
                            onToggleUnit={toggleUnit}
                        />

                        {/* Forecast */}
                        {forecastData && (
                            <Forecast forecastData={forecastData} unit={unit} />
                        )}

                        {/* Saved Locations */}
                        {savedLocations.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                                    📍 Saved Locations
                                </h2>
                                <LocationList
                                    locations={savedLocations}
                                    onSelect={handleLocationSelect}
                                    onRemove={removeLocation}
                                />
                            </div>
                        )}
                    </div>
                ) : !error && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="text-6xl mb-4">🌤️</div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {navigator.geolocation
                                ? "Detecting your location..."
                                : "Search for a city to get started"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};