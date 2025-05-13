import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryTabs, { categories } from '../components/tabs/CategoryTabs';
import CategoryGrid from '../components/grid/CategoryGrid';
import DefaultAxios from '../api/DefaultAxios';

function CategoryPage() {
  const navigate = useNavigate();
  const { category_id } = useParams();

  const [activeTab, setActiveTab] = useState(() => category_id || 'all');
  const [articles, setArticles] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 카테고리별 기사 가져오는 API
  const getArticleByCategory = async (cursor = null) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        category: activeTab,
        size: 10
      };
      if (cursor) {
        params.cursor = cursor;
      }
      
      const res = await DefaultAxios.get('/api/v1/webtoons', { params });
      const newArticles = res.data?.data?.webtoons || [];
      const newPageInfo = res.data?.data?.pageInfo || null;

      if (cursor) {
        // 추가 로딩인 경우 기존 데이터에 추가
        setArticles(prev => [...prev, ...newArticles]);
      } else {
        // 초기 로딩인 경우 데이터 교체
        setArticles(newArticles);
      }
      setPageInfo(newPageInfo);
    } catch (err) {
      setError('기사를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (loading || !pageInfo?.hasNext) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;

    // 스크롤이 하단에서 100px 이내로 왔을 때 추가 로딩
    if (scrollHeight - scrollTop - clientHeight < 100) {
      getArticleByCategory(pageInfo.nextCursor);
    }
  }, [loading, pageInfo]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // tab 클릭할 때 이동시키는 함수
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`/category/${newValue}`);
  };

  // 카테고리 이름 가져오는 함수
  const getCategoryName = () => {
    const category = categories.find(cat => cat.value === activeTab);
    return category ? category.label : activeTab;
  };

  // 시간 포맷팅 하는 함수
  const getTimeString = () => {
    if (!pageInfo || !pageInfo.nextCursor) return '';
    const [dateStr] = pageInfo.nextCursor.split('_');
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) + ' 기준';
  };

  // 탭 클릭시 카테고리 ID 설정
  useEffect(() => {
    if (category_id) {
      setActiveTab(category_id);
    }
  }, [category_id]);

  // 탭 변경시 초기 데이터 로딩
  useEffect(() => {
    getArticleByCategory();
  }, [activeTab]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 1 }}>
        <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <CategoryGrid
        title={getCategoryName()}
        time={getTimeString()}
        articles={articles}
      />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && (
        <Box sx={{ textAlign: 'center', color: 'error.main', py: 2 }}>
          {error}
        </Box>
      )}
    </Box>
    </Container>
  );
}

export default CategoryPage; 