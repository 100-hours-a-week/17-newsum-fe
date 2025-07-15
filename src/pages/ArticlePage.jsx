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
import { connectWebtoonSSE } from '../utils/sseConnect';
import getOrCreateClientId from '../utils/getOrCreateClientId';

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
  }, [isLoggedIn, user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 로그인 상태에 따라 적절한 axios 인스턴스 선택
        const axiosInstance = isLoggedIn ? TokenAxios : DefaultAxios;

        // 웹툰 기본 정보 조회
        const res1 = await axiosInstance.get(`/api/v1/webtoons/${articleId}`);
        const data1 = res1.data?.data;

        setSlides(data1?.slides || []);
        setAuthor(data1?.author || null);
        setIsLiked(!!data1?.isLiked);
        setIsBookmarked(!!data1?.isBookmarked);
        setTitle(data1?.title)
        setThumbnailUrl(data1.thumbnailImageUrl)
        setLikeCount(data1?.likeCount || 0);
        setViewCount(data1?.viewCount || 0);
        setCreatedAt(data1?.createdAt || '');

        // 웹툰 상세 정보 조회 (인증 불필요)
        const res2 = await DefaultAxios.get(`/api/v1/webtoons/${articleId}/details`);
        const data2 = res2.data?.data;
        setSourceNews(data2?.sourceNews || []);
        setCommentCount(data2?.commentCount || 0);
        setRelatedNews((data2?.relatedNews || []).slice(0, 4));

      } catch (err) {
        console.error('데이터 로딩 중 오류:', err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [articleId, isLoggedIn]);

  // 실시간 시청자 수 SSE 연결
  useEffect(() => {
    const clientId = getOrCreateClientId();
    const eventSource = connectWebtoonSSE(articleId, clientId, setActiveViewers);

    // 페이지 이탈 시 leave API 호출
    const handleLeave = () => {
      const data = JSON.stringify({ webtoonId: Number(articleId), clientId });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/sse/webtoon/leave`,
        blob
      );
    };
    window.addEventListener('beforeunload', handleLeave);

    return () => {
      window.removeEventListener('beforeunload', handleLeave);
      handleLeave(); // cleanup 시에도 호출 (SPA 내 라우팅 등)
      eventSource.close();
    };
  }, [articleId]);

  const handleBack = () => navigate(-1);

  const handleLike = async () => {

    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    try {
      const res = await TokenAxios.post(`/api/v1/webtoons/${articleId}/likes`);


      if (res.data?.data) {
        const { liked, likeCount } = res.data.data;
        setIsLiked(liked);
        setLikeCount(likeCount);
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
      const res = await TokenAxios.post(`/api/v1/webtoons/${articleId}/favorites`);

      if (res.data?.data !== undefined) {
        const bookmarked = res.data.data;
        setIsBookmarked(bookmarked);
      } else {
        console.error('서버 응답에 data가 없습니다:', res.data);
      }
    } catch (error) {
      console.error("북마크 처리 중 오류 발생:", error);
      console.error("에러 상세:", error.response?.data);

      if (error.response?.status === 401) {
        setLoginModalOpen(true);
      } else {
        alert('북마크 처리 중 오류가 발생했습니다.');
      }
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

      <MoveLogin open={loginModalOpen} onClose={() => setLoginModalOpen(false)} from={location.pathname} />
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
