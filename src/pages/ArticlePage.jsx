// src/pages/ArticlePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert, Avatar, Collapse } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel/Carousel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DefaultAxios from '../api/DefaultAxios';
import CategoryGrid from '../components/grid/CategoryGrid';
import { useTitleStore } from '../store/titleStore';

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
  const title = useTitleStore((state) => state.title);
  const thumbnailUrl = useTitleStore((state) => state.thumbnailUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [viewCount, setViewCount] = useState(0);

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
        setViewCount(data1?.viewCount || 0);

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
  const handleCommentClick = () => navigate(`/comment/${articleId}`, { state: { commentCount } });
  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };
  const handleBookmark = () => setIsBookmarked((prev) => !prev);
  const toggleOriginal = () => setShowOriginal((prev) => !prev);

  if (loading) return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box sx={{ pb: 7 }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={handleBack} edge="start"><ArrowBackIcon /></IconButton>
        <Typography variant="subtitle1" component="h1" sx={{ ml: 1, flexGrow: 1, fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>{title}</Typography>
        <Box sx={{ width: 35, height: 35, ml: 1 }} />
      </Box>

      <Box sx={{ p: 2, pt: 3 }}>
        <Carousel
          items={[
            ...(thumbnailUrl ? [{
              slideSeq: 'thumbnail',
              imageUrl: thumbnailUrl,
              content: title,
            }] : []),
            ...slides
          ].map((slide) => (
            <SlideWithMoreButton key={slide.slideSeq} slide={slide} />
          ))}
        />
      </Box>

      <Box sx={{ px: 2, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={author?.profileImageUrl} alt={author?.name} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{author?.name}</Typography>
            <Typography variant="caption" color="text.secondary">조회수 {viewCount}회</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <IconButton><ShareIcon /></IconButton>
            <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'} sx={{ p: 0.5 }}>{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            <IconButton onClick={handleBookmark} sx={{ color: 'black' }}>{isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}</IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontSize: 15, mt: -2.0 }}>{likeCount}</Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, mt: 2 }}>
        <Box onClick={toggleOriginal} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 0.5, display: 'flex', alignItems: 'center' }}>
            원본 기사 보기
            <IconButton size="small" sx={{ p: 0.3, ml: 0 }}>{showOriginal ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />}</IconButton>
          </Typography>
        </Box>
        <Collapse in={showOriginal}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 0 }}>
            {sourceNews.map((news, idx) => (
              <Typography
                key={idx}
                component="a"
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none', display: 'block', fontSize: '1rem', '&:hover': { textDecoration: 'underline' } }}>
                {news.title}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>

      <Box onClick={handleCommentClick} sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>댓글 {commentCount}개</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <CategoryGrid
          title="관련 뉴스"
          articles={relatedNews.map(news => ({
            id: news.id,
            title: news.title,
            thumbnailUrl: news.thumbnailUrl,
            viewCount: 0,
          }))}
        />
      </Box>
    </Box>
  );
}

function SlideWithMoreButton({ slide }) {
  const [showAll, setShowAll] = useState(false);
  const isLong = slide.content.length > 30;

  // 한 줄일 때만 gradient mask 적용
  const gradientMask = 'linear-gradient(to right, #fff 80%, transparent 100%)';

  return (
    <Box sx={{ width: '100%', aspectRatio: '1/1', position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      <img
        src={slide.imageUrl}
        alt={slide.content}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          bgcolor: 'rgba(0,0,0,0.4)',
          color: 'white',
          p: 1,
          fontSize: 14,
          minHeight: showAll ? 56 : 28,
          transition: 'min-height 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {!showAll ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                whiteSpace: 'normal',
                WebkitLineClamp: 1,
                textOverflow: 'ellipsis',
                WebkitMaskImage: gradientMask,
                maskImage: gradientMask,
                flex: '1 1 auto',
                transition: 'all 0.2s',
              }}
            >
              {slide.content}
            </Box>
            {isLong && (
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: 0,
                  textDecoration: 'underline',
                  marginLeft: 8,
                  flex: '0 0 auto',
                }}
                onClick={() => setShowAll(true)}
              >
                더보기
              </button>
            )}
          </Box>
        ) : (
          <>
            <Box
              sx={{
                overflow: 'hidden',
                whiteSpace: 'normal',
                wordBreak: 'break-all',
                mb: 1,
              }}
            >
              {slide.content}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: 0,
                  textDecoration: 'underline',
                }}
                onClick={() => setShowAll(false)}
              >
                간략히
              </button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default ArticlePage;
