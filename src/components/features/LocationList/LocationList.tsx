// src/components/features/LocationList/LocationList.tsx
import React from 'react';
import '../../../App.css';
import type { WeatherLocation } from '../../variable-types/types';

interface LocationListProps {
    locations: WeatherLocation[];
    onRemoveLocation: (id: string) => void;
    onSwitchLocation: (location: WeatherLocation) => void;
    currentLocation: WeatherLocation | null;
}

const LocationList: React.FC<LocationListProps> = ({
    locations,
    onRemoveLocation,
    onSwitchLocation,
    currentLocation,
}) => {
    return (
        <div className="location-list">
            <h3>Saved Locations</h3>
            {locations.length === 0 ? (
                <p>No locations saved yet.</p>
            ) : (
                <ul className="location-items">
                    {locations.map((location) => (
                        <li key={location.id} className="location-item">
                            <span>
                                {location.name}
                                {location.state && `, ${location.state}`}
                                {location.country && `, ${location.country}`}
                            </span>
                            <div className="location-actions">
                                <button
                                    onClick={() => onSwitchLocation(location)}
                                    disabled={currentLocation?.id === location.id}
                                    className="location-btn"
                                >
                                    {currentLocation?.id === location.id ? 'Current' : 'Switch'}
                                </button>
                                <button
                                    onClick={() => onRemoveLocation(location.id)}
                                    className="location-remove"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationList;