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

const ITEMS_PER_PAGE = 6;
function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const loadArticles = useCallback(async (category, currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchArticles(currentPage, ITEMS_PER_PAGE, category);
      setArticles(response.articles);
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
    // 추후 더보기 기능 구현
  };

  // ❗️❗️ axios 사용한 요청 예시
  const getWebtoons = async () => {
    try{
      // const res = await DefaultAxios.get('/api/v1/webtoons');
      const res = await DefaultAxios.get('/api/v1/webtoons/data.json');
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getWebtoons();
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ my: 1 }}>
          {/* 카테고리 탭 */}
          <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {loading && ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box> )}
          {error && ( <Alert severity="error" sx={{ my: 1 }}>{error}</Alert> )}
          {!loading && !error && articles.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Carousel 
                items={articles.map(article => (
                  <Box key={article.id} sx={{ width: '100%', height: '100%' }}>
                    <ArticleCard article={article} />
                  </Box>
                ))}
              />
            </Box>
          )}

          {/* 오늘의 뉴스 박스 */}
          <NewsBox
            title="오늘의 뉴스"
            date="25.04.07 23:00 기준"
            articles={articles}
            onMoreClick={() => handleMoreClick('today')}
            maxItems={3}
          />

          {/* 최근 본 뉴스 박스 */}
          <NewsBox
            title="최근 본 뉴스"
            date="25.04.07 23:00 기준"
            articles={articles}
            onMoreClick={() => handleMoreClick('recent')}
            maxItems={3}
          />

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