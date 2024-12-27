import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

const BodyStyler = () => {
  const { theme } = useTheme();

  React.useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "";
  }, [theme]);

  return null;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <LanguageProvider>
      <BodyStyler /> {/* Dynamické stylování těla stránky */}
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </LanguageProvider>
  </ThemeProvider>
);

reportWebVitals();
