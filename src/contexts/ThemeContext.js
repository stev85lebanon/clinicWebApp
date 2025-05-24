import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true'); // Persist theme state

    const theme = useMemo(() => createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light', // Toggle between light and dark mode
        },
    }), [darkMode]);

    const toggleTheme = () => {
        const newMode = !darkMode;
        localStorage.setItem('darkMode', newMode); // Store the theme in localStorage
        setDarkMode(newMode); // Toggle the dark mode state
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
