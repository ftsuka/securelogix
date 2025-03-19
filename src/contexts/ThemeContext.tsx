
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';
type FontFamily = 'system' | 'sans' | 'mono';
type Density = 'comfortable' | 'compact' | 'expanded';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  density: Density;
  setDensity: (density: Density) => void;
  applyTheme: () => void;
}

const defaultContext: ThemeContextType = {
  theme: 'system',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  fontFamily: 'system',
  setFontFamily: () => {},
  density: 'comfortable',
  setDensity: () => {},
  applyTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<Theme>('system');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');
  const [density, setDensity] = useState<Density>('comfortable');

  // Carregar preferências salvas ao inicializar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily;
    const savedDensity = localStorage.getItem('density') as Density;

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedDensity) setDensity(savedDensity);

    applyTheme();
  }, []);

  const applyTheme = () => {
    const root = window.document.documentElement;
    
    // Aplicar tema
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Aplicar tamanho da fonte
    root.style.fontSize = fontSize === 'small' 
      ? '14px' 
      : fontSize === 'large'
        ? '18px'
        : '16px';

    // Aplicar família de fonte
    const fontFamilyClass = fontFamily === 'sans' 
      ? 'font-sans' 
      : fontFamily === 'mono'
        ? 'font-mono'
        : '';
    
    root.className = root.className
      .replace(/font-(sans|mono|serif)/g, '')
      .trim() + (fontFamilyClass ? ` ${fontFamilyClass}` : '');

    // Aplicar densidade
    root.setAttribute('data-density', density);

    // Salvar no localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('density', density);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, setTheme, 
        fontSize, setFontSize,
        fontFamily, setFontFamily, 
        density, setDensity,
        applyTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
