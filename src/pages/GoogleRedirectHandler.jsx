import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';

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

        if (!code) throw new Error('구글 인증 코드를 받지 못했습니다.');

        // 1️⃣ 구글 인증 코드로 토큰 요청
        const response = await DefaultAxios.post(
          import.meta.env.VITE_GOOGLE_CALLBACK_API_URL,
          {
            code,
            provider: 'GOOGLE'
          }
        );
        
        console.log('구글 로그인 응답:', response.data);

        // 2️⃣ 응답 데이터 구조 확인 및 처리
        const { accessToken, refreshToken, user } = response.data;

        if (!accessToken || !refreshToken) {
          throw new Error('토큰 정보가 없습니다.');
        }

        // 3️⃣ 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // 4️⃣ TokenAxios에 토큰 설정
        TokenAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // 5️⃣ 사용자 정보 처리
        if (user) {
          // 서버에서 사용자 정보를 받은 경우
          // 이미 가입된 사용자인 경우 기존 정보 유지
          const existingUser = localStorage.getItem('user');
          if (existingUser) {
            const parsedUser = JSON.parse(existingUser);
            if (parsedUser.email === user.email) {
              // 이메일이 일치하는 경우 기존 사용자 정보 사용
              login(parsedUser);
            } else {
              // 새로운 사용자인 경우 서버에서 받은 정보 사용
              localStorage.setItem('user', JSON.stringify(user));
              login(user);
            }
          } else {
            // 로컬 스토리지에 사용자 정보가 없는 경우
            localStorage.setItem('user', JSON.stringify(user));
            login(user);
          }
        } else {
          // 사용자 정보를 별도로 요청해야 하는 경우
          try {
            const userRes = await TokenAxios.get('/api/v1/users/profile');
            const userData = userRes.data.data;

            // 이미 가입된 사용자인 경우 기존 정보 유지
            const existingUser = localStorage.getItem('user');
            if (existingUser) {
              const parsedUser = JSON.parse(existingUser);
              if (parsedUser.email === userData.email) {
                login(parsedUser);
              } else {
                localStorage.setItem('user', JSON.stringify(userData));
                login(userData);
              }
            } else {
              localStorage.setItem('user', JSON.stringify(userData));
              login(userData);
            }
          } catch (profileError) {
            console.error('사용자 프로필 조회 실패:', profileError);
            throw new Error('사용자 정보를 가져오는데 실패했습니다.');
          }
        }

        navigate(from);
      } catch (error) {
        console.error('구글 로그인 처리 중 오류:', error);
        if (error.response) {
          console.error('서버 응답:', error.response.data);
        }
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [navigate, login, location]);

  return null;
}

export default GoogleRedirectHandler;
