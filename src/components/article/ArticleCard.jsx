// src/components/article/ArticleCard.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardActionArea, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled';
import ColorThief from 'colorthief';
import { useTitleStore } from '../../store/titleStore';
import { formatNumber } from '../../utils/numberFormat';
import { CardTitle, ViewCount } from '../../components/common/StyledTypography';

const StyledCard = styled(Card)`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
  overflow: hidden;
  min-width: 60px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
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
  padding: 12px;
  background: ${props => props.gradient || 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%)'};
  transition: background 0.3s ease;
`;

const StyledCardActionArea = styled(CardActionArea)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const WhiteCardTitle = styled(CardTitle)`
  color: white;
  -webkit-line-clamp: 1;
`;

// 컬러 추출 결과를 캐시하기 위한 Map
const colorCache = new Map();

/**
 * 웹툰 카드 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.article - 웹툰 카드 데이터
 * @param {number} props.article.id - 웹툰 ID
 * @param {string} props.article.title - 웹툰 제목
 * @param {string} props.article.thumbnailUrl - 썸네일 URL
 * @param {string} props.article.createdAt - 생성 날짜 (ISO 형식)
 * @param {number} props.article.viewCount - 조회수
 */
const ArticleCard = ({ article }) => {
  // WebtoonCardDto와 필드명 맞추기 (id, title, thumbnailUrl, createdAt, viewCount)
  const { id, title, thumbnailUrl, createdAt, viewCount } = article;
  const imageRef = useRef(null);
  const [gradient, setGradient] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const setTitle = useTitleStore((state) => state.setTitle);
  const setThumbnailUrl = useTitleStore((state) => state.setThumbnailUrl);

  // 이미지 URL에서 캐시된 컬러 가져오기
  const cachedColor = useMemo(() => colorCache.get(thumbnailUrl), [thumbnailUrl]);

  useEffect(() => {
    if (cachedColor) {
      setGradient(cachedColor);
      return;
    }

    const loadGradient = async () => {
      if (imageRef.current && imageRef.current.complete) {
        try {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(imageRef.current);
          const newGradient = `linear-gradient(to bottom, transparent 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.7) 40%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9) 100%)`;
          
          // 결과를 캐시에 저장
          colorCache.set(thumbnailUrl, newGradient);
          setGradient(newGradient);
        } catch (error) {
          console.error('Error getting color:', error);
        }
      }
    };

    if (imageRef.current && isImageLoaded) {
      loadGradient();
    }
  }, [thumbnailUrl, isImageLoaded, cachedColor]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const defaultThumbnail = 'https://sinsa-image.s3.ap-northeast-2.amazonaws.com/not_image.png';

  return (
    <StyledCard elevation={0}>
      <StyledCardActionArea
        component={RouterLink}
        to={`/article/${id}`}
        onClick={() => {
          setTitle(title);
          setThumbnailUrl(thumbnailUrl || defaultThumbnail);
        }}
      >
        <CardImage
          ref={imageRef}
          src={thumbnailUrl || defaultThumbnail}
          alt={title}
          crossOrigin="anonymous"
          loading="lazy"
          onLoad={handleImageLoad}
        />
        <GradientOverlay gradient={gradient}>
          <WhiteCardTitle variant="h6" component="h2">
            {title}
          </WhiteCardTitle>
          <ViewCount 
            count={formatNumber(viewCount || 0)} 
            color="rgba(255, 255, 255, 0.8)"
            fontSize="0.7rem"
          />
        </GradientOverlay>
      </StyledCardActionArea>
    </StyledCard>
  );
};

export default React.memo(ArticleCard);