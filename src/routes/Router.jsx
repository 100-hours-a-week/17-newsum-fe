// src/routes/Router.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import HomePage from '../pages/HomePage';
import ArticlePage from '../pages/ArticlePage'; // ★ ArticlePage import 확인

function Router() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* ★★★ 아래 라인이 정확히 있는지 확인하세요 ★★★ */}
        <Route path="/article/:articleId" element={<ArticlePage />} />
        {/* 다른 라우트들... */}
      </Route>
      {/* 다른 레이아웃 라우트... */}
    </Routes>
  );
}

export default Router;