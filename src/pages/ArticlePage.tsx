// src/pages/ArticlePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, CircularProgress, Alert, Paper, Chip, Divider, Breadcrumbs, Link, Button, IconButton, Tooltip } from '@mui/material'; // Button 추가
import { useParams, Link as RouterLink } from 'react-router-dom'; // RouterLink import
import { ArticleDetail } from '../types/article'; // ArticleDetail 타입 import
import { fetchArticleById } from '../services/articleApi'; // API 함수 import
import HomeIcon from '@mui/icons-material/Home'; // 아이콘 추가
import NewspaperIcon from '@mui/icons-material/Newspaper'; // 아이콘 추가
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';

import { CommentData } from '../types/comment';
import RecursiveComment from '../components/comments/RecursiveComment'; // ★★★ 재귀 컴포넌트 import
import CommentReplyForm from '../components/comments/CommentReplyForm'; // ★★★ 답글 폼 import

const ArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId?: string }>(); // URL에서 articleId 가져오기
  const [article, setArticle] = useState<ArticleDetail | null>(null); // 상세 기사 데이터 상태
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);

  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const handleCommentSubmit = useCallback(async (content: string, parentId: string | null) => {
    if (!articleId) return; // articleId 없으면 불가

    // 시뮬레이션 (실제로는 API 호출)
    console.log(`Submitting comment: "${content}" with parentId: ${parentId}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCommentObject: CommentData = {
      id: `cmt${Date.now()}`,
      articleId: articleId,
      author: '나야나', // 임시 작성자
      content: content,
      createdAt: new Date().toISOString(),
      parentId: parentId, // 부모 ID 설정
    };

    // 새 댓글을 목록 맨 앞에 추가 (답글 순서 유지는 별도 로직 필요 시 추가)
    setComments(prevComments => [newCommentObject, ...prevComments]);

  }, [articleId]); // articleId가 변경되면 함수 재생성
  // --- 답글 달기 버튼 클릭 핸들러 ---
  const handleReplyClick = useCallback((commentId: string) => {
      // 이미 같은 댓글에 답글 달기 중이면 폼 닫기, 아니면 열기
      setReplyingToCommentId(prev => (prev === commentId ? null : commentId));
  }, []);

  // --- 답글 폼 취소 핸들러 ---
   const handleCancelReply = useCallback(() => {
       setReplyingToCommentId(null);
   }, []);

  // --- 댓글 삭제 핸들러 ---
  const handleCommentDelete = useCallback((commentId: string) => {
    console.log('Deleting comment:', commentId);
    // ★★★ 주의: 자식 댓글들도 함께 삭제하거나 처리하는 로직 필요 ★★★
    // 간단하게 해당 댓글만 제거 (실제 구현 시 복잡)
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  }, []);


  useEffect(() => {
    // articleId가 유효한 경우에만 데이터 로드 시도
    if (articleId) {
      const mockComments: CommentData[] = [
        { id: 'cmt001', articleId: articleId, author: '댓글러1', content: '정말 유익한 기사네요!', createdAt: '2025-04-15T11:00:00Z', parentId: null }, // 최상위
        { id: 'cmt002', articleId: articleId, author: '궁금해요', content: '이 부분은 조금 더 설명이 필요할 것 같아요.\n다른 의견 있으신 분?', createdAt: '2025-04-15T11:30:00Z', parentId: null }, // 최상위
        { id: 'cmt003', articleId: articleId, author: '개발자A', content: 'cmt001님 의견 감사합니다. 저도 그렇게 생각해요.', createdAt: '2025-04-15T11:35:00Z', parentId: 'cmt001' }, // cmt001의 답글
        { id: 'cmt004', articleId: articleId, author: '지나가던B', content: '저는 cmt002님 의견에 동의합니다.', createdAt: '2025-04-15T11:40:00Z', parentId: 'cmt002' }, // cmt002의 답글
        { id: 'cmt005', articleId: articleId, author: '댓글러1', content: '개발자A님 답글 감사합니다!', createdAt: '2025-04-15T11:45:00Z', parentId: 'cmt003' }, // cmt003의 답글 (대대댓글)
      ];
      setComments(mockComments);
      const loadArticleDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchArticleById(articleId);
          if (data) {
            setArticle(data); // 성공 시 데이터 저장
          } else {
            setError('Article not found.'); // ID에 해당하는 기사가 없을 경우 에러 처리
          }
        } catch (err) {
          // 기타 에러 처리
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred while fetching the article.');
          }
          console.error("Failed to load article detail:", err);
        } finally {
          setLoading(false); // 로딩 종료
        }
      };
      loadArticleDetail();
    } else {
      // articleId가 URL에 없을 경우
      setError('Invalid Article ID.');
      setLoading(false);
    }
  }, [articleId]); // articleId가 변경될 때마다 effect 재실행

  // 날짜 포맷팅 함수 (간단 예시)
  const formatDateTime = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString('ko-KR'); // 한국 날짜 및 시간 형식
    } catch (e) {
      return dateString;
    }
  };

  // 로딩 중 UI
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  // 에러 발생 시 UI
  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>홈으로 돌아가기</Button>
      </Container>
    );
  }

  // 데이터 로드 성공했지만 article이 null인 경우 (이론상 발생하기 어려움)
  if (!article) {
     return (
       <Container maxWidth="md" sx={{ my: 4 }}>
         <Alert severity="warning">Article data is unavailable.</Alert>
       </Container>
     );
  }
  if (!article) return null; // article 로드 완료 보장 (null 체크 후 진행)

  // 최상위 댓글 필터링 (parentId가 null인 댓글)
  const topLevelComments = comments.filter(comment => comment.parentId === null);

  // 답글 폼 렌더링 함수 (RecursiveComment에 전달)
  const renderReplyForm = (parentId: string) => (
      <CommentReplyForm
          parentId={parentId}
          onSubmit={handleCommentSubmit}
          onCancel={handleCancelReply}
          placeholder="답글을 입력하세요..."
          submitButtonText="답글 등록"
      />
  );
  // 데이터 로드 성공 시 상세 내용 렌더링
  return (
    <Container maxWidth="md"> {/* 본문 가독성을 위해 md로 설정 */}
      <Box sx={{ my: 4 }}>
        {/* Breadcrumbs (네비게이션 경로) */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} underline="hover" color="inherit" to="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          {/* 카테고리 링크 (선택 사항) */}
          {/* {article.category && (
            <Link component={RouterLink} underline="hover" color="inherit" to={`/category/${article.category}`}>
              {article.category}
            </Link>
          )} */}
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <NewspaperIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Article
          </Typography>
        </Breadcrumbs>

        {/* 기사 헤더 정보 */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {article.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle1" color="text.secondary">
              출처: {article.source}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              발행: {formatDateTime(article.publishedAt)}
            </Typography>
          </Box>
          {article.category && <Chip label={article.category} size="small" />}
          {/* 썸네일 이미지가 있다면 표시 */}
          {article.thumbnailUrl && (
             <Box sx={{ my: 2, textAlign: 'center' }}>
                 <img src={article.thumbnailUrl} alt={article.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}/>
             </Box>
          )}
          <Typography variant="body1" color="text.secondary" paragraph>
             {article.summary}
           </Typography>
           <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Tooltip title="북마크">
                <IconButton aria-label="bookmark article">
                    <BookmarkBorderIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="공유하기">
                <IconButton aria-label="share article">
                    <ShareIcon />
                </IconButton>
            </Tooltip>
         </Box>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* 기사 본문 내용 (HTML 문자열을 그대로 렌더링) */}
        {/* 주의: 외부 HTML을 그대로 렌더링하는 것은 XSS 공격에 취약할 수 있습니다.
             실제 서비스에서는 반드시 Sanitize(정화) 과정을 거쳐야 합니다 (예: DOMPurify 라이브러리 사용).
             여기서는 목업 데이터이므로 설명을 위해 dangerouslySetInnerHTML 사용. */}
        <Box
          component="article"
          sx={{
            // 기본적인 본문 스타일링 (선택 사항)
            lineHeight: 1.7,
            '& h3': { mt: 3, mb: 1 }, // 제목 스타일 예시
            '& h4': { mt: 2, mb: 1 },
            '& p': { mb: 2 },       // 문단 간격 예시
            '& img': { maxWidth: '100%', height: 'auto' }, // 이미지 반응형
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <Divider sx={{ my: 3 }} />

        {/* --- 댓글 섹션 --- */}
        <Box component="section" aria-labelledby="comment-section-title">
          <Typography variant="h6" id="comment-section-title" gutterBottom>
            댓글 ({comments.length}) {/* 총 댓글 수 표시 */}
          </Typography>

          {/* 최상위 댓글 입력 폼 */}
          <Box sx={{ mb: 3 }}>
            <CommentReplyForm
              parentId={null} // 최상위 댓글이므로 parentId는 null
              onSubmit={handleCommentSubmit}
              placeholder="댓글을 남겨보세요..."
              submitButtonText="댓글 등록"
            />
          </Box>

          {/* 댓글 목록 (재귀적으로 렌더링) */}
          <Box>
             {topLevelComments.length > 0 ? (
                 topLevelComments.map(comment => (
                   <RecursiveComment
                     key={comment.id}
                     comment={comment}
                     allComments={comments} // 전체 목록 전달
                     onReply={handleReplyClick}
                     onDelete={handleCommentDelete}
                     level={0} // 최상위 레벨은 0
                     replyingToCommentId={replyingToCommentId} // 현재 답글 대상 ID 전달
                     renderReplyForm={renderReplyForm} // 답글 폼 렌더링 함수 전달
                   />
                 ))
             ) : (
                 <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                     첫 댓글을 남겨주세요!
                 </Typography>
             )}
          </Box>
        </Box>
         <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 2 }}>목록으로</Button>
      </Box>
    </Container>
  );
};

export default ArticlePage;