// src/components/Layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // 중첩 라우트의 자식 페이지를 렌더링
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {/* 메인 콘텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // 남은 공간을 모두 차지하도록 설정
          py: 3, // 상하 패딩
          px: { xs: 1, sm: 2, md: 3 } // 좌우 패딩 (반응형)
        }}
      >
        <Toolbar /> {/* 헤더 높이만큼 공간을 밀어주기 위한 빈 Toolbar */}
        <Outlet /> {/* 여기에 각 페이지 컴포넌트가 렌더링됩니다 */}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;