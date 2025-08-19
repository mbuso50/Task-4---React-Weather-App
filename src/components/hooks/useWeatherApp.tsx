import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, ForecastData } from '../variable-types/types';
import { useLocalStorage } from '../LocalStorage/LocalStorage';

const API_KEY = import.meta.env.VITE_API_KEY;

export const useWeatherApp = () => {
    const [currentLocation, setCurrentLocation] = useLocalStorage('currentLocation', '');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [savedLocations, setSavedLocations] = useLocalStorage<string[]>('savedLocations', []);
    const [unit, setUnit] = useLocalStorage<'metric' | 'imperial'>('weatherUnit', 'metric');
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('appTheme', 'light');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showHourly, setShowHourly] = useState(false);

    const fetchWeatherData = useCallback(async (location: string) => {
        if (!API_KEY) {
            setError('API key not configured');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${unit}`
            );

            if (!response.ok) {
                throw new Error('Weather data not found');
            }

            const data: WeatherData = await response.json();
            setWeatherData(data);
            setCurrentLocation(location);

            // Add to saved locations if not already there
            if (!savedLocations.includes(location)) {
                setSavedLocations((prev: string[]) => [...prev, location]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    }, [unit, savedLocations, setSavedLocations, setCurrentLocation]);

    const fetchForecastData = useCallback(async (location: string) => {
        if (!API_KEY) return;

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=${unit}`
            );

            if (response.ok) {
                const data: ForecastData = await response.json();
                setForecastData(data);
            }
        } catch (err) {
            console.error('Failed to fetch forecast data:', err);
        }
    }, [unit]);

    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
                        );

                        if (response.ok) {
                            const data = await response.json();
                            if (data.length > 0) {
                                const locationName = data[0].name;
                                fetchWeatherData(locationName);
                            }
                        }
                    } catch (err) {
                        setError('Failed to get location name');
                    }
                },
                () => {
                    setError('Location access denied or unavailable');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    }, [fetchWeatherData]);

    const handleSearch = useCallback((location: string) => {
        if (location.trim()) {
            fetchWeatherData(location.trim());
        }
    }, [fetchWeatherData]);

    const toggleUnit = useCallback(() => {
        setUnit((prev: 'metric' | 'imperial') => prev === 'metric' ? 'imperial' : 'metric');
    }, [setUnit]);

    const toggleTheme = useCallback(() => {
        setTheme((prev: 'light' | 'dark') => prev === 'light' ? 'dark' : 'light');
    }, [setTheme]);

    const toggleView = useCallback(() => {
        setShowHourly(prev => !prev);
    }, []);

    const removeLocation = useCallback((location: string) => {
        setSavedLocations((prev: string[]) => prev.filter(loc => loc !== location));
        if (currentLocation === location) {
            setCurrentLocation('');
            setWeatherData(null);
        }
    }, [currentLocation, setSavedLocations, setCurrentLocation]);

    // Load weather data for current location on mount
    useEffect(() => {
        if (currentLocation) {
            fetchWeatherData(currentLocation);
        }
    }, [currentLocation, fetchWeatherData]);

    // Fetch forecast data when weather data changes
    useEffect(() => {
        if (weatherData?.name) {
            fetchForecastData(weatherData.name);
        }
    }, [weatherData, fetchForecastData]);

    return {
        currentLocation,
        weatherData,
        forecastData,
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
    };
};