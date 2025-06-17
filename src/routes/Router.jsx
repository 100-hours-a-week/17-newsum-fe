// src/routes/Router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import NoHeaderLayout from '../components/Layout/NoHeaderLayout'
import ArticleLayout from '../components/Layout/ArticleLayout';
import HomePage from '../pages/HomePage';
import ArticlePage from '../pages/ArticlePage';
import LoginPage from '../pages/LoginPage';
import CommentPage from '../pages/CommentPage';
import CategoryPage from '../pages/CategoryPage';
import MyProfilePage from '../pages/MyProfilePage';
import GoogleRedirectHandler from '../pages/GoogleRedirectHandler';
import KakaoRedirectHandler from '../pages/KakaoRedirectHandler';
import RecentPage from '../pages/RecentPage';
import EditProfilePage from '../pages/EditProfilePage';
import BookmarkPage from '../pages/BookmarkPage';
import SearchPage from '../pages/SearchPage';
import NotificationPage from '../pages/NotificationPage';
import KeywordBookmarkPage from '../pages/KeywordBookmarkPage';
import KeywordAddPage from '../pages/KeywordAddPage';
import AiAuthorListPage from '../pages/AiAuthorListPage';
import AiAuthorDetailPage from '../pages/AiAuthorDetailPage';
import AiAuthorBookmarkPage from '../pages/AiAuthorBookmarkPage';


function Router() {
  return (
    <Routes>
      {/* 여기에 LoginPage 연결 */}
      {/* <Route path="/login" element={<GoogleRedirectHandler />} /> */}
      <Route path="/oauth2/callback/google" element={<GoogleRedirectHandler />} />
      <Route path="/oauth2/callback/kakao" element={<KakaoRedirectHandler />} />
      <Route path='/article/:articleId/comments' element={<CommentPage />} />

      {/* ⭐️ 기존 헤더/바텀네비 없는 단독 페이지로 분리 ⭐️ */}


      {/* MainLayout: 헤더/푸터 있는 공통 레이아웃 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category_id" element={<CategoryPage />} />
      </Route>

      <Route element={<ArticleLayout />}>
        <Route path='/article/:articleId' element={<ArticlePage />} />
      </Route>

      <Route element={<NoHeaderLayout />}>
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route path="/users/profile" element={<MyProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/bookmarks" element={<BookmarkPage />} />
        <Route path="/keyword-bookmarks" element={<KeywordBookmarkPage />} />
        <Route path="/keyword-add" element={<KeywordAddPage />} />
        <Route path="/ai-authors" element={<AiAuthorListPage />} />
        <Route path="/ai-authors/:id" element={<AiAuthorDetailPage />} />
        <Route path="/ai-author-bookmarks" element={<AiAuthorBookmarkPage />} />
      </Route>
    </Routes>
  );
}

export default Router;