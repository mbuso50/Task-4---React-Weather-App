import React from 'react';

interface LocationListProps {
    locations: string[];
    onSelect: (location: string) => void;
    onRemove?: (location: string) => void;
}

export const LocationList: React.FC<LocationListProps> = ({
    locations,
    onSelect,
    onRemove
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
                <div key={location} className="relative group">
                    <button
                        onClick={() => onSelect(location)}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                        {location}
                    </button>
                    {onRemove && (
                        <button
                            onClick={() => onRemove(location)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};