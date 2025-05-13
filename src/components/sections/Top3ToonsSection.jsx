import React from 'react';
import { Box } from '@mui/material';
import Carousel from '../Carousel/Carousel';
import ArticleCard from '../article/ArticleCard';

/**
 * 최상위 3개 웹툰 캐러셀 섹션 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.topToons - 상위 웹툰 데이터 배열
 */
const Top3ToonsSection = ({ topToons }) => {
  if (!topToons || topToons.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Carousel 
        items={topToons.map(article => (
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
  );
};

export default Top3ToonsSection; 