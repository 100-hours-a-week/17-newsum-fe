// src/pages/GoogleRedirectHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    // 1) URL에서 code 파라미터 추출
    const params = new URLSearchParams(search);
    const code = params.get('code');

    console.log('Google OAuth 인가코드:', code);

    if (!code) {
      // code가 없으면 로그인으로 돌려보냄
      navigate('/login');
      return;
    }

    // 2) 백엔드로 code 전달 (POST 예시)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/oauth2/authorization/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 3) 받은 JWT 토큰 저장 (예시: localStorage)
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        // 4) 로그인 완료 후 메인페이지로 이동
        navigate('/');
      })
      .catch((err) => {
        console.error('OAuth 처리 중 에러:', err);
        navigate('/login');
      });
  }, [search, navigate]);

  // 로딩 스피너 표시
  return (
    <Box 
      sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}
    >
      <CircularProgress />
    </Box>
  );
}

export default GoogleRedirectHandler;
