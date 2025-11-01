
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AccessibilityProvider } from './context/AccessibilityContext.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AccessibilityProvider>
  </StrictMode>,
);

