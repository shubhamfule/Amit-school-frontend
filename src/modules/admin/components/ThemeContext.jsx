import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeCtx.Provider value={{ darkMode, setDarkMode, toggleDarkMode: () => setDarkMode((d) => !d) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
