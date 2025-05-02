import React from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import ArticleCard from '../article/ArticleCard';

const Container = styled(Box)`
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
  }
`;

const HeaderWrapper = styled.div`
  padding: 0 16px;
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
`;

const Time = styled.span`
  color: #666;
  font-size: 14px;
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryGrid = ({ title, time, articles }) => {
  return (
    <Container>
      <HeaderWrapper>
        <Header>
          <Title>{title}</Title>
          <Time>{time}</Time>
        </Header>
      </HeaderWrapper>
      <ArticlesGrid>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ArticlesGrid>
    </Container>
  );
};

export default CategoryGrid; 