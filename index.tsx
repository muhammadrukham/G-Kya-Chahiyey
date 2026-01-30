
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// We handle CSS via the HTML link or Vite bundling. 
// If this fails in your specific browser environment, 
// Tailwind is still loaded via CDN in index.html as a fallback.

const rootElement = document.getElementById('root');

const showError = (msg: string) => {
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; text-align: center;">
        <h1 style="color: #e11d48;">Launch Error</h1>
        <p style="color: #475569;">${msg}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer;">Retry Loading</button>
      </div>
    `;
  }
};

if (!rootElement) {
  console.error("Critical Error: Root element not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Ji Kya Chahiye: Rendered successfully.");
  } catch (error) {
    console.error("App failed to render:", error);
    showError(error instanceof Error ? error.message : String(error));
  }
}

// Global listener for unhandled promise rejections (like Supabase connection issues)
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // We don't always want to crash the UI for background sync errors, 
  // but we log it for debugging in the console.
});
