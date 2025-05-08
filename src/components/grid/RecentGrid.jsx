import React from 'react';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
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
  padding: 0 16px;

  @media (max-width: 350px) {
    min-width: 350px;
    margin: 0;
  }
`;

const DateTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 12px 0;
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const RecentGrid = ({ webtoonsByDate }) => {
  if (!webtoonsByDate || Object.keys(webtoonsByDate).length === 0) {
    return <Typography color="text.secondary" sx={{ p: 2 }}>최근 본 웹툰이 없습니다.</Typography>;
  }

  return (
    <Container>
      {Object.entries(webtoonsByDate).map(([date, webtoons]) => (
        <Box key={date} sx={{ mb: 4 }}>
          <DateTitle>{date.replace(/-/g, '.').slice(2)}</DateTitle>
          <ArticlesGrid>
            {webtoons.map((webtoon) => (
              <ArticleCard key={webtoon.id} article={webtoon} />
            ))}
          </ArticlesGrid>
        </Box>
      ))}
    </Container>
  );
};

export default RecentGrid;