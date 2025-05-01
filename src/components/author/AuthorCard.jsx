import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import styled from '@emotion/styled';

const AuthorContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  background: white;
`;

const AuthorInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
`;

const TextContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled(Typography)`
  font-weight: 600;
  font-size: 0.95rem;
  color: #000;
`;

const ViewCount = styled(Typography)`
  font-size: 0.8rem;
  color: #666;
`;

const AuthorCard = ({ author, viewCount }) => {
  const formatViewCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}만명 보는 중`;
    }
    return `${count}명 보는 중`;
  };

  return (
    <AuthorContainer>
      <AuthorInfo>
        <AuthorAvatar
          alt={author.name}
          src={author.imageUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${author.name}`}
        />
        <TextContainer>
          <AuthorName>{author.name}</AuthorName>
          <ViewCount>{formatViewCount(viewCount)}</ViewCount>
        </TextContainer>
      </AuthorInfo>
    </AuthorContainer>
  );
};

export default AuthorCard; 