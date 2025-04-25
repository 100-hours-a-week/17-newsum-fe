// src/pages/ArticlePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, CircularProgress, Alert, Paper, Chip, Divider, Breadcrumbs, Link, Button, TextField } from '@mui/material'; // List 제거
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchArticleById } from '../services/articleApi'; // fetchArticles 제거 가능
import HomeIcon from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';

import RecursiveComment from '../components/comments/RecursiveComment';
import CommentReplyForm from '../components/comments/CommentReplyForm';

// --- 목업 댓글 데이터 ---
const initialMockComments = (articleId) => [
    { id: 'cmt001', articleId: articleId, author: '댓글러1', content: '정말 유익한 기사네요!', createdAt: '2025-04-15T11:00:00Z', parentId: null },
    { id: 'cmt002', articleId: articleId, author: '궁금해요', content: '이 부분은 조금 더 설명이 필요할 것 같아요.\n다른 의견 있으신 분?', createdAt: '2025-04-15T11:30:00Z', parentId: null },
    { id: 'cmt003', articleId: articleId, author: '개발자A', content: 'cmt001님 의견 감사합니다. 저도 그렇게 생각해요.', createdAt: '2025-04-15T11:35:00Z', parentId: 'cmt001' },
    { id: 'cmt004', articleId: articleId, author: '지나가던B', content: '저는 cmt002님 의견에 동의합니다.', createdAt: '2025-04-15T11:40:00Z', parentId: 'cmt002' },
    { id: 'cmt005', articleId: articleId, author: '댓글러1', content: '개발자A님 답글 감사합니다!', createdAt: '2025-04-15T11:45:00Z', parentId: 'cmt003' },
];


function ArticlePage() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  // 기사 로드 Effect
  useEffect(() => {
    if (articleId) {
      const loadArticleDetail = async () => {
        try { setLoading(true); setError(null); const data = await fetchArticleById(articleId); if (data) setArticle(data); else setError('Article not found.'); }
        catch (err) { setError(err.message || 'An unknown error occurred'); }
        finally { setLoading(false); }
      };
      loadArticleDetail();
      // 기사 ID 변경 시 목업 댓글도 다시 설정 (실제로는 API 호출)
      setComments(initialMockComments(articleId));
    } else { setError('Invalid Article ID.'); setLoading(false); }
  }, [articleId]);

  // 댓글 등록 핸들러
  const handleCommentSubmit = useCallback(async (content, parentId) => {
    if (!articleId) return;
    console.log(`Submitting comment: "${content}" with parentId: ${parentId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCommentObject = { id: `cmt${Date.now()}`, articleId: articleId, author: '나야나', content: content, createdAt: new Date().toISOString(), parentId: parentId };
    setComments(prevComments => [newCommentObject, ...prevComments]);
  }, [articleId]);

  const handleReplyClick = useCallback((commentId) => { setReplyingToCommentId(prev => (prev === commentId ? null : commentId)); }, []);
  const handleCancelReply = useCallback(() => { setReplyingToCommentId(null); }, []);
  const handleCommentDelete = useCallback((commentId) => { console.log('Deleting comment:', commentId); setComments(prev => prev.filter(comment => comment.id !== commentId)); }, []);

  const formatDateTime = (dateString) => { try { return new Date(dateString).toLocaleString('ko-KR'); } catch (e) { return dateString; } };

  if (loading) { return <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Container>; }
  if (error) { return <Container maxWidth="md" sx={{ my: 4 }}><Alert severity="error">{error}</Alert><Button component={RouterLink} to="/" sx={{ mt: 2 }}>홈으로 돌아가기</Button></Container>; }
  if (!article) { return <Container maxWidth="md" sx={{ my: 4 }}><Alert severity="warning">Article data is unavailable.</Alert></Container>; }

  const topLevelComments = comments.filter(comment => comment.parentId === null);
  const renderReplyForm = (parentId) => ( <CommentReplyForm parentId={parentId} onSubmit={handleCommentSubmit} onCancel={handleCancelReply} placeholder="답글을 입력하세요..." submitButtonText="답글 등록" /> );

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link component={RouterLink} underline="hover" color="inherit" to="/" sx={{ display: 'flex', alignItems: 'center' }}><HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />Home</Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}><NewspaperIcon sx={{ mr: 0.5 }} fontSize="inherit" />Article</Typography>
        </Breadcrumbs>

        {/* 기사 헤더 정보 */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>{article.title}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle1" color="text.secondary">출처: {article.source}</Typography>
            <Typography variant="subtitle2" color="text.secondary">발행: {formatDateTime(article.publishedAt)}</Typography>
          </Box>
          {article.category && <Chip label={article.category} size="small" />}
          {article.thumbnailUrl && ( <Box sx={{ my: 2, textAlign: 'center' }}><img src={article.thumbnailUrl} alt={article.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}/></Box> )}
           <Typography variant="body1" color="text.secondary" paragraph>{article.summary}</Typography>
           {/* 액션 아이콘 등 */}
        </Paper>
        <Divider sx={{ my: 3 }} />
        {/* 기사 본문 */}
        <Box component="article" sx={{ lineHeight: 1.7, '& h3': { mt: 3, mb: 1 }, '& h4': { mt: 2, mb: 1 }, '& p': { mb: 2 }, '& img': { maxWidth: '100%', height: 'auto' } }} dangerouslySetInnerHTML={{ __html: article.content }} />
        <Divider sx={{ my: 3 }} />

        {/* 댓글 섹션 */}
        <Box component="section" aria-labelledby="comment-section-title">
          <Typography variant="h6" id="comment-section-title" gutterBottom>댓글 ({comments.length})</Typography>
          <Box sx={{ mb: 3 }}><CommentReplyForm parentId={null} onSubmit={handleCommentSubmit} placeholder="댓글을 남겨보세요..." submitButtonText="댓글 등록" /></Box>
          <Box>
             {topLevelComments.length > 0 ? (
                 topLevelComments.map(comment => ( <RecursiveComment key={comment.id} comment={comment} allComments={comments} onReply={handleReplyClick} onDelete={handleCommentDelete} level={0} replyingToCommentId={replyingToCommentId} renderReplyForm={renderReplyForm} /> ))
             ) : ( <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>첫 댓글을 남겨주세요!</Typography> )}
          </Box>
        </Box>

        <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 4 }}>목록으로</Button>
      </Box>
    </Container>
  );
}

export default ArticlePage;