// src/pages/ArticlePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel/Carousel';
import DefaultAxios from '../api/DefaultAxios';
import CategoryGrid from '../components/grid/CategoryGrid';
import { HeaderText } from '../components/common/StyledTypography';
import ArticleInfo from '../components/article/ArticleInfo';
import CommentButton from '../components/article/CommentButton';

function ArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [sourceNews, setSourceNews] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [relatedNews, setRelatedNews] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [activeViewers, setActiveViewers] = useState(0);
  const [createdAt, setCreatedAt] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res1 = await DefaultAxios.get(`/api/v1/webtoons/${articleId}`);
        const data1 = res1.data?.data;
        console.log(`/api/v1/webtoons/${articleId}`)
        console.log(data1)
        setSlides(data1?.slides || []);
        setAuthor(data1?.author || null);
        setIsLiked(!!data1?.isLiked);
        setIsBookmarked(!!data1?.isBookmarked);
        setLikeCount(data1?.likeCount || 0);
        setTitle(data1?.slides?.[0]?.content || '');
        setViewCount(data1?.viewCount || 0);
        setCreatedAt(data1?.createdAt || '');
        // 실시간 시청자 수를 임의의 값으로 설정 (API에서 받아오는 경우 수정 필요)
        setActiveViewers(Math.floor(Math.random() * 30) + 10); // 임시: 10-40명 사이의 랜덤 값

        const res2 = await DefaultAxios.get(`/api/v1/webtoons/${articleId}/details`);
        const data2 = res2.data?.data;
        console.log(`/api/v1/webtoons/${articleId}/details :`)
        console.log(data2)
        setSourceNews(data2?.sourceNews || []);
        setCommentCount(data2?.commentCount || 0);
        setRelatedNews((data2?.relatedNews || []).slice(0, 3));
      } catch (err) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [articleId]);

  const handleBack = () => navigate(-1);
  
  const handleLike = async () => {
    try {
      // API 호출 추가 가능
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };
  
  const handleBookmark = async () => {
    try {
      // API 호출 추가 가능
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error("북마크 처리 중 오류 발생:", error);
    }
  };

  if (loading) return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box sx={{ pb: 7 }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleBack} edge="start"><ArrowBackIcon /></IconButton>
        <HeaderText variant="subtitle1" component="h1" sx={{ ml: 1, flexGrow: 1 }}>{title}</HeaderText>
      </Box>

      <Box sx={{ p: 2, pt: 3 }}>
        <Carousel
          items={slides.map((slide) => (
            <Box key={slide.slideSeq} sx={{ width: '100%', aspectRatio: '1/1', position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
              <img src={slide.imageUrl} alt={slide.content} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', p: 1, fontSize: 14 }}>{slide.content}</Box>
            </Box>
          ))}
        />
      </Box>

      {/* ArticleInfo 컴포넌트 사용 */}
      <Box sx={{ px: 2 }}>
        <ArticleInfo 
          author={author}
          viewCount={viewCount}
          activeViewers={activeViewers}
          createdAt={createdAt}
          likeCount={likeCount}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
          sourceNews={sourceNews}
          onLikeClick={handleLike}
          onBookmarkClick={handleBookmark}
        />
        
        {/* 댓글 버튼 컴포넌트 */}
        <CommentButton 
          articleId={articleId}
          commentCount={commentCount}
        />
      </Box>

      <Box sx={{ p: 2 }}>
        <CategoryGrid
          title="관련 뉴스"
          articles={relatedNews.map(news => ({
            id: news.id,
            title: news.title,
            thumbnailUrl: news.thumbnailUrl,
            createdAt: news.createdAt,
            viewCount: news.viewCount || 0,
          }))}
        />
      </Box>
    </Box>
  );
}

export default ArticlePage;
