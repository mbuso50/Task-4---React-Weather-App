import { useState, useEffect } from 'react';
import { fetchWeatherData } from './components/services/WeatherAPI';
import { useSavedLocations } from './components/hooks/WeatherSaveData';
import { WeatherCard } from './components/WeatherCard/weatherCard';
import { Button } from './components/button/Button';

const API_KEY = '8d57d21c9bfeb49733adf610baf374cb';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { savedLocations, saveLocation } = useSavedLocations();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            setWeatherData(data);
            setLocation(data.name);
            saveLocation(data.name);
          } catch (err) {
            setError('Failed to load local weather');
          }
        },
        () => {
          setError('Enable location access for automatic weather');
        }
      );
    }
  }, [saveLocation]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      saveLocation(location);
      setError('');
    } catch (err) {
      setError('City not found. Try another location.');
    }
  };

  const toggleUnit = () => setUnit(unit === 'C' ? 'F' : 'C');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="secondary"
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </Button>

        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Weather App</h1>
        
        <form onSubmit={handleSearch} className="mb-6 flex">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city"
            className="flex-grow p-2 border rounded-l-md dark:bg-gray-700 dark:text-white"
          />
          <Button type="submit" variant="primary" className="rounded-l-none">
            Search
          </Button>
        </form>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {weatherData ? (
          <>
            <WeatherCard 
              weatherData={weatherData} 
              unit={unit}
              onToggleUnit={toggleUnit}
            />
            
            {savedLocations.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Saved Locations</h2>
                <div className="flex flex-wrap gap-2">
                  {savedLocations.map((loc) => (
                    <Button
                      key={loc}
                      variant="outline"
                      onClick={async () => {
                        setLocation(loc);
                        const data = await fetchWeatherData(loc);
                        setWeatherData(data);
                      }}
                    >
                      {loc}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : !error && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              {navigator.geolocation 
                ? "Loading weather..." 
                : "Search for a city"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;