// src/pages/ArticlePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert, Modal, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Carousel from '../components/Carousel/Carousel';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';
import CategoryGrid from '../components/grid/CategoryGrid';
import ArticleInfo from '../components/article/ArticleInfo';
import CommentButton from '../components/article/CommentButton';
import { useAuth } from '../contexts/AuthContext';
import MoveLogin from '../components/modal/MoveLogin';

function ArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const [title, setTitle] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null)
  const [slides, setSlides] = useState([]);
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [sourceNews, setSourceNews] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [activeViewers, setActiveViewers] = useState(0);
  const [createdAt, setCreatedAt] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    console.log('로그인 상태:', isLoggedIn);
    console.log('사용자 정보:', user);
  }, [isLoggedIn, user]);

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
        setTitle(data1?.title)
        setThumbnailUrl(data1.thumbnailImageUrl)
        setLikeCount(data1?.likeCount || 0);
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
    console.log('ArticlePage - handleLike 호출됨');
    console.log('로그인 상태:', isLoggedIn);
    console.log('토큰:', localStorage.getItem('accessToken'));
    console.log('현재 좋아요 상태:', { isLiked, likeCount });

    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    try {
      console.log('🔥 좋아요 API 호출 시작');
      const res = await TokenAxios.post(`/api/v1/webtoons/${articleId}/likes`);


      if (res.data?.data) {
        const { liked, likeCount } = res.data.data;
        console.log('좋아요 상태 업데이트:', { liked, likeCount });
        console.log('이전 상태:', { isLiked, likeCount: likeCount });
        setIsLiked(liked);
        setLikeCount(likeCount);
        console.log('상태 업데이트 후:', { isLiked: liked, likeCount });
      } else {
        console.error('서버 응답에 data가 없습니다:', res.data);
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
      console.error("에러 상세:", error.response?.data);

      if (error.response?.status === 401) {
        setLoginModalOpen(true);
      } else {
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

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
          isLoggedIn={isLoggedIn}
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

      <MoveLogin open={loginModalOpen} onCancel={() => setLoginModalOpen(false)} from={location.pathname} />
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
