import { useState, useEffect } from 'react';

export const useSavedLocations = () => {
  const [savedLocations, setSavedLocations] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('weatherLocations');
      if (saved) {
        setSavedLocations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved locations:', error);
      localStorage.removeItem('weatherLocations');
    }
  }, []);

  const saveLocation = (location: string) => {
    const trimmedLocation = location.trim();
    if (!trimmedLocation || savedLocations.includes(trimmedLocation)) return;

    const updated = [...savedLocations, trimmedLocation];
    setSavedLocations(updated);
    localStorage.setItem('weatherLocations', JSON.stringify(updated));
  };

  const removeLocation = (location: string) => {
    const updated = savedLocations.filter(loc => loc !== location);
    setSavedLocations(updated);
    localStorage.setItem('weatherLocations', JSON.stringify(updated));
  };

  return { savedLocations, saveLocation, removeLocation };
};