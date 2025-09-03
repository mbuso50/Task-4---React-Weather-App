// src/components/hooks/useWeatherApp.tsx
import { useState, useEffect } from 'react';
import type { WeatherLocation, WeatherData, AppSettings } from '../variable-types/types';
import { getCurrentWeather, getForecast, searchLocation } from '../services/WeatherAPI';

export const useWeatherApp = () => {
    const [currentLocation, setCurrentLocation] = useState<WeatherLocation | null>(null);
    const [savedLocations, setSavedLocations] = useState<WeatherLocation[]>([]);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [settings, setSettings] = useState<AppSettings>({
        unit: 'metric',
        theme: 'light',
        notifications: false,
    });
    const [weatherAlerts, setWeatherAlerts] = useState<string[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('savedLocations');
            if (saved) {
                setSavedLocations(JSON.parse(saved));
            }

            const savedSettings = localStorage.getItem('weatherAppSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (err) {
            console.error('Error loading from localStorage:', err);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        } catch (err) {
            console.error('Error saving to localStorage:', err);
        }
    }, [savedLocations]);

    useEffect(() => {
        try {
            localStorage.setItem('weatherAppSettings', JSON.stringify(settings));
        } catch (err) {
            console.error('Error saving to localStorage:', err);
        }
    }, [settings]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({
                        id: 'current',
                        name: 'Current Location',
                        lat: latitude,
                        lon: longitude,
                        country: '',
                    });
                },
                (err) => {
                    console.warn('Location access denied or error:', err);
                    setError('Location access denied. Please search for a location.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        if (currentLocation) {
            fetchWeatherData(currentLocation);
        }
    }, [currentLocation, settings.unit]);

    useEffect(() => {
        if (weatherData && settings.notifications) {
            const alerts: string[] = [];

            if (weatherData.current.wind_speed > 20) {
                alerts.push('High wind warning');
            }

            if (weatherData.current.weather.main === 'Thunderstorm') {
                alerts.push('Thunderstorm warning');
            }

            if (weatherData.current.temp > 35 || weatherData.current.temp < 0) {
                alerts.push('Extreme temperature warning');
            }

            if (weatherData.current.weather.main === 'Rain' && weatherData.current.weather.description.includes('heavy')) {
                alerts.push('Heavy rain warning');
            }

            if (weatherData.current.weather.main === 'Snow') {
                alerts.push('Snow warning');
            }

            setWeatherAlerts(alerts);

            if (alerts.length > 0 && 'Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            showNotifications(alerts);
                        }
                    });
                } else if (Notification.permission === 'granted') {
                    showNotifications(alerts);
                }
            }
        } else {
            setWeatherAlerts([]);
        }
    }, [weatherData, settings.notifications]);

    const showNotifications = (alerts: string[]) => {
        alerts.forEach(alert => {
            new Notification('Weather Alert', {
                body: alert,
                icon: '/weather-icon.png'
            });
        });
    };

    const fetchWeatherData = async (location: WeatherLocation) => {
        setLoading(true);
        setError(null);

        try {
            const [current, forecast] = await Promise.all([
                getCurrentWeather(location.lat, location.lon),
                getForecast(location.lat, location.lon),
            ]);

            const transformedData: WeatherData = {
                current: {
                    temp: current.main.temp,
                    feels_like: current.main.feels_like,
                    humidity: current.main.humidity,
                    pressure: current.main.pressure,
                    wind_speed: current.wind.speed,
                    wind_deg: current.wind.deg,
                    weather: {
                        main: current.weather[0].main,
                        description: current.weather[0].description,
                        icon: current.weather[0].icon,
                    },
                    sunrise: current.sys.sunrise,
                    sunset: current.sys.sunset,
                    dt: current.dt,
                },
                hourly: forecast.list.slice(0, 24).map((item: any) => ({
                    dt: item.dt,
                    temp: item.main.temp,
                    feels_like: item.main.feels_like,
                    humidity: item.main.humidity,
                    pressure: item.main.pressure,
                    wind_speed: item.wind.speed,
                    wind_deg: item.wind.deg,
                    weather: {
                        main: item.weather[0].main,
                        description: item.weather[0].description,
                        icon: item.weather[0].icon,
                    },
                    pop: item.pop,
                })),
                daily: forecast.list
                    .filter((_: any, index: number) => index % 8 === 0)
                    .slice(0, 7)
                    .map((item: any) => ({
                        dt: item.dt,
                        temp: item.main.temp,
                        feels_like: item.main.feels_like,
                        humidity: item.main.humidity,
                        pressure: item.main.pressure,
                        wind_speed: item.wind.speed,
                        wind_deg: item.wind.deg,
                        weather: {
                            main: item.weather[0].main,
                            description: item.weather[0].description,
                            icon: item.weather[0].icon,
                        },
                        pop: item.pop,
                    })),
                alerts: [],
                timezone: forecast.city.timezone.toString(),
                lat: location.lat,
                lon: location.lon,
            };

            setWeatherData(transformedData);
        } catch (err) {
            console.error('Error fetching weather data:', err);
            setError('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchLocation(query);
            if (results.length === 0) {
                setError('No locations found. Please try a different search.');
                return [];
            }
            return results.map((result: any) => ({
                id: `${result.lat}-${result.lon}`,
                name: result.name,
                lat: result.lat,
                lon: result.lon,
                country: result.country,
                state: result.state,
            }));
        } catch (err) {
            console.error('Error searching location:', err);
            setError('Failed to search location. Please try again.');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const saveLocation = (location: WeatherLocation) => {
        if (!savedLocations.some((loc) => loc.id === location.id)) {
            setSavedLocations([...savedLocations, location]);
        }
    };

    const removeLocation = (locationId: string) => {
        setSavedLocations(savedLocations.filter((loc) => loc.id !== locationId));
    };

    const switchLocation = (location: WeatherLocation) => {
        setCurrentLocation(location);
    };

    const toggleUnit = () => {
        setSettings((prev) => ({
            ...prev,
            unit: prev.unit === 'metric' ? 'imperial' : 'metric',
        }));
    };

    const toggleTheme = () => {
        setSettings((prev) => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light',
        }));
    };

    const toggleNotifications = () => {
        setSettings((prev) => ({
            ...prev,
            notifications: !prev.notifications,
        }));
    };

    return {
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
    };
};