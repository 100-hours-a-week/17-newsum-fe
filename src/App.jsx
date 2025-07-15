// src/App.jsx
import React from 'react';
import Router from './routes/Router';
import ThemeProviderWrapper from './theme/ThemeProvider';
import BottomNav from './components/Layout/BottomNav'; // Import 확인

function App() {

  return (
    <ThemeProviderWrapper>
      <div>
        <Router />
        {/* <p style={{ color: 'gray' }}>
          ENV TOKEN: {import.meta.env.VITE_RELEASE_TEST_TOKEN}
        </p> */}
      </div>
    </ThemeProviderWrapper>
  );
}

export default App;