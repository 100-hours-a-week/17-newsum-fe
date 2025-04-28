// src/components/Layout/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import styled from '@emotion/styled';
import logo from '../../assets/logo.png';

const StyledAppBar = styled(AppBar)`
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: white;
  box-shadow: none;

  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 100%;
    border-radius: 0;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    border-radius: 0;
  }
`;

const StyledToolbar = styled(Toolbar)`
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
  min-height: 56px;

  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 100%;
    padding: 0 24px;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const NavButton = styled(Button)`
  color: #666;
  border-radius: 8px;
  padding: 6px 12px;
  min-width: 60px;
  text-transform: none;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.selected {
    color: white;
    background-color: black;
  }
`;

function Header() {
  const location = useLocation();

  return (
    <StyledAppBar>
      <StyledToolbar>
        <RouterLink to="/" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logo} alt="Newsum Logo" style={{ height: 40, margin: '4px 0' }} />
        </RouterLink>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <NavButton
            component={RouterLink}
            to="/search"
            className={location.pathname === '/search' ? 'selected' : ''}
            startIcon={<SearchIcon />}
          >
            검색
          </NavButton>
          <NavButton
            component={RouterLink}
            to="/my"
            className={location.pathname === '/my' ? 'selected' : ''}
            startIcon={<PersonOutlineIcon />}
          >
            내 정보
          </NavButton>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default Header;