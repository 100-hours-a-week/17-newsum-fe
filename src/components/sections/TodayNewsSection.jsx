import React from 'react';
import NewsBox from '../grid/MainGrid';
import { formatDateWithReference } from '../../utils/dateFormat';

/**
 * 오늘의 뉴스 섹션 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.todaysNews - 오늘의 뉴스 데이터 배열
 * @param {Function} props.onMoreClick - 더보기 버튼 클릭 핸들러
 */
const TodayNewsSection = ({ todaysNews, onMoreClick }) => {
  if (!todaysNews || todaysNews.length === 0) {
    return null;
  }

  return (
    <NewsBox
      title="오늘의 뉴스"
      date={todaysNews[0]?.createdAt ? formatDateWithReference(todaysNews[0].createdAt) : ''}
      articles={todaysNews.map(article => ({
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

export default TodayNewsSection; 