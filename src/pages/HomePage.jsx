// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Grid, CircularProgress, Alert, Tabs, Tab, Pagination } from '@mui/material';
import { fetchArticles } from '../services/articleApi';
import ArticleCard from '../components/article/ArticleCard';
import NewsBox from '../components/news/NewsBox';
import styled from '@emotion/styled';

const categories = [
  { value: 'all', label: '전체' }, { value: '정치', label: '정치' }, { value: '경제', label: '경제' },
  { value: '사회', label: '사회' }, { value: 'IT/과학', label: 'IT/과학' }, { value: '라이프', label: '라이프' },
];
const ITEMS_PER_PAGE = 6;

const StyledTab = styled(Tab)`
  color: #666;
  border-radius: 8px;
  padding: 6px 12px;
  min-width: 60px;
  text-transform: none;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.Mui-selected {
    color: white;
    background-color: black;
  }
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    display: none;
  }
`;

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(categories[0].value);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>

        {/* 카테고리 탭 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <StyledTabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
            {categories.map((cat) => (
              <StyledTab key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </StyledTabs>
        </Box>

        {loading && ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box> )}
        {error && ( <Alert severity="error" sx={{ my: 2 }}>{error}</Alert> )}
        {!loading && !error && articles.length > 0 && (
          <Grid item xs={12} sm={6} md={4} key={articles[0].id}>
            <ArticleCard article={articles[0]} />
          </Grid>
        )}
        {/* {!loading && !error && (
          <Grid container spacing={3}>
            {articles.length > 0 ? (
              articles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <ArticleCard article={article} />
                </Grid>
              )
            )
            ) : (
              <Grid item xs={12}>
                <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                  '{categories.find(c => c.value === activeTab)?.label}' 카테고리에 표시할 뉴스가 없습니다.
                </Typography>
              </Grid>
            )}
          </Grid>
        )} */}

        {/* 오늘의 뉴스 박스 */}
        <NewsBox
          title="오늘의 뉴스"
          date="25.04.07 23:00 기준"
          articles={articles}
          onMoreClick={() => handleMoreClick('today')}
        />

        {/* 최근 본 뉴스 박스 */}
        <NewsBox
          title="최근 본 뉴스"
          date="25.04.07 23:00 기준"
          articles={articles}
          onMoreClick={() => handleMoreClick('recent')}
        />

        {!loading && !error && totalPages > 1 && (
           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
             <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" showFirstButton showLastButton />
           </Box>
         )}
      </Box>
    </Container>
  );
}

export default HomePage;