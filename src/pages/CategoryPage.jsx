import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
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

  // 카테고리별 기사 가져오는 API ()
  const getArticleByCategory = async () => {
    try {
      // 추후 ?category={category_id} 형식으로 변경
      const res = await DefaultAxios.get('/api/v1/webtoons');
      setArticles(res.data?.data?.webtoons || []);
      setPageInfo(res.data?.data?.pageInfo || null);
    } catch {
      setArticles([]);
      setPageInfo(null);
    }
  };

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

  // 탭 클릭할 때 기사 가져오는 함수 실행
  useEffect(() => {
    getArticleByCategory();
  }, [activeTab]);

  return (
    <Box sx={{ p: 2 }}>
      <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <CategoryGrid
        title={getCategoryName()}
        time={getTimeString()}
        articles={articles}
      />
    </Box>
  );
}

export default CategoryPage; 