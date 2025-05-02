import axios from 'axios';

// Token 담고 요청하는 경우(local Storage에서 accessToken 가져오기)
const TokenAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
TokenAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
TokenAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 토큰 만료 등의 에러 처리
    if (error.response?.status === 401) {
      // 토큰 만료 처리 로직
      localStorage.removeItem('accessToken');
      // 로그인 페이지로 리다이렉트 등의 처리
    }
    return Promise.reject(error);
  }
);

export default TokenAxios; 