import React from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import ArticleCard from '../article/ArticleCard';

const Container = styled(Box)`
  padding: 20px;
  margin-top: 16px;
  margin-bottom: 24px;
  background-color: #fcfcfc;
  max-width: 1200px;
  min-width: 350px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 350px) {
    min-width: 350px;
    margin: 0;
    padding: 8px 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 12px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  color: #333;
  line-height: 1.2;
`;

const Date = styled.span`
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  line-height: 1.2;
  padding-bottom: 2px;
`;

const MoreButton = styled.button`
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  padding: 0;

  &:hover {
    text-decoration: underline;
    color: #666;
  }
`;

const ArticlesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const categoryNameMap = {
  POLITICS: '정치',
  FINANCE: '경제',
  IT: 'IT',
  // ... 필요에 따라 추가
};

const ArticleCardWrapper = styled.div`
  transition: transform 0.2s ease;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const NewsBox = ({ title, date, articles, onMoreClick, maxItems = 3 }) => {
  // 3칸을 맞추기 위한 빈 배열
  const emptySlots = Array(Math.max(0, 3 - articles.slice(0, maxItems).length)).fill(null);
  const displayTitle = categoryNameMap[title] || title;

  return (
    <Container title={displayTitle}>
      <Header>
        <TitleSection>
          <Title>{displayTitle}</Title>
          {date && <Date>{date}</Date>}
        </TitleSection>
        <MoreButton onClick={onMoreClick}>더보기</MoreButton>
      </Header>
      <ArticlesContainer>
        {articles.slice(0, maxItems).map((article) => (
          <ArticleCardWrapper className="article-card" key={article.id}>
            <ArticleCard article={article} />
          </ArticleCardWrapper>
        ))}
        {emptySlots.map((_, idx) => (
          <div className="article-card" key={`empty-${idx}`} />
        ))}
      </ArticlesContainer>
    </Container>
  );
};

export default NewsBox; 