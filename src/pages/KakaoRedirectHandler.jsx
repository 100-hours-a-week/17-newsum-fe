import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';

function KakaoRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const from = urlParams.get('state') || '/';

        if (!code) throw new Error('카카오 인증 코드를 받지 못했습니다.');

        const response = await DefaultAxios.post(
          import.meta.env.VITE_KAKAO_CALLBACK_API_URL,
          { code }
        );

        const { accessToken, refreshToken } = response.data;

        // 1️⃣ 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // 2️⃣ TokenAxios에 토큰 설정
        TokenAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // 3️⃣ 서버에서 사용자 프로필 받아오기
        const userRes = await TokenAxios.get('/api/v1/users/profile');
        const user = userRes.data.data;

        // 4️⃣ user 저장 (nickname 포함됨)
        localStorage.setItem('user', JSON.stringify(user));
        login(user); // Context 업데이트

        // ✅ userInfo는 이제 사용하지 않음
        //localStorage.removeItem('userInfo');

        navigate(from);
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        navigate('/login');
      }
    };

    handleKakaoCallback();
  }, [navigate, login, location]);

  return null;
}

export default KakaoRedirectHandler;
