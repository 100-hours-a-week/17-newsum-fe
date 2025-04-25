// src/components/Layout/BottomNav.jsx
import React, { useState, useEffect } from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const navItems = [
    { label: '홈', value: '/', icon: <HomeIcon /> },
    { label: '검색', value: '/search', icon: <SearchIcon /> },
    { label: '북마크', value: '/bookmarks', icon: <BookmarkBorderIcon /> },
    { label: '내 정보', value: '/my', icon: <PersonOutlineIcon /> },
  ];

  useEffect(() => {
      const currentNavItem = navItems.find(item => location.pathname.startsWith(item.value) && item.value !== '/');
      setValue(currentNavItem ? currentNavItem.value : (location.pathname === '/' ? '/' : ''));
  }, [location.pathname]); // navItems는 여기서 의존성 필요 없음 (컴포넌트 내에서 정의되므로)

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.appBar - 1, display: { xs: 'block', sm: 'none' }, borderTop: (theme) => `1px solid ${theme.palette.divider}` }} elevation={3}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        {navItems.map((item) => ( <BottomNavigationAction key={item.value} label={item.label} value={item.value} icon={item.icon} /> ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;