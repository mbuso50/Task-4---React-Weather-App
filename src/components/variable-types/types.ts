// src/components/variable-types/types.tsx
// Rename Location to WeatherLocation to avoid conflict with DOM Location
export interface WeatherLocation {
    id: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

export interface CurrentWeather {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
        main: string;
        description: string;
        icon: string;
    };
    sunrise: number;
    sunset: number;
    dt: number;
}

export interface HourlyForecast {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
        main: string;
        description: string;
        icon: string;
    };
    pop: number;
}

export interface DailyForecast {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
        main: string;
        description: string;
        icon: string;
    };
    pop: number;
}

export interface WeatherAlert {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
}

export interface WeatherData {
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    alerts: WeatherAlert[];
    timezone: string;
    lat: number;
    lon: number;
}

export interface AppSettings {
    unit: 'metric' | 'imperial';
    theme: 'light' | 'dark';
    notifications: boolean;
}