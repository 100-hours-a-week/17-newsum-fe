// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import newsumLogo from '../assets/newsum_logo.jpeg';
import googleLoginBtn from '../assets/google_login.png';
import kakaoLoginBtn from '../assets/kakao_login.png';

function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const authUrl = 'https://accounts.google.com/o/oauth2/auth';
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = 'openid email profile';

    const url = `${authUrl}`
      + `?client_id=${encodeURIComponent(clientId)}`
      + `&redirect_uri=${encodeURIComponent(redirectUri)}`
      + `&response_type=code`
      + `&scope=${encodeURIComponent(scope)}`;

    window.location.assign(url);
  };

  const handleKakaoLogin = () => {
    // 카카오는 나중에 구현
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#fafafa',
      }}
    >
      {/* 뒤로가기 버튼 */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
        }}
      >
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* 본문 중앙 부분 */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 로고 */}
        <Box
          component="img"
          src={newsumLogo}
          alt="Newsum Logo"
          sx={{ width: 180, mb: 2 }}
        />

        {/* 로그인 안내 문구 */}
        <Typography
          variant="h6"
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          로그인 해라 멍!
        </Typography>

        {/* 구글 + 카카오 로그인 버튼 (가로 정렬) */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* 구글 로그인 버튼 */}
          <Box
            component="img"
            src={googleLoginBtn}
            alt="구글 로그인"
            sx={{
              width: 70,
              height: 50,
              cursor: 'pointer',
              objectFit: 'contain',
            }}
            onClick={handleGoogleLogin}
          />

          {/* 카카오 로그인 버튼 (아직 비활성) */}
          <Box
            component="img"
            src={kakaoLoginBtn}
            alt="카카오 로그인"
            sx={{
              width: 50,
              cursor: 'pointer',
              opacity: 0.5,
            }}
            onClick={handleKakaoLogin}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
