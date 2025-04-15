// src/App.tsx
import React from 'react';
import Router from './routes/Router'; // 라우터 컴포넌트 import (곧 생성)
import ThemeProviderWrapper from './theme/ThemeProvider'; // 테마 및 CSS 기준선 적용 (곧 생성)

const App: React.FC = () => {
  return (
    <ThemeProviderWrapper> {/* 테마와 CssBaseline 적용 */}
      <Router /> {/* 라우팅 처리 */}
    </ThemeProviderWrapper>
  );
};

export default App;