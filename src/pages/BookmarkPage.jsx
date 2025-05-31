// src/pages/BookmarkPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TokenAxios from '../api/TokenAxios';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import MoveLogin from '../components/modal/MoveLogin';
import CategoryGrid from '../components/grid/CategoryGrid';
import { showInfoSwal } from '../components/modal/ShowInfoModal';

function BookmarkPage() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // "AI작가", "키워드", "웹툰" 세 가지 카테고리를 위한 상수
  const CATEGORY = {
    WRITERS: 'AI작가 즐겨찾기',
    KEYWORDS: '키워드 즐겨찾기',
    WEBTOONS: '웹툰 즐겨찾기',
  };

  // 드롭다운 메뉴 오픈 여부 및 anchor 엘리먼트
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // 현재 선택된 카테고리 (초기값: 웹툰)
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY.WEBTOONS);

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

  // 페이지네이션 정보 (예시)
  const [pageInfoWriters, setPageInfoWriters] = useState(null);
  const [pageInfoKeywords, setPageInfoKeywords] = useState(null);
  const [pageInfoWebtoons, setPageInfoWebtoons] = useState(null);

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // 뒤로 가기 버튼 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 드롭다운 버튼 클릭 → 메뉴 열림
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 항목 클릭 → 카테고리 변경, 메뉴 닫기
  const handleMenuItemClick = (category) => {
    if (category === CATEGORY.WRITERS || category === CATEGORY.KEYWORDS) {
      showInfoSwal();
    } else {
      setSelectedCategory(category);
    }
    setAnchorEl(null);
  };

  // 메뉴 밖 클릭 시 닫기
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * API 호출 함수들
   * (실제 백엔드 엔드포인트에 맞춰서 URL을 수정하세요)
   */
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

  /**
   * selectedCategory 가 바뀔 때마다 해당 카테고리 데이터를 새로 불러옴
   */
  useEffect(() => {
    if (selectedCategory === CATEGORY.WRITERS) {
      fetchWriters();
    } else if (selectedCategory === CATEGORY.KEYWORDS) {
      fetchKeywords();
    } else if (selectedCategory === CATEGORY.WEBTOONS) {
      fetchWebtoons();
    }
  }, [selectedCategory, fetchWriters, fetchKeywords, fetchWebtoons]);

  /**
   * 무한 스크롤: 현재 보여지는 카테고리의 다음 페이지가 있으면 스크롤 끝에서 추가 로드
   */
  const handleScroll = useCallback(() => {
    if (selectedCategory === CATEGORY.WRITERS) {
      if (loadingWriters || !pageInfoWriters?.hasNext) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        fetchWriters(pageInfoWriters.nextCursor);
      }
    }
    if (selectedCategory === CATEGORY.KEYWORDS) {
      if (loadingKeywords || !pageInfoKeywords?.hasNext) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        fetchKeywords(pageInfoKeywords.nextCursor);
      }
    }
    if (selectedCategory === CATEGORY.WEBTOONS) {
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

  // 로딩 스피너: 비어 있는 상태에서 로딩 중인 경우
  if (
    (selectedCategory === CATEGORY.WRITERS && loadingWriters && writers.length === 0) ||
    (selectedCategory === CATEGORY.KEYWORDS && loadingKeywords && keywords.length === 0) ||
    (selectedCategory === CATEGORY.WEBTOONS && loadingWebtoons && webtoons.length === 0)
  ) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 에러 메시지 출력
  if (
    (selectedCategory === CATEGORY.WRITERS && errorWriters) ||
    (selectedCategory === CATEGORY.KEYWORDS && errorKeywords) ||
    (selectedCategory === CATEGORY.WEBTOONS && errorWebtoons)
  ) {
    const errMsg =
      selectedCategory === CATEGORY.WRITERS
        ? errorWriters
        : selectedCategory === CATEGORY.KEYWORDS
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
      {/** 상단 헤더: 뒤로 가기 + 제목("즐겨찾기") + 드롭다운 버튼 **/}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          zIndex: 10,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          px: 2,
          py: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '44px',
        }}
      >
        <IconButton
          onClick={handleBack}
          edge="start"
          sx={{
            p: 0.5,
            mt: -0.5,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: '1.5rem' }} />
        </IconButton>

        {/* 드롭다운을 여는 버튼: 현재 선택된 카테고리 + 아래 화살표 */}
        <Button
          onClick={handleDropdownClick}
          sx={{
            ml: 1,
            flexGrow: 1,
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'text.primary',
            mt: -0.5,
          }}
          endIcon={<ArrowDropDownIcon />}
        >
          {selectedCategory}
        </Button>

        <Box sx={{ width: 35, height: 35, ml: 1, mt: -0.5 }} />
      </Box>

      {/** 드롭다운 메뉴 **/}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {Object.values(CATEGORY).map((cat) => (
          <MenuItem
            key={cat}
            selected={cat === selectedCategory && cat === CATEGORY.WEBTOONS}
            onClick={() => handleMenuItemClick(cat)}
            sx={{ minWidth: 200, textAlign: 'center' }}
          >
            {cat}
          </MenuItem>
        ))}
      </Menu>

      {/** 선택된 카테고리에 따라 내용을 렌더링 **/}
      <Container maxWidth="lg" sx={{ overflowX: 'hidden', pt: 2 }}>
        {selectedCategory === CATEGORY.WRITERS && (
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

        {selectedCategory === CATEGORY.KEYWORDS && (
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

        {selectedCategory === CATEGORY.WEBTOONS && (
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

      <MoveLogin open={loginModalOpen} onCancel={() => setLoginModalOpen(false)} from={location.pathname} />
    </Box>
  );
}

export default BookmarkPage;
