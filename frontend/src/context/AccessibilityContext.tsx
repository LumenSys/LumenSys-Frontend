import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorFilter = 'none' | 'grayscale' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';
export type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

interface AccessibilityContextType {
  colorFilter: ColorFilter;
  fontSize: FontSize;
  setColorFilter: (filter: ColorFilter) => void;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [colorFilter, setColorFilter] = useState<ColorFilter>('none');
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  // Carregar configurações salvas do localStorage
  useEffect(() => {
    const savedColorFilter = localStorage.getItem('accessibility-color-filter') as ColorFilter;
    const savedFontSize = localStorage.getItem('accessibility-font-size') as FontSize;
    
    if (savedColorFilter) {
      setColorFilter(savedColorFilter);
    }
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-color-filter', colorFilter);
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [colorFilter, fontSize]);

  // Aplicar filtros CSS
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover classes anteriores
    root.classList.remove(
      'accessibility-grayscale',
      'accessibility-protanopia',
      'accessibility-deuteranopia',
      'accessibility-tritanopia',
      'accessibility-high-contrast'
    );

    // Aplicar novo filtro
    if (colorFilter !== 'none') {
      root.classList.add(`accessibility-${colorFilter}`);
    }
  }, [colorFilter]);

  // Aplicar tamanho de fonte
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover classes anteriores
    root.classList.remove(
      'font-size-small',
      'font-size-normal',
      'font-size-large',
      'font-size-extra-large'
    );

    // Aplicar novo tamanho
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  const increaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const resetSettings = () => {
    setColorFilter('none');
    setFontSize('normal');
    localStorage.removeItem('accessibility-color-filter');
    localStorage.removeItem('accessibility-font-size');
  };

  // Adicionar atalhos de teclado globais
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atalhos para tamanho da fonte
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case '+':
          case '=':
            e.preventDefault();
            increaseFontSize();
            break;
          case '_':
          case '-':
            e.preventDefault();
            decreaseFontSize();
            break;
          case '0':
            e.preventDefault();
            setFontSize('normal');
            break;
        }
      }
      
      // Atalhos para filtros de cor (Alt + número)
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setColorFilter('none');
            break;
          case '2':
            e.preventDefault();
            setColorFilter('grayscale');
            break;
          case '3':
            e.preventDefault();
            setColorFilter('high-contrast');
            break;
          case '0':
            e.preventDefault();
            resetSettings();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fontSize, increaseFontSize, decreaseFontSize, setColorFilter, setFontSize, resetSettings]);

  const value: AccessibilityContextType = {
    colorFilter,
    fontSize,
    setColorFilter,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};