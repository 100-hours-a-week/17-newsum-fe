// src/pages/ArticlePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticleById } from '../services/articleApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArticleCard from '../components/article/ArticleCard';
import NewsBox from '../components/grid/MainGrid';
import AuthorCard from '../components/author/AuthorCard';

function ArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticleById(articleId);
        if (data) {
          setArticle(data);
          // 임시로 관련 기사도 같은 데이터 사용
          setRelatedArticles([data, data, data]);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [articleId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCommentClick = () => {
    navigate(`/comment/${articleId}`);
  };

  if (loading) return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  if (!article) return <Alert severity="warning" sx={{ m: 2 }}>Article not found</Alert>;

  return (
    <Box sx={{ pb: 7 }}>
      {/* 헤더 */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        bgcolor: 'white', 
        zIndex: 1,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        <IconButton onClick={handleBack} edge="start">
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          variant="subtitle1" 
          component="h1" 
          sx={{ 
            ml: 1,
            flexGrow: 1,
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {article.title}
        </Typography>
      </Box>

      {/* 메인 기사 카드 */}
      <Box sx={{ p: 2 }}>
        <ArticleCard article={article} />
      </Box>

      {/* 작가 프로필 */}
      <AuthorCard 
        author={{
          name: article.author || "작성자",
          image: article.authorImage || "/placeholder-author.jpg"
        }}
        viewCount={23}
      />

      {/* 댓글 섹션 */}
      <Box 
        onClick={handleCommentClick}
        sx={{ 
          px: 2, 
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer'
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          댓글 305개
        </Typography>
      </Box>

      {/* 관련 뉴스 */}
      <Box sx={{ p: 2 }}>
        <NewsBox
          title="관련 뉴스"
          articles={relatedArticles}
          onMoreClick={() => {}}
        />
      </Box>
    </Box>
  );
}

export default ArticlePage;