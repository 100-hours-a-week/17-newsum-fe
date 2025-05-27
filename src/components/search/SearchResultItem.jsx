import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const ItemContainer = styled(Box)`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const ContentBox = styled(Box)`
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
`;

const Title = styled(Typography)`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Description = styled(Typography)`
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MetaInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const AuthorName = styled(Typography)`
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
`;

const Date = styled(Typography)`
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.4);
`;

function SearchResultItem({ webtoon }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${webtoon.id}`);
  };

  return (
    <ItemContainer onClick={handleClick}>
      <Avatar
        src={webtoon.thumbnailUrl}
        alt={webtoon.title}
        variant="rounded"
        sx={{ width: 80, height: 80 }}
      />
      <ContentBox>
        <Title>{webtoon.title}</Title>
        <Description>{webtoon.description}</Description>
        <MetaInfo>
          <AuthorName>{webtoon.author}</AuthorName>
          <Date>{new Date(webtoon.createdAt).toLocaleDateString()}</Date>
        </MetaInfo>
      </ContentBox>
    </ItemContainer>
  );
}

export default SearchResultItem; 