// src/routes/Router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import NoHeaderLayout from '../components/Layout/NoHeaderLayout'
import HomePage from '../pages/HomePage';
import ArticlePage from '../pages/ArticlePage';
import LoginPage from '../pages/LoginPage';
import CommentPage from '../pages/CommentPage';
import CategoryPage from '../pages/CategoryPage';
import MyProfilePage from '../pages/MyProfilePage';
import GoogleRedirectHandler from '../pages/GoogleRedirectHandler';
import KakaoRedirectHandler from '../pages/KakaoRedirectHandler';
import RecentPage from '../pages/RecentPage';

function Router() {
  return (
    <Routes>
      {/* 여기에 LoginPage 연결 */}
      {/* <Route path="/login" element={<GoogleRedirectHandler />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth2/callback/google" element={<GoogleRedirectHandler />} />
      <Route path="/oauth2/callback/kakao" element={<KakaoRedirectHandler />} />
      <Route path='/comment/:articleId' element={<CommentPage />} />

      {/* ⭐️ 기존 헤더/바텀네비 없는 단독 페이지로 분리 ⭐️ */}
      <Route path="/users/profile" element={<MyProfilePage />} />

   
      {/* MainLayout: 헤더/푸터 있는 공통 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category_id" element={<CategoryPage />} />
        <Route path='/article/:articleId' element={<ArticlePage />}/>
      </Route>


      <Route element={<NoHeaderLayout />}>
        
        <Route path="/recent" element={<RecentPage />} />
      </Route>
    </Routes>
  );
}

export default Router;