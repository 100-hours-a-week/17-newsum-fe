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
const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryGrid = ({ title, time, articles }) => {
  return (
    <Container>
      <ArticlesGrid>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ArticlesGrid>
    </Container>
  );
};

export default CategoryGrid; 