import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DefaultAxios from '../api/DefaultAxios';

function KakaoRedirectHandler() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) throw new Error('카카오 인증 코드를 받지 못했습니다.');

        const response = await DefaultAxios.post(
          import.meta.env.VITE_KAKAO_CALLBACK_API_URL,
          { code }
        );

        const data = response.data;

        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        login(data.userInfo);
        navigate('/');
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        navigate('/login');
      }
    };

    handleKakaoCallback();
  }, [navigate, login]);

  return null;
}

export default KakaoRedirectHandler;
