import React from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import ArticleCard from '../article/ArticleCard';

const Container = styled(Box)`
  padding: 0px;
  margin-top: 16px;
  margin-bottom: 16px;
  background-color: white;
  max-width: 1200px;
  min-width: 350px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

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
  margin-bottom: 8px;
  padding: 0 0px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const Date = styled.span`
  color: #666;
  font-size: 14px;
  margin-top: 4px;
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

const NewsBox = ({ title, date, articles, onMoreClick, maxItems = 3 }) => {
  // 3칸을 맞추기 위한 빈 배열
  const emptySlots = Array(Math.max(0, 3 - articles.slice(0, maxItems).length)).fill(null);

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <Title>{categoryNameMap[title] || title}</Title>
          <Date>{date}</Date>
        </TitleWrapper>
        <MoreButton onClick={onMoreClick}>더보기</MoreButton>
      </Header>
      <ArticlesContainer>
        {articles.slice(0, maxItems).map((article) => (
          <div className="article-card" key={article.id}>
            <ArticleCard article={article} />
          </div>
        ))}
        {emptySlots.map((_, idx) => (
          <div className="article-card" key={`empty-${idx}`} />
        ))}
      </ArticlesContainer>
    </Container>
  );
};

export default NewsBox; 