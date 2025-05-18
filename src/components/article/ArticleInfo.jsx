import React, { useState } from 'react';
import { Box, IconButton, Avatar, Collapse, Typography, Paper, Link } from '@mui/material';
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
import { formatDate } from '../../utils/dateFormat';
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
  border-radius: 0;
  background-color: transparent;
  box-shadow: none;
`;

const StyledIconButton = styled(IconButton)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: transparent;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const ArticleLink = styled(Link)`
  display: block;
  padding: 2px 0;
  margin-bottom: 1px;
  text-decoration: underline;
  color: ${props => props.theme?.palette?.primary?.main || '#1976d2'};
  font-size: 0.875rem;
  line-height: 1.4;
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
  const toggleDetails = () => setShowDetails(prev => !prev);
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URL이 복사되었습니다!');
  };

  return (
    <InfoContainer elevation={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledIconButton onClick={handleShare}>
              <ShareIcon fontSize="small" />
            </StyledIconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledIconButton onClick={onLikeClick}>
              {isLiked ? (
                <FavoriteIcon fontSize="small" sx={{ color: '#f44336' }} />
              ) : (
                <FavoriteBorderIcon fontSize="small" sx={{ color: '#aaa' }} />
              )}
            </StyledIconButton>
            <CountText>{formatNumber(likeCount)}</CountText>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledIconButton onClick={onBookmarkClick}>
              {isBookmarked ? (
                <BookmarkIcon fontSize="small" sx={{ color: '#000' }} />
              ) : (
                <BookmarkBorderIcon fontSize="small" sx={{ color: '#aaa' }} />
              )}
            </StyledIconButton>
          </Box>
        </Box>
      </Box>

      <MoreSection isOpen={showDetails}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, px: 1 }}>
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

          <Box onClick={toggleDetails} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 'auto' }}>
            <HeaderText variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
              더보기
              {showDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </HeaderText>
          </Box>
        </Box>

        <Collapse in={showDetails}>
          <MoreContent>
            {sourceNews.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                  원본 기사
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
              </Box>
            )}
          </MoreContent>
        </Collapse>
      </MoreSection>
    </InfoContainer>
  );
};

export default ArticleInfo;