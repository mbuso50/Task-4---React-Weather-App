import React from 'react';
import type { LocationListProps } from '../../variable-types/types';
import './LocationList.css';

export const LocationList: React.FC<LocationListProps> = ({
    locations,
    onSelect,
    onRemove
}) => {
    if (locations.length === 0) {
        return (
            <div className="location-list-empty">
                <p>No locations saved yet. Search for a location to add it here.</p>
            </div>
        );
    }

    return (
        <div className="location-list">
            <h3 className="location-list-title">Saved Locations</h3>
            <div className="location-items">
                {locations.map((location) => (
                    <div key={location} className="location-item">
                        <button
                            onClick={() => onSelect(location)}
                            className="location-btn"
                            aria-label={`View weather for ${location}`}
                        >
                            
                        </button>
                        <button
                            onClick={() => onRemove(location)}
                            className="btn btn-danger btn-small location-remove"
                            aria-label={`Remove ${location}`}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

};
