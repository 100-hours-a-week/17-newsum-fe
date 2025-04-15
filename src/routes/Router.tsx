// src/routes/Router.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout'; // 메인 레이아웃 import
import HomePage from '../pages/HomePage';
import ArticlePage from '../pages/ArticlePage';
// 다른 페이지들도 import...
// import LoginPage from '../pages/LoginPage';
// import NotFoundPage from '../pages/NotFoundPage';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* MainLayout을 사용하는 라우트 그룹 */}
      <Route element={<MainLayout />}> {/* 이 Route 내부에 있는 모든 경로는 MainLayout을 거침 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:articleId" element={<ArticlePage />} />
        {/* <Route path="/category/:categoryName" element={<CategoryPage />} /> */}
        {/* 추가적인 페이지 라우트들... */}
      </Route>

      {/* 레이아웃 없이 단독으로 표시될 페이지 (예: 로그인 페이지) */}
      {/* <Route path="/login" element={<LoginPage />} /> */}

      {/* 404 Not Found 페이지 */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default Router;