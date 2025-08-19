export interface WeatherData {
    name?: string;
    main?: {
        temp?: number;
        humidity?: number;
        pressure?: number;
    };
    weather?: Array<{
        description?: string;
        icon?: string;
    }>;
    wind?: {
        speed?: number;
    };
    cod?: number;
    message?: string;
}

export interface ForecastData {
    list?: Array<{
        dt_txt?: string;
        main?: {
            temp?: number;
        };
        weather?: Array<{
            icon?: string;
            description?: string;
        }>;
    }>;
}

export type TemperatureUnit = 'C' | 'F';