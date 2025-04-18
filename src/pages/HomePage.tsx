import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Grid, CircularProgress, Alert, Tabs, Tab, Pagination, Button } from '@mui/material';
import { ArticleSummary } from '../types/article';
import { fetchArticles } from '../services/articleApi';
import ArticleCard from '../components/article/ArticleCard';

const categories = [
  { value: 'all', label: '전체' },
  { value: '정치', label: '정치' },
  { value: '경제', label: '경제' },
  { value: '사회', label: '사회' },
  { value: 'IT/과학', label: 'IT/과학' },
  { value: '라이프', label: '라이프' },
];

const ITEMS_PER_PAGE = 6;

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(categories[0].value);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null); // API 테스트 결과 상태

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const loadArticles = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchArticles(1, ITEMS_PER_PAGE, category);
      setArticles(response.articles);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching articles.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles(activeTab);
  }, [activeTab, page, loadArticles]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // API 테스트 함수
  const handleApiTest = async () => {
    try {
      const response = await fetch('/test');
      const data = await response.text();
      setApiTestResult(`API Test Successful: ${data}`);
    } catch (err) {
      setApiTestResult('API Test Failed');
      console.error('API test error:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="News categories">
            {categories.map((cat) => (
              <Tab key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Tabs>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

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
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* API 테스트 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Button variant="contained" onClick={handleApiTest}>API Test</Button>
        </Box>

        {/* API 테스트 결과 */}
        {apiTestResult && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Typography variant="h6">{apiTestResult}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
