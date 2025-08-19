import { useState, useEffect } from 'react';
import { fetchWeatherData, fetchForecast } from '../services/WeatherAPI';
import { useSavedLocations } from './WeatherSaveData';
import type { WeatherData, ForecastData, TemperatureUnit } from '../variable-types/types';

export const useWeatherApp = () => {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [unit, setUnit] = useState<TemperatureUnit>('C');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const { savedLocations, saveLocation, removeLocation } = useSavedLocations();

    // Initial geolocation fetch - only runs once on mount
    useEffect(() => {
        const fetchInitialWeather = async () => {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                setLoading(false);
                return;
            }

            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const API_KEY = import.meta.env.VITE_API_KEY;
                        if (!API_KEY) {
                            throw new Error('API key not configured');
                        }

                        const { latitude, longitude } = position.coords;
                        const response = await fetch(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                        );

                        const data = await response.json();

                        if (data.cod !== 200) {
                            throw new Error(data.message || 'Failed to load weather');
                        }

                        const currentLocation = data.name;
                        setWeatherData(data);
                        setLocation(currentLocation);
                        saveLocation(currentLocation);
                        setError('');
                    } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to load local weather';
                        setError(errorMessage);
                        console.error('Geolocation error:', errorMessage);

                        // If geolocation fails, try to load first saved location
                        if (savedLocations.length > 0) {
                            try {
                                const firstLocation = savedLocations[0];
                                const weather = await fetchWeatherData(firstLocation);
                                setWeatherData(weather);
                                setLocation(firstLocation);
                                setError('');
                            } catch (fallbackError) {
                                console.error('Fallback location also failed:', fallbackError);
                            }
                        }
                    } finally {
                        setLoading(false);
                    }
                },
                (err) => {
                    const errorMessage = err.message || 'Enable location access for automatic weather';
                    setError(errorMessage);
                    console.error('Geolocation permission error:', errorMessage);

                    // If user denies location, try to load first saved location
                    if (savedLocations.length > 0) {
                        const loadFirstSavedLocation = async () => {
                            try {
                                const firstLocation = savedLocations[0];
                                const weather = await fetchWeatherData(firstLocation);
                                setWeatherData(weather);
                                setLocation(firstLocation);
                                setError('');
                            } catch (fallbackError) {
                                console.error('Fallback location failed:', fallbackError);
                            } finally {
                                setLoading(false);
                            }
                        };
                        loadFirstSavedLocation();
                    } else {
                        setLoading(false);
                    }
                },
                {
                    timeout: 10000, // 10 second timeout
                    enableHighAccuracy: false
                }
            );
        };

        fetchInitialWeather();
    }, []); // Empty dependency array - runs only once on mount

    // Dark mode handling
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const searchLocation = location.trim();
        if (!searchLocation) return;

        try {
            setLoading(true);
            const [weather, forecast] = await Promise.all([
                fetchWeatherData(searchLocation),
                fetchForecast(searchLocation)
            ]);
            setWeatherData(weather);
            setForecastData(forecast);
            saveLocation(searchLocation);
            setError('');
            setLocation('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'City not found. Try another location.');
        } finally {
            setLoading(false);
        }
    };

    // REMOVE ONE OF THESE DUPLICATE FUNCTIONS!
    const handleLocationSelect = async (selectedLocation: string) => {
        try {
            setLoading(true);
            const [weather, forecast] = await Promise.all([
                fetchWeatherData(selectedLocation),
                fetchForecast(selectedLocation)
            ]);
            setWeatherData(weather);
            setForecastData(forecast);
            setLocation(selectedLocation);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load location weather');
        } finally {
            setLoading(false);
        }
    };

    const toggleUnit = () => setUnit(unit === 'C' ? 'F' : 'C');
    const toggleDarkMode = () => setDarkMode(!darkMode);

    return {
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
    };
};