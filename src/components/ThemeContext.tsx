import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  // Background gradient
  bgGradientStart: string;
  bgGradientMiddle: string;
  bgGradientEnd: string;
  bgGradientDirection: string;
  
  // Header gradient
  headerGradientStart: string;
  headerGradientMiddle: string;
  headerGradientEnd: string;
  headerGradientDirection: string;
  
  // Accent colors
  accentPrimary: string;
  accentSecondary: string;
  
  // Card customization
  cardBackground: string;
  cardBorder: string;
}

export interface ThemeContextType {
  theme: ThemeColors;
  updateTheme: (newTheme: Partial<ThemeColors>) => void;
  resetTheme: () => void;
  applyPreset: (preset: string) => void;
}

const defaultTheme: ThemeColors = {
  bgGradientStart: '#faf5ff',
  bgGradientMiddle: '#fce7f3',
  bgGradientEnd: '#eff6ff',
  bgGradientDirection: 'to bottom right',
  
  headerGradientStart: '#c084fc',
  headerGradientMiddle: '#f9a8d4',
  headerGradientEnd: '#93c5fd',
  headerGradientDirection: 'to right',
  
  accentPrimary: '#a855f7',
  accentSecondary: '#ec4899',
  
  cardBackground: '#ffffff',
  cardBorder: 'rgba(0, 0, 0, 0.1)',
};

const presetThemes: Record<string, ThemeColors> = {
  default: defaultTheme,
  
  ocean: {
    bgGradientStart: '#e0f2fe',
    bgGradientMiddle: '#dbeafe',
    bgGradientEnd: '#e0e7ff',
    bgGradientDirection: 'to bottom right',
    
    headerGradientStart: '#0ea5e9',
    headerGradientMiddle: '#3b82f6',
    headerGradientEnd: '#6366f1',
    headerGradientDirection: 'to right',
    
    accentPrimary: '#0284c7',
    accentSecondary: '#0891b2',
    
    cardBackground: '#ffffff',
    cardBorder: 'rgba(14, 165, 233, 0.2)',
  },
  
  sunset: {
    bgGradientStart: '#fff7ed',
    bgGradientMiddle: '#fed7aa',
    bgGradientEnd: '#fecaca',
    bgGradientDirection: 'to bottom right',
    
    headerGradientStart: '#f97316',
    headerGradientMiddle: '#fb923c',
    headerGradientEnd: '#f87171',
    headerGradientDirection: 'to right',
    
    accentPrimary: '#ea580c',
    accentSecondary: '#dc2626',
    
    cardBackground: '#ffffff',
    cardBorder: 'rgba(249, 115, 22, 0.2)',
  },
  
  forest: {
    bgGradientStart: '#f0fdf4',
    bgGradientMiddle: '#dcfce7',
    bgGradientEnd: '#d1fae5',
    bgGradientDirection: 'to bottom right',
    
    headerGradientStart: '#22c55e',
    headerGradientMiddle: '#10b981',
    headerGradientEnd: '#14b8a6',
    headerGradientDirection: 'to right',
    
    accentPrimary: '#16a34a',
    accentSecondary: '#059669',
    
    cardBackground: '#ffffff',
    cardBorder: 'rgba(34, 197, 94, 0.2)',
  },
  
  lavender: {
    bgGradientStart: '#faf5ff',
    bgGradientMiddle: '#f3e8ff',
    bgGradientEnd: '#e9d5ff',
    bgGradientDirection: 'to bottom right',
    
    headerGradientStart: '#a855f7',
    headerGradientMiddle: '#9333ea',
    headerGradientEnd: '#7c3aed',
    headerGradientDirection: 'to right',
    
    accentPrimary: '#9333ea',
    accentSecondary: '#7c3aed',
    
    cardBackground: '#ffffff',
    cardBorder: 'rgba(168, 85, 247, 0.2)',
  },
  
  midnight: {
    bgGradientStart: '#1e1b4b',
    bgGradientMiddle: '#312e81',
    bgGradientEnd: '#1e3a8a',
    bgGradientDirection: 'to bottom right',
    
    headerGradientStart: '#4c1d95',
    headerGradientMiddle: '#5b21b6',
    headerGradientEnd: '#6366f1',
    headerGradientDirection: 'to right',
    
    accentPrimary: '#8b5cf6',
    accentSecondary: '#a78bfa',
    
    cardBackground: 'rgba(255, 255, 255, 0.1)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
  },
  
  coral: {
    bgGradientStart: '#fff1f2',
    bgGradientMiddle: '#ffe4e6',
    bgGradientEnd: '#fce7f3',
    bgGradientDirection: 'to bottom right',
    
    headerGradientStart: '#fb7185',
    headerGradientMiddle: '#f472b6',
    headerGradientEnd: '#e879f9',
    headerGradientDirection: 'to right',
    
    accentPrimary: '#e11d48',
    accentSecondary: '#db2777',
    
    cardBackground: '#ffffff',
    cardBorder: 'rgba(251, 113, 133, 0.2)',
  },
  
  mint: {
    bgGradientStart: '#ecfdf5',
    bgGradientMiddle: '#d1fae5',
    bgGradientEnd: '#ccfbf1',
    bgGradientDirection: 'to bottom right',
    
    headerGradientStart: '#10b981',
    headerGradientMiddle: '#14b8a6',
    headerGradientEnd: '#06b6d4',
    headerGradientDirection: 'to right',
    
    accentPrimary: '#059669',
    accentSecondary: '#0d9488',
    
    cardBackground: '#ffffff',
    cardBorder: 'rgba(16, 185, 129, 0.2)',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => 
  {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

useEffect(() => {
  try {
    const saved = localStorage.getItem("numina-theme");
    if (saved) setTheme(JSON.parse(saved));
  } catch (err) {
    console.warn("Failed to load theme", err);
  }
}, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem('numina-theme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (newTheme: Partial<ThemeColors>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  const applyPreset = (preset: string) => {
    if (presetThemes[preset]) {
      setTheme(presetThemes[preset]);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, applyPreset }}>
      {children}
    </ThemeContext.Provider>
  );
};
