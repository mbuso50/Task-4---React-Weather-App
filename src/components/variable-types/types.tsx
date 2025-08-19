export interface WeatherData {
    name: string;
    main?: {
        temp: number;
        humidity: number;
        pressure: number;
        feels_like: number;
    };
    weather?: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind?: {
        speed: number;
    };
    dt?: number;
}

export interface ForecastData {
    list?: Array<{
        dt: number;
        dt_txt?: string;
        main: {
            temp: number;
            humidity: number;
        };
        weather: Array<{
            main: string;
            description: string;
            icon: string;
        }>;
        wind: {
            speed: number;
        };
    }>;
}

export interface LocationListProps {
    locations: string[];
    onSelect: (location: string) => void;
    onRemove: (location: string) => void;
}

export interface WeatherCardProps {
    weatherData: WeatherData;
    unit: 'metric' | 'imperial';
    onToggleUnit: () => void;
    showHourly?: boolean;
    onToggleView?: () => void;
}

export type TemperatureUnit = 'C' | 'F';