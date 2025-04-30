// src/components/article/ArticleCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardActionArea, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled';
import ColorThief from 'colorthief';

const StyledCard = styled(Card)`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  min-width: 60px;
  aspect-ratio: 1/1;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: ${props => props.gradient || 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.9) 100%)'};
  transition: background 0.3s ease;
`;

const StyledCardActionArea = styled(CardActionArea)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Title = styled(Typography)`
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 1.2;
  margin-bottom: 4px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-break: keep-all;
`;

const ViewCount = styled(Typography)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.7rem;
`;

const ArticleCard = ({ article }) => {
  const { id, title, thumbnailUrl, viewCount } = article;
  const imageRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    const loadGradient = async () => {
      if (imageRef.current && imageRef.current.complete) {
        try {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(imageRef.current);
          setGradient(
            `linear-gradient(to bottom, transparent 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.7) 40%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9) 100%)`
          );
        } catch (error) {
          console.error('Error getting color:', error);
        }
      }
    };

    if (imageRef.current) {
      if (imageRef.current.complete) {
        loadGradient();
      } else {
        imageRef.current.addEventListener('load', loadGradient);
      }
    }

    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener('load', loadGradient);
      }
    };
  }, [thumbnailUrl]);

  const formatViewCount = (count) => {
    return `${(count / 10000).toFixed(1)}만`;
  };

  return (
    <StyledCard elevation={0}>
      <StyledCardActionArea component={RouterLink} to={`/article/${id}`}>
        <CardImage
          ref={imageRef}
          src={thumbnailUrl || 'https://sinsa-image.s3.ap-northeast-2.amazonaws.com/not_image.png'}
          alt={title}
          crossOrigin="anonymous"
        />
        <GradientOverlay gradient={gradient}>
          <Title variant="h6" component="h2">
            {title}
          </Title>
          <ViewCount>
            {formatViewCount(viewCount || 0)}
          </ViewCount>
        </GradientOverlay>
      </StyledCardActionArea>
    </StyledCard>
  );
};

export default ArticleCard;