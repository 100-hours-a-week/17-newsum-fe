// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, CircularProgress, Alert, Pagination } from '@mui/material';
import { fetchArticles } from '../services/articleApi';
import CategoryTabs from '../components/tabs/CategoryTabs';
import Footer from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import TodayNewsSection from '../components/sections/TodayNewsSection';
import RecentNewsSection from '../components/sections/RecentNewsSection';
import CategoryNewsSection from '../components/sections/CategoryNewsSection';
import Top3ToonsSection from '../components/sections/Top3ToonsSection';
import useWebtoonData from '../hooks/useWebtoonData';

const ITEMS_PER_PAGE = 6;

function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // 커스텀 훅을 사용하여 웹툰 데이터 가져오기
  const { loading: dataLoading, error: dataError, webtoonsData, top3Data, recentData } = useWebtoonData();

  // 탭 변경에 따른 기사 로딩 (기존 로직 유지)
  const [tabLoading, setTabLoading] = useState(false);
  const [tabError, setTabError] = useState(null);

  const loadArticles = useCallback(async (category, currentPage) => {
    try {
      setTabLoading(true);
      setTabError(null);
      const response = await fetchArticles(currentPage, ITEMS_PER_PAGE, category);
      setTotalCount(response.totalCount);
    } catch (err) {
      setTabError(err.message || 'An unknown error occurred');
    } finally {
      setTabLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles(activeTab, page);
  }, [activeTab, page, loadArticles]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleMoreClick = (section) => {
    console.log(`More clicked for ${section}`);
    if (section === '/today') {
      navigate('/today');
    } else {
      navigate(section);
    }
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 전체 로딩 상태
  const isLoading = dataLoading || tabLoading;
  // 오류 메시지 통합
  const errorMessage = dataError || tabError;

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ my: 1 }}>
          {/* 카테고리 탭 */}
          <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* 로딩 중일 때 로딩 스피너 표시 */}
          {isLoading && (<Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>)}
          {errorMessage && (<Alert severity="error" sx={{ my: 1 }}>{errorMessage}</Alert>)}

          {/* 최상위 3개 웹툰 캐러셀 섹션 */}
          {!isLoading && !errorMessage && <Top3ToonsSection topToons={top3Data.top3News} />}

          {/* 오늘의 뉴스 섹션 */}
          <TodayNewsSection
            todaysNews={top3Data.todayNews}
            onMoreClick={() => handleMoreClick('/today')}
          />

          {/* 최근 본 뉴스 섹션 */}
          <RecentNewsSection
            recentWebtoons={recentData.recentWebtoons}
            onMoreClick={() => handleMoreClick('/recent')}
          />

          {/* 카테고리별 뉴스 섹션 */}
          <CategoryNewsSection
            webtoonsData={webtoonsData}
            onMoreClick={handleMoreClick}
          />

          {/* 페이지네이션 표시 */}
          {!isLoading && !errorMessage && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" showFirstButton showLastButton />
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default HomePage;