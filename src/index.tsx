import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

console.log("index.tsx is running...");
const mount = () => {
  console.log("Searching for root element...");
  const container = document.getElementById('root');
  if (container) {
    console.log("Root element found, mounting React app...");
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>
    );
  } else {
    // If the script runs before the DOM is fully constructed, wait for it.
    console.warn("Root element not found immediately, waiting for DOMContentLoaded...");
    document.addEventListener('DOMContentLoaded', () => {
       const retryContainer = document.getElementById('root');
       if (retryContainer) {
         const root = createRoot(retryContainer);
         root.render(
           <React.StrictMode>
             <HashRouter>
               <App />
             </HashRouter>
           </React.StrictMode>
         );
       } else {
         console.error("Failed to find root element even after DOMContentLoaded.");
       }
    });
  }
};

mount();