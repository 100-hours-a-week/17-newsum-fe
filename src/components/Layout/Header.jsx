// src/components/Layout/Header.jsx
import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
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
  justify-content: space-between;

  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 100%;
    padding: 0 24px;
  }

  @media (max-width: 767px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const LogoLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const IconsContainer = styled(Box)`
  display: flex;
  gap: 12px;
  margin-right: -8px;
`;

const StyledIconButton = styled(IconButton)`
  width: 40px;
  height: 40px;
  padding: 8px;
  color: #666;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .MuiSvgIcon-root {
    font-size: 24px;
    stroke-width: 0.4px;
    transition: all 0.2s ease-in-out;
  }

  &.selected {
    color: #000;
    background-color: rgba(0, 0, 0, 0.04);

    .MuiSvgIcon-root {
      transform: scale(1.1);
    }
  }
`;

function Header() {
  const location = useLocation();

  return (
    <StyledAppBar>
      <StyledToolbar>
        <LogoLink to="/">
          <img src={logo} alt="Newsum Logo" style={{ height: 40, margin: '4px 0' }} />
        </LogoLink>
        <IconsContainer>
          <StyledIconButton
            component={RouterLink}
            to="/notifications"
            className={location.pathname === '/notifications' ? 'selected' : ''}
          >
            <NotificationsOutlinedIcon />
          </StyledIconButton>
          <StyledIconButton
            component={RouterLink}
            to="/my"
            className={location.pathname === '/my' ? 'selected' : ''}
          >
            <PersonOutlineOutlinedIcon />
          </StyledIconButton>
        </IconsContainer>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default Header;
