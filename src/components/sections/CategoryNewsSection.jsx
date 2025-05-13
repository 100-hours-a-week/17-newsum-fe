import React from 'react';
import NewsBox from '../grid/MainGrid';

/**
 * 카테고리별 뉴스 섹션 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.webtoonsData - 카테고리별 웹툰 데이터 객체
 * @param {Function} props.onMoreClick - 더보기 버튼 클릭 핸들러 (카테고리명을 인자로 받음)
 */
const CategoryNewsSection = ({ webtoonsData, onMoreClick }) => {
  if (!webtoonsData || Object.keys(webtoonsData).length === 0) {
    return null;
  }

  return (
    <>
      {Object.entries(webtoonsData).map(([category, articles]) => 
        // 비어있는 카테고리는 표시하지 않음
        articles && articles.length > 0 ? (
          <NewsBox
            key={category}
            title={category}
            articles={articles.map(article => ({
              id: article.id,
              title: article.title,
              thumbnailUrl: article.thumbnailUrl,
              createdAt: article.createdAt,
              viewCount: article.viewCount || 0,
            }))}
            onMoreClick={() => onMoreClick(`category/${category}`)}
            maxItems={3}
          />
        ) : null
      )}
    </>
  );
};

export default CategoryNewsSection; 