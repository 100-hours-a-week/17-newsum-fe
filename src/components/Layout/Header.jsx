// src/components/Layout/Header.jsx
import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Avatar } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import styled from '@emotion/styled';
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

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
  const navigate = useNavigate();
  const { user } = useAuth();

  // 프로필 이미지(1순위: localStorage의 user, 2순위: user.picture)
  let profileImg = '';
  let nickname = '';

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      profileImg = parsed.profileImageUrl || '';
      nickname = parsed.nickname || '';
    }
  } catch (e) {
    profileImg = '';
  }

  const handleUserIconClick = () => {
    if (user) {
      navigate('/users/profile');
    } else {
      navigate('/login');
    }
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'info',
      title: '해당기능은 준비중입니다!',
      scrollbarPadding: false,
      confirmButtonColor: '#222',
      confirmButtonText: '확인'
    });
  };

  return (
    <StyledAppBar>
      <StyledToolbar>
        <LogoLink to="/">
          <img src={logo} alt="Newsum Logo" style={{ height: 40, margin: '4px 0' }} />
        </LogoLink>
        <IconsContainer>
          <StyledIconButton
            onClick={handleNotificationClick}
            className={location.pathname === '/notifications' ? 'selected' : ''}
          >
            <NotificationsOutlinedIcon />
          </StyledIconButton>
          <StyledIconButton
            onClick={handleUserIconClick}
            className={location.pathname === '/users/profile' ? 'selected' : ''}
            sx={{ p: 0, width: 40, height: 40 }}
          >
            {user && profileImg ? (
              <Avatar
                src={profileImg}
                alt={nickname || '프로필'}
                sx={{
                  width: 32,
                  height: 32,
                  border: '2px solid #eee',
                  bgcolor: '#fff',
                }}
              />
            ) : (
              <PersonOutlineOutlinedIcon sx={{ fontSize: 32 }} />
            )}
          </StyledIconButton>
        </IconsContainer>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default Header;
