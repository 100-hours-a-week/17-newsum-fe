import React, { createContext, useContext, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom'; // 주석 처리 또는 제거
import TokenAxios from '../api/TokenAxios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("유저 정보 파싱 실패:", e);
      localStorage.removeItem('user');
      return null;
    }
  });

  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   setIsLoggedIn(!!token);
  // }, []);

  const login = useCallback((userData) => {
    if (!userData) {
      console.warn('login에 전달된 userData가 없습니다.');
      return;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete TokenAxios.defaults.headers.common['Authorization'];
  }, []);

  // user 상태를 기반으로 isLoggedIn 값을 제공
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
