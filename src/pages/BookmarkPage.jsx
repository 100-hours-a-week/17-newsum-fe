// src/pages/BookmarkPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  Slide,
  Paper,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TokenAxios from '../api/TokenAxios';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import MoveLogin from '../components/modal/MoveLogin';
import CategoryGrid from '../components/grid/CategoryGrid';
import { showInfoSwal } from '../components/modal/ShowInfoModal';
import CategoryDropdown from '../components/dropdown/CategoryDropdown';
import BookmarkMenu from '../components/bookmark/BookmarkMenu';

function BookmarkPage() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 현재 선택된 카테고리 (초기값: 웹툰)
  const [selectedCategory, setSelectedCategory] = useState('웹툰 즐겨찾기');

  // 각 카테고리별 데이터 상태
  const [writers, setWriters] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [webtoons, setWebtoons] = useState([]);

  // 각 카테고리별 로딩/에러 상태
  const [loadingWriters, setLoadingWriters] = useState(false);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [loadingWebtoons, setLoadingWebtoons] = useState(false);

  const [errorWriters, setErrorWriters] = useState(null);
  const [errorKeywords, setErrorKeywords] = useState(null);
  const [errorWebtoons, setErrorWebtoons] = useState(null);

  // 페이지네이션 정보
  const [pageInfoWriters, setPageInfoWriters] = useState(null);
  const [pageInfoKeywords, setPageInfoKeywords] = useState(null);
  const [pageInfoWebtoons, setPageInfoWebtoons] = useState(null);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 뒤로 가기 버튼 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    if (category === 'AI작가 즐겨찾기' || category === '키워드 즐겨찾기') {
      showInfoSwal();
    } else {
      setSelectedCategory(category);
    }
  };

  // API 호출 함수들
  const fetchWriters = useCallback(
    async (cursor = null) => {
      if (!isLoggedIn) {
        setLoadingWriters(false);
        setLoginModalOpen(true);
        return;
      }

      try {
        setLoadingWriters(true);
        setErrorWriters(null);

        const params = { size: 10 };
        if (cursor && writers.length > 0) params.cursor = cursor;

        const response = await TokenAxios.get('/api/v1/users/favorites/writers', { params });
        const data = response.data?.data;
        if (!data) throw new Error('응답 데이터가 없습니다.');

        if (cursor) {
          setWriters((prev) => [...prev, ...data.writers]);
        } else {
          setWriters(data.writers);
        }
        setPageInfoWriters(data.pageInfo || null);
      } catch (err) {
        console.error('AI작가 즐겨찾기 로딩 오류:', err);
        setErrorWriters(err.message || 'AI작가 즐겨찾기 로딩 중 오류가 발생했습니다.');
      } finally {
        setLoadingWriters(false);
      }
    },
    [isLoggedIn, writers.length]
  );

  const fetchKeywords = useCallback(
    async (cursor = null) => {
      if (!isLoggedIn) {
        setLoadingKeywords(false);
        setLoginModalOpen(true);
        return;
      }

      try {
        setLoadingKeywords(true);
        setErrorKeywords(null);

        const params = { size: 10 };
        if (cursor && keywords.length > 0) params.cursor = cursor;

        const response = await TokenAxios.get('/api/v1/users/favorites/keywords', { params });
        const data = response.data?.data;
        if (!data) throw new Error('응답 데이터가 없습니다.');

        if (cursor) {
          setKeywords((prev) => [...prev, ...data.keywords]);
        } else {
          setKeywords(data.keywords);
        }
        setPageInfoKeywords(data.pageInfo || null);
      } catch (err) {
        console.error('키워드 즐겨찾기 로딩 오류:', err);
        setErrorKeywords(err.message || '키워드 즐겨찾기 로딩 중 오류가 발생했습니다.');
      } finally {
        setLoadingKeywords(false);
      }
    },
    [isLoggedIn, keywords.length]
  );

  const fetchWebtoons = useCallback(
    async (cursor = null) => {
      if (!isLoggedIn) {
        setLoadingWebtoons(false);
        setLoginModalOpen(true);
        return;
      }

      try {
        setLoadingWebtoons(true);
        setErrorWebtoons(null);

        const params = { size: 10 };
        if (cursor && webtoons.length > 0) params.cursor = cursor;

        const response = await TokenAxios.get('/api/v1/users/favorites/webtoons', { params });
        const data = response.data?.data;
        if (!data) throw new Error('응답 데이터가 없습니다.');

        if (cursor) {
          setWebtoons((prev) => [...prev, ...data.webtoons]);
        } else {
          setWebtoons(data.webtoons);
        }
        setPageInfoWebtoons(data.pageInfo || null);
      } catch (err) {
        console.error('웹툰 즐겨찾기 로딩 오류:', err);
        setErrorWebtoons(err.message || '웹툰 즐겨찾기 로딩 중 오류가 발생했습니다.');
      } finally {
        setLoadingWebtoons(false);
      }
    },
    [isLoggedIn, webtoons.length]
  );

  // selectedCategory 가 바뀔 때마다 해당 카테고리 데이터를 새로 불러옴
  useEffect(() => {
    if (selectedCategory === 'AI작가 즐겨찾기') {
      fetchWriters();
    } else if (selectedCategory === '키워드 즐겨찾기') {
      fetchKeywords();
    } else if (selectedCategory === '웹툰 즐겨찾기') {
      fetchWebtoons();
    }
  }, [selectedCategory, fetchWriters, fetchKeywords, fetchWebtoons]);

  // 무한 스크롤: 현재 보여지는 카테고리의 다음 페이지가 있으면 스크롤 끝에서 추가 로드
  const handleScroll = useCallback(() => {
    if (selectedCategory === 'AI작가 즐겨찾기') {
      if (loadingWriters || !pageInfoWriters?.hasNext) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        fetchWriters(pageInfoWriters.nextCursor);
      }
    }
    if (selectedCategory === '키워드 즐겨찾기') {
      if (loadingKeywords || !pageInfoKeywords?.hasNext) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        fetchKeywords(pageInfoKeywords.nextCursor);
      }
    }
    if (selectedCategory === '웹툰 즐겨찾기') {
      if (loadingWebtoons || !pageInfoWebtoons?.hasNext) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        fetchWebtoons(pageInfoWebtoons.nextCursor);
      }
    }
  }, [
    selectedCategory,
    loadingWriters,
    loadingKeywords,
    loadingWebtoons,
    pageInfoWriters,
    pageInfoKeywords,
    pageInfoWebtoons,
    fetchWriters,
    fetchKeywords,
    fetchWebtoons,
  ]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAddBookmark = () => {
    setMenuOpen(false);
    // 북마크 추가 로직 구현
  };

  const handleDeleteBookmark = () => {
    setMenuOpen(false);
    // 북마크 삭제 로직 구현
  };

  // 로딩 스피너: 비어 있는 상태에서 로딩 중인 경우
  if (
    (selectedCategory === 'AI작가 즐겨찾기' && loadingWriters && writers.length === 0) ||
    (selectedCategory === '키워드 즐겨찾기' && loadingKeywords && keywords.length === 0) ||
    (selectedCategory === '웹툰 즐겨찾기' && loadingWebtoons && webtoons.length === 0)
  ) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 에러 메시지 출력
  if (
    (selectedCategory === 'AI작가 즐겨찾기' && errorWriters) ||
    (selectedCategory === '키워드 즐겨찾기' && errorKeywords) ||
    (selectedCategory === '웹툰 즐겨찾기' && errorWebtoons)
  ) {
    const errMsg =
      selectedCategory === 'AI작가 즐겨찾기'
        ? errorWriters
        : selectedCategory === '키워드 즐겨찾기'
          ? errorKeywords
          : errorWebtoons;
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{errMsg}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 7 }}>
      {/* 상단 헤더: 아이콘 버튼들 + 드롭다운 */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          zIndex: 10,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          px: 0,
          py: 0,
          width: '100%',
          maxWidth: { xs: '430px', md: '100vw' },
          margin: '0 auto',
          height: '44px',
          minHeight: '44px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* 드롭다운: 항상 100% */}
        <CategoryDropdown
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* 아이콘 버튼들: absolute로 위에 겹치게 */}
        <IconButton
          onClick={handleBack}
          edge="start"
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            p: 2,
            mt: 0,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: '1.5rem' }} />
        </IconButton>
        <IconButton
          onClick={handleMenuClick}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            p: 2,
            mt: 0,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <MoreVertIcon sx={{ fontSize: '1.5rem' }} />
        </IconButton>
      </Box>

      {/* 하단 메뉴 */}
      <BookmarkMenu
        open={menuOpen}
        onAddClick={handleAddBookmark}
        onDeleteClick={handleDeleteBookmark}
      />

      {/* 선택된 카테고리에 따라 내용을 렌더링 */}
      <Container maxWidth="lg" sx={{ overflowX: 'hidden', pt: 2 }}>
        {selectedCategory === 'AI작가 즐겨찾기' && (
          <Box sx={{ mb: 2 }}>
            {writers.length === 0 && !loadingWriters ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  AI작가 즐겨찾기 항목이 없습니다.
                </Typography>
              </Box>
            ) : (
              <>
                <CategoryGrid title="" time="" articles={writers} />
                {loadingWriters && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {selectedCategory === '키워드 즐겨찾기' && (
          <Box sx={{ mb: 2 }}>
            {keywords.length === 0 && !loadingKeywords ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  키워드 즐겨찾기 항목이 없습니다.
                </Typography>
              </Box>
            ) : (
              <>
                <CategoryGrid title="" time="" articles={keywords} />
                {loadingKeywords && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {selectedCategory === '웹툰 즐겨찾기' && (
          <Box sx={{ mb: 2 }}>
            {webtoons.length === 0 && !loadingWebtoons ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  웹툰 즐겨찾기 항목이 없습니다.
                </Typography>
              </Box>
            ) : (
              <>
                <CategoryGrid title="" time="" articles={webtoons} />
                {loadingWebtoons && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </Container>

      <MoveLogin open={loginModalOpen} onClose={() => setLoginModalOpen(false)} from={location.pathname} />
    </Box>
  );
}

export default BookmarkPage;
