// src/components/article/ArticleCard.jsx
import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// JavaScript에서는 props 타입 검사를 위해 PropTypes를 사용하거나 생략할 수 있습니다.
// 여기서는 생략합니다.
function ArticleCard({ article }) {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea component={RouterLink} to={`/article/${article.id}`}>
        {article.thumbnailUrl && (
          <CardMedia
            component="img"
            sx={{ aspectRatio: '16/9' }}
            image={article.thumbnailUrl}
            alt={article.title}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            mb: 1,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3
          }}>
            {article.summary}
          </Typography>
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
}

export default ArticleCard;