// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Grid, CircularProgress, Alert, Pagination } from '@mui/material';
import { fetchArticles } from '../services/articleApi';
import ArticleCard from '../components/article/ArticleCard';
import NewsBox from '../components/grid/MainGrid';
import Carousel from '../components/Carousel/Carousel';
import CategoryTabs from '../components/tabs/CategoryTabs';
import Footer from '../components/Layout/Footer';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';
import { useNavigate } from 'react-router-dom';
const ITEMS_PER_PAGE = 6;
function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [webtoonsData, setWebtoonsData] = useState({});
  const [top3Data, setTop3Data] = useState({});
  const [recentData, setRecentData] = useState({});

  const navigate = useNavigate();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const loadArticles = useCallback(async (category, currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchArticles(currentPage, ITEMS_PER_PAGE, category);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
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
    navigate(section);
    // 추후 더보기 기능 구현
  };

  // ❗️❗️ axios 사용한 요청 예시
  const getWebtoons = async () => {
    try {
      const res = await DefaultAxios.get('/api/v1/webtoons/main');
      console.log(res.data?.data)
      setWebtoonsData(res.data?.data || {});
    } catch (err) {
      console.log(err);
    }
  };
  
  const getTop3Data = async () => {
    try {
      const res = await DefaultAxios.get('/api/v1/webtoons/top');
      console.log(res.data)
      setTop3Data(res.data?.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  const getRecentData = async () => {
    try {
      const res = await TokenAxios.get('/api/v1/webtoons/recent');
      console.log(res.data)
      setRecentData(res.data?.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWebtoons();
    getTop3Data();
    getRecentData();
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ my: 1 }}>
          {/* 카테고리 탭 */}
          <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* 로딩 중일 때 로딩 스피너 표시 */}
          {loading && ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box> )}
          {error && ( <Alert severity="error" sx={{ my: 1 }}>{error}</Alert> )}
          
          {/* 최상위 3개 웹툰 캐러셀 표시 */}
          {!loading && !error && top3Data.topToons && top3Data.topToons.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Carousel 
                items={top3Data.topToons.map(article => (
                  <Box key={article.id} sx={{ width: '100%', height: '100%' }}>
                    <ArticleCard article={{
                      id: article.id,
                      title: article.title,
                      thumbnailUrl: article.thumbnailUrl,
                      createdAt: article.createdAt,
                      viewCount: article.viewCount || 0,
                    }} />
                  </Box>
                ))}
                autoSlide={true}
                autoSlideInterval={5000}
              />
            </Box>
          )}

          {/* 오늘의 뉴스 박스 */}
          {top3Data.todaysNews && top3Data.todaysNews.length > 0 && (
            <NewsBox
              title="오늘의 뉴스"
              date={top3Data.todaysNews[0]?.createdAt ? new Date(top3Data.todaysNews[0].createdAt).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) + " 기준" : ''}
              articles={top3Data.todaysNews.map(article => ({
                id: article.id,
                title: article.title,
                thumbnailUrl: article.thumbnailUrl,
                createdAt: article.createdAt,
                viewCount: article.viewCount || 0,
              }))}
              onMoreClick={() => handleMoreClick(`/today`)}
              maxItems={3}
            />
          )}

          {/* 최근 본 뉴스 박스 */}
          {recentData.recentWebtoons && recentData.recentWebtoons.length > 0 && (
            <NewsBox
              title="최근 본 뉴스"
              date={recentData.recentWebtoons[0]?.viewedAt ? new Date(recentData.recentWebtoons[0].viewedAt).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) + " 기준" : ''}
              articles={recentData.recentWebtoons.map(article => ({
                id: article.id,
                title: article.title,
                thumbnailUrl: article.thumbnailUrl,
                createdAt: article.createdAt,
                viewCount: article.viewCount || 0,
              }))}
              onMoreClick={() => handleMoreClick(`/recent`)}
              maxItems={3}
            />
          )}

          {/* 카테고리별 웹툰 박스 */}
          {Object.entries(webtoonsData).map(([category, articles]) => (
            <NewsBox
              key={category}
              title={category}
              date={articles[0]?.createdAt ? new Date(articles[0].createdAt).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) + " 기준" : ''}
              articles={articles.map(article => ({
                id: article.id,
                title: article.title,
                thumbnailUrl: article.thumbnailUrl,
                createdAt: article.createdAt,
                viewCount: article.viewCount || 0,
              }))}
              onMoreClick={() => handleMoreClick(`category/${category}`)}
              maxItems={3}
            />
          ))}

          {/* 페이지네이션 표시 */} 
          {!loading && !error && totalPages > 1 && (
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