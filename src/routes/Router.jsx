// src/routes/Router.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout                from '../components/Layout/MainLayout';
import NoHeaderLayout            from '../components/Layout/NoHeaderLayout';
import HomePage                  from '../pages/HomePage';
import ArticlePage               from '../pages/ArticlePage';
import CommentPage               from '../pages/CommentPage';
import LoginPage                 from '../pages/LoginPage';
import GoogleRedirectHandler     from '../pages/GoogleRedirectHandler';
import CategoryPage              from '../pages/CategoryPage';

function Router() {
  return (
    <Routes>
      {/* 레이아웃 없이 렌더링할 페이지들 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/google/redirect" element={<GoogleRedirectHandler />} />
      <Route path="/comment/:articleId" element={<CommentPage />} />

      {/* MainLayout: 헤더/푸터 있는 공통 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route path="/"                   element={<HomePage />} />
        <Route path="/category/:category_id" element={<CategoryPage />} />
        {/* 필요하면 추가 페이지 */}
      </Route>

      <Route element={<NoHeaderLayout />}>
        <Route path="/article/:articleId" element={<ArticlePage />} />
        
      </Route>
    </Routes>
  );
}

export default Router;
