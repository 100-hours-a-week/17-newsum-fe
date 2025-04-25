// src/components/Layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
// import Footer from './Footer'; // 필요시 Footer 생성 및 import
// import BottomNav from './BottomNav'; // 필요시 BottomNav 생성 및 import

function MainLayout() { // React.FC 타입 제거
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 8, sm: 3 }, // BottomNav 고려한 패딩 (BottomNav 추가 시)
          mt: '64px' // AppBar 높이만큼 마진 (AppBar position="fixed" 사용 시 필요) -> Toolbar 컴포넌트로 대체 가능
        }}
      >
        {/* <Toolbar /> AppBar 높이만큼 공간 확보 (더 나은 방법) */}
        <Outlet /> {/* 페이지 콘텐츠 렌더링 */}
      </Box>
      {/* <Footer /> */}
      {/* <BottomNav /> */}
    </Box>
  );
}

export default MainLayout;