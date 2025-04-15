// src/theme/ThemeProvider.tsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // 위에서 정의한 테마 import

interface ThemeProviderWrapperProps {
  children: React.ReactNode; // React 컴포넌트를 자식으로 받도록 타입 지정
}

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 브라우저 기본 CSS를 정규화하고 기본 배경색 등을 적용 */}
      {children} {/* 앱의 나머지 부분을 렌더링 */}
    </ThemeProvider>
  );
};

export default ThemeProviderWrapper;