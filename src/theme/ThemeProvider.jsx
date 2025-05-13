// src/theme/ThemeProvider.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // import theme

// JavaScript에서는 props 타입 정의가 필수는 아님 (PropTypes 사용 가능)
function ThemeProviderWrapper({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ThemeProviderWrapper;