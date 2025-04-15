// src/components/news/ArticleCard.tsx
import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArticleSummary } from '../../types/article'; // 기사 타입 import

interface ArticleCardProps {
  article: ArticleSummary; // ArticleSummary 타입의 데이터를 prop으로 받음
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // 날짜 포맷팅 함수 (간단 예시, 필요시 date-fns 라이브러리 사용 추천)
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR'); // 한국 날짜 형식
    } catch (e) {
      return dateString; // 파싱 실패 시 원본 반환
    }
  };

  return (
    // Card 컴포넌트 사용, 전체 영역을 클릭 가능하게 CardActionArea 사용
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea component={RouterLink} to={`/article/${article.id}`}>
        {/* 썸네일 이미지가 있을 경우 CardMedia로 표시 */}
        {article.thumbnailUrl && (
          <CardMedia
            component="img"
            // height="140" // 고정 높이 또는 비율 지정 가능
            sx={{ aspectRatio: '16/9' }} // 16:9 비율 유지
            image={article.thumbnailUrl}
            alt={article.title}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}> {/* 내용이 카드 높이를 채우도록 */}
          {/* 기사 제목 */}
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {article.title}
          </Typography>
          {/* 기사 요약 */}
          <Typography variant="body2" color="text.secondary" sx={{
            mb: 1, // 아래쪽 마진
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3 // 최대 3줄까지 표시하고 ... 처리
          }}>
            {article.summary}
          </Typography>
          {/* 추가 정보 (출처, 발행일, 카테고리 등) */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
             <Typography variant="caption" color="text.secondary">
               {article.source}
             </Typography>
             <Typography variant="caption" color="text.secondary">
               {formatDate(article.publishedAt)}
             </Typography>
           </Box>
            {article.category && <Chip label={article.category} size="small" sx={{ mt: 1 }}/>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;