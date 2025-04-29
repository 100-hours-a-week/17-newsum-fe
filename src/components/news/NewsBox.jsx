import React from 'react';
import styled from '@emotion/styled';
import { Box, Grid } from '@mui/material';
import ArticleCard from '../article/ArticleCard';

const Container = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: white;
  max-width: 1200px;
  min-width: 350px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  @media (max-width: 350px) {
    min-width: 350px;
    margin-left: -16px;
    margin-right: -16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  display: flex;
  gap: 8px;
  
  .article-card {
    flex: 1;
    min-width: 0;
    height: 100px;
  }

  @media (min-width: 400px) {
    .article-card {
      height: 110px;
    }
  }

  @media (min-width: 600px) {
    .article-card {
      height: 140px;
    }
  }

  @media (min-width: 960px) {
    .article-card {
      height: 160px;
    }
  }
`;

const NewsBox = ({ title, date, articles, onMoreClick }) => {
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <Title>{title}</Title>
          <Date>{date}</Date>
        </TitleWrapper>
        <MoreButton onClick={onMoreClick}>더보기</MoreButton>
      </Header>
      <ArticlesContainer>
        {articles.slice(0, 3).map((article) => (
          <div className="article-card" key={article.id}>
            <ArticleCard article={article} />
          </div>
        ))}
      </ArticlesContainer>
    </Container>
  );
};

export default NewsBox; 