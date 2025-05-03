// src/pages/GoogleRedirectHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
          throw new Error('인증 코드를 받지 못했습니다.');
        }

        // 서버에 인증 코드 전송
        const response = await fetch('http://localhost:8080/api/v1/oauth2/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('로그인에 실패했습니다.');
        }

        const data = await response.json();

        // 사용자 정보를 세션 스토리지에 저장
        sessionStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);

        // AuthContext에 사용자 정보 저장
        login(data.userInfo);

        // 홈페이지로 리다이렉트
        navigate('/');
      } catch (error) {
        console.error('구글 로그인 처리 중 오류 발생:', error);
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [navigate, login]);

  return null;
}

export default GoogleRedirectHandler;
