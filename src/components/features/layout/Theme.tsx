import React from 'react';

interface ThemeToggleProps {
    darkMode: boolean;
    onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => {
    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={onToggle}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
        </div>
    );
};