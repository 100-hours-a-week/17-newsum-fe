// src/routes/Router.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout                from '../components/Layout/MainLayout';
import HomePage                  from '../pages/HomePage';
import ArticlePage               from '../pages/ArticlePage';
import LoginPage                 from '../pages/LoginPage';
import GoogleRedirectHandler     from '../pages/GoogleRedirectHandler';

function Router() {
  return (
    <Routes>
      {/* 레이아웃 없이 렌더링할 페이지들 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/google/redirect" element={<GoogleRedirectHandler />} />

      {/* MainLayout: 헤더/푸터 있는 공통 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route path="/"                   element={<HomePage />} />
        <Route path="/article/:articleId" element={<ArticlePage />} />
        {/* 필요하면 추가 페이지 */}
      </Route>
    </Routes>
  );
}

export default Router;
