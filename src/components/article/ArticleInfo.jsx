import React, { useState } from 'react';
import { Box, IconButton, Avatar, Collapse, Typography, Paper, Button, Link } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatNumber } from '../../utils/numberFormat';
import { HeaderText, ViewCount } from '../common/StyledTypography';
import styled from '@emotion/styled';

const DateText = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.75rem;
`;

const CalendarIcon = styled(CalendarTodayIcon)`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const ViewersText = styled(Typography)`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.85rem;
  margin-top: 4px;
`;

const InfoContainer = styled(Paper)`
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StyledIconButton = styled(IconButton)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const ArticleLink = styled(Link)`
  display: block;
  padding: 4px 0;
  margin-bottom: 4px;
  text-decoration: underline;
  color: ${props => props.theme?.palette?.primary?.main || '#1976d2'};
  font-size: 0.875rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CountText = styled(Typography)`
  font-size: 0.75rem;
  color: ${props => props.theme?.palette?.text?.secondary || 'rgba(0, 0, 0, 0.6)'};
  text-align: center;
  margin-top: -6px;
`;

const MoreSection = styled(Box)`
  background-color: ${props => props.isOpen ? '#f9f9f9' : 'transparent'};
  border-radius: 8px;
  margin-top: 12px;
  transition: background-color 0.2s ease;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const DetailItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MoreContent = styled(Box)`
  padding: 8px 8px 4px;
`;

/**
 * 게시물 정보 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.author - 작가 정보
 * @param {string} props.author.name - 작가 이름
 * @param {string} props.author.profileImageUrl - 작가 프로필 이미지 URL
 * @param {number} props.viewCount - 조회수
 * @param {number} props.activeViewers - 실시간 시청자 수
 * @param {string} props.createdAt - 생성일(ISO 포맷)
 * @param {number} props.likeCount - 좋아요 수
 * @param {boolean} props.isLiked - 좋아요 상태
 * @param {boolean} props.isBookmarked - 북마크 상태
 * @param {Array} props.sourceNews - 원본 기사 목록
 * @param {Function} props.onLikeClick - 좋아요 클릭 핸들러
 * @param {Function} props.onBookmarkClick - 북마크 클릭 핸들러
 */
const ArticleInfo = ({ 
  author, 
  viewCount, 
  activeViewers = 0,
  createdAt, 
  likeCount, 
  isLiked, 
  isBookmarked, 
  sourceNews = [],
  onLikeClick,
  onBookmarkClick
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URL이 복사되었습니다!');
  };
  
  // 날짜 포맷팅 (YYYY년 MM월 DD일)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <InfoContainer elevation={0}>
      {/* 작가 정보 및 상단 부분 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {/* 작가 프로필 및 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src={author?.profileImageUrl} 
            alt={author?.name} 
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <HeaderText variant="subtitle1">{author?.name}</HeaderText>
            <ViewersText>{activeViewers}명 보는 중</ViewersText>
          </Box>
        </Box>
        
        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledIconButton 
              onClick={handleShare}
              sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}
            >
              <ShareIcon fontSize="small" />
            </StyledIconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledIconButton 
              onClick={onLikeClick}
              color={isLiked ? 'error' : 'default'}
              sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}
            >
              {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </StyledIconButton>
            <CountText>{formatNumber(likeCount)}</CountText>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledIconButton 
              onClick={onBookmarkClick}
              sx={{ 
                bgcolor: 'action.hover', 
                '&:hover': { bgcolor: 'action.selected' },
                color: isBookmarked ? 'black' : 'default'
              }}
            >
              {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </StyledIconButton>
          </Box>
        </Box>
      </Box>
      
      {/* 더보기 섹션 */}
      <MoreSection isOpen={showDetails}>
        {/* 더보기 버튼과 정보 */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            px: 1,
          }}
        >
          {/* 조회수와 날짜 정보 (더보기 눌렀을 때만 표시) */}
          {showDetails && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DetailItem>
                <VisibilityIcon sx={{ fontSize: '0.9rem', opacity: 0.7 }} />
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(viewCount)}
                </Typography>
              </DetailItem>
              <DetailItem>
                <CalendarIcon />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(createdAt)}
                </Typography>
              </DetailItem>
            </Box>
          )}
          
          {/* 더보기 버튼 */}
          <Box 
            onClick={toggleDetails}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              ml: 'auto'
            }}
          >
            <HeaderText 
              variant="body2" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                color: 'text.primary',
              }}
            >
              더보기
              {showDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </HeaderText>
          </Box>
        </Box>
        
        {/* 원본 기사 목록 (더보기 눌렀을 때만 표시) */}
        <Collapse in={showDetails}>
          <MoreContent>
            {sourceNews.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  원본 기사
                </Typography>
                {sourceNews.map((news, idx) => (
                  <ArticleLink
                    key={idx}
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="always"
                  >
                    {news.title}
                  </ArticleLink>
                ))}
              </Box>
            )}
          </MoreContent>
        </Collapse>
      </MoreSection>
    </InfoContainer>
  );
};

export default ArticleInfo; 