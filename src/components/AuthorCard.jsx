import React, { useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, IconButton, Typography, Avatar, Collapse } from '@mui/material';

function AuthorCard({ author, viewCount }) {
  const [showOriginalArticle, setShowOriginalArticle] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URL이 복사되었습니다!');
  };

  const toggleOriginalArticle = () => {
    setShowOriginalArticle(!showOriginalArticle);
  };

  return (
    <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={author?.image} alt={author?.name} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {author?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {viewCount}명 읽는 중
            </Typography>
          </Box>
        </Box>
        
        {/* 액션 버튼들을 오른쪽으로 이동 */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            onClick={handleShare}
            size="small"
            sx={{ 
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small"
            sx={{ 
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small"
            sx={{ 
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* 원본 기사 보기 버튼 */}
      <Box 
        onClick={toggleOriginalArticle}
        sx={{ 
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          py: 1
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          원본 기사 보기
          {showOriginalArticle ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Typography>
      </Box>

      {/* 확장되는 원본 기사 섹션 */}
      <Collapse in={showOriginalArticle}>
        <Box sx={{ py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography 
            component="a" 
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              fontSize: '0.875rem'
            }}
          >
            • 펜데믹 이후 GPU 가격 폭등, AI 붐으로 수요 더욱 증가 - 테크뉴스
          </Typography>
          <Typography 
            component="a" 
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              fontSize: '0.875rem'
            }}
          >
            • GPU 수급난 해결될까? NVIDIA 신제품 출시 예정 - IT저널
          </Typography>
          <Typography 
            component="a" 
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              fontSize: '0.875rem'
            }}
          >
            • 반도체 업계, GPU 생산량 확대 계획 발표 - 경제일보
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}

export default AuthorCard; 