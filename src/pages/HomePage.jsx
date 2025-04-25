// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Grid, CircularProgress, Alert, Tabs, Tab, Pagination } from '@mui/material';
import { fetchArticles } from '../services/articleApi';
import ArticleCard from '../components/article/ArticleCard'; // 경로 확인!

const categories = [
  { value: 'all', label: '전체' }, { value: '정치', label: '정치' }, { value: '경제', label: '경제' },
  { value: '사회', label: '사회' }, { value: 'IT/과학', label: 'IT/과학' }, { value: '라이프', label: '라이프' },
];
const ITEMS_PER_PAGE = 6;

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
    // window.scrollTo(0, 0);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
            {categories.map((cat) => (<Tab key={cat.value} label={cat.label} value={cat.value} />))}
          </Tabs>
        </Box>

        {loading && ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box> )}
        {error && ( <Alert severity="error" sx={{ my: 2 }}>{error}</Alert> )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {articles.length > 0 ? (
              articles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <ArticleCard article={article} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                  '{categories.find(c => c.value === activeTab)?.label}' 카테고리에 표시할 뉴스가 없습니다.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

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