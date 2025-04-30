// src/components/Layout/BottomNav.jsx
import React, { useState, useEffect } from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import styled from '@emotion/styled';

const StyledPaper = styled(Paper)`
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.appBar - 1};
  border-top: ${({ theme }) => `1px solid ${theme.palette.divider}`};
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  background-color: white;

  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
`;

const StyledBottomNavigation = styled(BottomNavigation)`
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  background-color: white;

  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 100%;
    padding: 0 24px;
    border-radius: 0;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    padding: 0 16px;
    border-radius: 0;
  }

  .MuiBottomNavigationAction-root {
    min-width: 60px;
    padding: 6px 12px;
    color: #666;
    transition: all 0.2s ease-in-out;

    .MuiBottomNavigationAction-label {
      font-size: 0.75rem;
      opacity: 1;
    }

    &.Mui-selected {
      color: black;

      .MuiBottomNavigationAction-label {
        font-size: 0.75rem;
        opacity: 1;
      }
    }
  }
`;

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const navItems = [
    { 
      label: '홈', 
      value: '/', 
      icon: <HomeOutlinedIcon />,
      selectedIcon: <HomeIcon />
    },
    { 
      label: '검색', 
      value: '/search', 
      icon: <SearchOutlinedIcon />,
      selectedIcon: <SearchIcon />
    },
    { 
      label: '북마크', 
      value: '/bookmarks', 
      icon: <BookmarkBorderIcon />,
      selectedIcon: <BookmarkIcon />
    },
    { 
      label: '내 정보', 
      value: '/my', 
      icon: <PersonOutlineIcon />,
      selectedIcon: <PersonIcon />
    },
  ];

  useEffect(() => {
    const currentNavItem = navItems.find(item => location.pathname.startsWith(item.value) && item.value !== '/');
    setValue(currentNavItem ? currentNavItem.value : (location.pathname === '/' ? '/' : ''));
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <StyledPaper elevation={0}>
      <StyledBottomNavigation showLabels value={value} onChange={handleChange}>
        {navItems.map((item) => (
          <BottomNavigationAction 
            key={item.value} 
            label={item.label} 
            value={item.value} 
            icon={value === item.value ? item.selectedIcon : item.icon}
            sx={{
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                opacity: 1,
              },
            }}
          />
        ))}
      </StyledBottomNavigation>
    </StyledPaper>
  );
}

export default BottomNav;