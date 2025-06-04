// src/App.jsx
import React from 'react';
import Router from './routes/Router';
import ThemeProviderWrapper from './theme/ThemeProvider';
import BottomNav from './components/Layout/BottomNav'; // Import 확인

function App() {
  return (
    <ThemeProviderWrapper>
      <Router />
    </ThemeProviderWrapper>
  );
}

export default App;