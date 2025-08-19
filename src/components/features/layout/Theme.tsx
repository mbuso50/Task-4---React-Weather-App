import React from 'react';
import './Theme.css';

interface ThemeToggleProps {
    currentTheme: 'light' | 'dark';
    onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    currentTheme,
    onToggle
}) => {
    return (
        <button
            onClick={onToggle}
            className={`theme-toggle ${currentTheme}`}
            aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
        >
            <span className="theme-icon">
                {currentTheme === 'light' ? '🌙' : '☀️'}
            </span>
            <span className="theme-text">
                {currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
        </button>
    );
};