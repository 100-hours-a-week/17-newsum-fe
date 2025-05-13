// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter import
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter> {/* BrowserRouter 적용 */}
      <AuthProvider>
      <App />
      </AuthProvider>
    </BrowserRouter>
);