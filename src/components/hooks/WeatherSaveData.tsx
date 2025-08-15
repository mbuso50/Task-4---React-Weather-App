import { useState, useEffect } from 'react';

export const useSavedLocations = () => {
  const [savedLocations, setSavedLocations] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('weatherLocations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);

  const saveLocation = (location: string) => {
    if (!savedLocations.includes(location)) {
      const updated = [...savedLocations, location];
      setSavedLocations(updated);
      localStorage.setItem('weatherLocations', JSON.stringify(updated));
    }
  };

  const removeLocation = (location: string) => {
    const updated = savedLocations.filter(loc => loc !== location);
    setSavedLocations(updated);
    localStorage.setItem('weatherLocations', JSON.stringify(updated));
  };

  return { savedLocations, saveLocation, removeLocation };
};