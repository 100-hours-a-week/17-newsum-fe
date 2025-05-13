import React from 'react';
import NewsBox from '../grid/MainGrid';

/**
 * 최근 본 뉴스 섹션 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.recentWebtoons - 최근 본 웹툰 데이터 배열
 * @param {Function} props.onMoreClick - 더보기 버튼 클릭 핸들러
 */
const RecentNewsSection = ({ recentWebtoons, onMoreClick }) => {
  if (!recentWebtoons || recentWebtoons.length === 0) {
    return null;
  }

  return (
    <NewsBox
      title="최근 본 뉴스"
      articles={recentWebtoons.map(article => ({
        id: article.id,
        title: article.title,
        thumbnailUrl: article.thumbnailUrl,
        createdAt: article.createdAt,
        viewCount: article.viewCount || 0,
      }))}
      onMoreClick={onMoreClick}
      maxItems={3}
    />
  );
};

export default RecentNewsSection; 