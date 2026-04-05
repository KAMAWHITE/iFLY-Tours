"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';

const AppContext = createContext();

function AppProvider({ children }) {
    const [til, setTil] = useState('uz');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        const savedTheme = localStorage.getItem('theme');

        if (savedLanguage) setTil(savedLanguage);
        if (savedTheme === 'dark') setDarkMode(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('language', til);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');

        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [til, darkMode]);

    const changeLanguage = (newLanguage) => {
        setTil(newLanguage);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <AppContext.Provider value={{ til, changeLanguage, darkMode, toggleDarkMode }}>
            {children}
        </AppContext.Provider>
    );
}

function useApp() {
    return useContext(AppContext);
}

export { AppProvider, useApp };