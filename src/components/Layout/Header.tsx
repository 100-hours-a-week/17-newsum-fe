// src/components/Layout/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search'; // 검색 아이콘 import
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // 내 정보 아이콘 import
const Header: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography /* ... 로고 ... */ >NewSum</Typography>
        <Box sx={{ flexGrow: 1 }} /> {/* 중간 공간 채우기 */}
        <IconButton color="inherit" aria-label="search">
          <SearchIcon />
        </IconButton>
        <Button color="inherit" startIcon={<PersonOutlineIcon />}>로그인</Button>
      </Toolbar>
    </AppBar>
  );
};
export default Header;