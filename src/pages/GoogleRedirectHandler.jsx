import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DefaultAxios from '../api/DefaultAxios';

function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const from = urlParams.get('state') || '/';

        if (!code) throw new Error('인증 코드를 받지 못했습니다.');

        const response = await DefaultAxios.post(
          import.meta.env.VITE_GOOGLE_CALLBACK_API_URL,
          { code }
        );

        const data = response.data;

        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        login(data.userInfo);
        navigate(from);
      } catch (error) {
        console.error('구글 로그인 처리 중 오류:', error);
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [navigate, login, location]);

  return null;
}

export default GoogleRedirectHandler;
