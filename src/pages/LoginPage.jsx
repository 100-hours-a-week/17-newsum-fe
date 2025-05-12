// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button } from '@mui/material';
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
    const from = new URLSearchParams(window.location.search).get('from') || '/';

    const url = `${authUrl}`
      + `?client_id=${encodeURIComponent(clientId)}`
      + `&redirect_uri=${encodeURIComponent(redirectUri)}`
      + `&response_type=code`
      + `&scope=${encodeURIComponent(scope)}`
      + `&state=${encodeURIComponent(from)}`;

    window.location.assign(url);
  };

  const handleKakaoLogin = () => {
    const from = new URLSearchParams(window.location.search).get('from') || '/';
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code&state=${encodeURIComponent(from)}`;
    window.location.href = KAKAO_AUTH_URL;
  };

  // 서버에서 받은 토큰을 처리하는 함수
  const handleTokenFromResponse = async () => {
    try {
      const logs = [];

      const addLog = (message, data = null) => {
        const log = {
          timestamp: new Date().toISOString(),
          message,
          data
        };
        logs.push(log);
        localStorage.setItem('login_debug_log', JSON.stringify(logs));
      };

      addLog('리다이렉트 후 페이지 로드', {
        url: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search
      });

      // 현재 URL에서 code 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');

      addLog('URL 파라미터 추출', {
        code,
        accessToken,
        refreshToken,
        allParams: Object.fromEntries(urlParams.entries())
      });

      if (code) {
        // 서버에 code를 전송하여 토큰 요청
        addLog('서버에 토큰 요청 시작');
        const res = await fetch("http://localhost:8080/api/oauth/login/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        addLog('서버 응답', {
          status: res.status,
          headers: Object.fromEntries(res.headers.entries())
        });

        if (!res.ok) {
          throw new Error('로그인 실패');
        }

        const data = await res.json();
        addLog('서버 응답 데이터', data);

        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        addLog('로컬 스토리지에 정보 저장', {
          userInfo: localStorage.getItem("userInfo"),
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken")
        });

        // 이전 화면으로 이동
        navigate('/');
      } else if (accessToken && refreshToken) {
        // URL에 토큰이 직접 포함된 경우
        addLog('URL에서 직접 토큰을 받음');
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        addLog('로컬 스토리지에 토큰 저장', {
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken")
        });
        // 이전 화면으로 이동
        navigate('-1');
      }
    } catch (error) {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
      };
      localStorage.setItem('login_debug_log', JSON.stringify(errorLog));
      console.error('토큰 처리 중 오류 발생:', error);
      alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 컴포넌트 마운트 시 토큰 확인
  React.useEffect(() => {
    const log = {
      timestamp: new Date().toISOString(),
      event: 'LoginPage 컴포넌트 마운트'
    };
    localStorage.setItem('login_debug_log', JSON.stringify(log));
    handleTokenFromResponse();
  }, []);

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
        <IconButton onClick={() => navigate(-1)}>
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

          {/* 카카오 로그인 버튼 */}
          <Box
            component="img"
            src={kakaoLoginBtn}
            alt="카카오 로그인"
            sx={{
              width: 50,
              cursor: 'pointer'
            }}
            onClick={handleKakaoLogin}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
