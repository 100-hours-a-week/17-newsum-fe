import React, { createContext, useContext, useState, useCallback } from 'react';
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

  const login = useCallback((userData) => {
    if (!userData) {
      console.warn('login에 전달된 userData가 없습니다.');
      return;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete TokenAxios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
