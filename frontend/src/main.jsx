import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Ensure this is here
import App from './App';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter here */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
