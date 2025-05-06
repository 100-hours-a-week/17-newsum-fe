// src/routes/Router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import HomePage from '../pages/HomePage';
import ArticlePage from '../pages/ArticlePage';
import LoginPage from '../pages/LoginPage';
import MyProfilePage from '../pages/MyProfilePage';
import GoogleRedirectHandler from '../pages/GoogleRedirectHandler';
import KakaoRedirectHandler from '../pages/KakaoRedirectHandler';

function Router() {
  return (
    <Routes>
      {/* 여기에 LoginPage 연결 */}
      {/* <Route path="/login" element={<GoogleRedirectHandler />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth2/callback/google" element={<GoogleRedirectHandler />} />
      <Route path="/oauth2/callback/kakao" element={<KakaoRedirectHandler />} />

      {/* ⭐️ 기존 헤더/바텀네비 없는 단독 페이지로 분리 ⭐️ */}
      <Route path="/users/profile" element={<MyProfilePage />} />

      {/* MainLayout 아래에 나머지 페이지들 */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="article/:articleId" element={<ArticlePage />} />
      </Route>
    </Routes>
  );
}

export default Router;
