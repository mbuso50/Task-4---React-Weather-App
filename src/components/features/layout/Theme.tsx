
import React from 'react';
import './Theme.css';

interface ThemeProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

const Theme: React.FC<ThemeProps> = ({ theme, onToggle }) => {
    return (
        <button onClick={onToggle} className="theme-toggle">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
        </button>
    );
};

export default Theme; 