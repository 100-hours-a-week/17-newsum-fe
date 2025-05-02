import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryTabs, { categories } from '../components/common/CategoryTabs';
import CategoryGrid from '../components/category/CategoryGrid';

// 임시 데이터
const mockArticles = [
  {
    id: 1,
    title: "AMD, 새로운 그래픽 카드 라인업 공개",
    content: "AMD가 새로운 GPU를 발표했습니다...",
    thumbnail: "/placeholder.jpg",
    source: "테크뉴스",
    publishedAt: "2024-03-20"
  },
  {
    id: 2,
    title: "GPU 수급난 해결될까",
    content: "반도체 업계의 새로운 전략...",
    thumbnail: "/placeholder.jpg",
    source: "IT저널",
    publishedAt: "2024-03-19"
  },
  {
    id: 3,
    title: "인공지능 시대의 GPU 수요",
    content: "AI 붐으로 인한 GPU 수요 증가...",
    thumbnail: "/placeholder.jpg",
    source: "경제일보",
    publishedAt: "2024-03-18"
  },
  {
    id: 4,
    title: "새로운 반도체 기술 발표",
    content: "차세대 반도체 기술 소개...",
    thumbnail: "/placeholder.jpg",
    source: "과학뉴스",
    publishedAt: "2024-03-17"
  }
];

function CategoryPage() {
  const navigate = useNavigate();
  const { category_id } = useParams();
  
  // URL의 category_id에 해당하는 탭을 찾아 초기값으로 설정
  const [activeTab, setActiveTab] = useState(() => {
    return category_id || 'all';
  });

  // URL이 변경될 때 activeTab 업데이트
  useEffect(() => {
    if (category_id) {
      setActiveTab(category_id);
    }
  }, [category_id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`/category/${newValue}`);
  };

  // 현재 시간을 포맷팅하는 함수
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes} 기준`;
  };

  // 카테고리 이름을 가져오는 함수
  const getCategoryName = () => {
    const category = categories.find(cat => cat.value === activeTab);
    return category ? category.label : '전체';
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* 카테고리 탭 */}
      <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 카테고리 그리드 */}
      <CategoryGrid
        title={getCategoryName()}
        time={getCurrentTime()}
        articles={mockArticles}
      />
    </Box>
  );
}

export default CategoryPage; 