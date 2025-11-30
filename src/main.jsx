import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Error handling for development
if (import.meta.env.DEV) {
  console.log('Development mode enabled');
}

// Safe root creation
try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Fallback error display
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #ef4444;">
        <h2>خطا در بارگذاری برنامه</h2>
        <p>لطفاً صفحه را refresh کنید</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
          Refresh
        </button>
      </div>
    `;
  }
}
