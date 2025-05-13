import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert, Link, TextField, Button } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import CommentItem from '../components/comments/CommentItem';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';
import Swal from 'sweetalert2';
import SendIcon from '@mui/icons-material/SendRounded';

function CommentPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [showGradient, setShowGradient] = useState(false);
  const location = useLocation();
  const listRef = useRef(null);

  const fetchComments = async (cursor = null) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        size: 15
      };
      if (cursor) {
        params.cursor = cursor;
      }

      const res = await DefaultAxios.get(`/api/v1/webtoons/${articleId}/comments`, { params });
      console.log(res.data);
      const newComments = res.data?.data?.comments || [];
      const newPageInfo = res.data?.data?.pageInfo || null;
      setCommentCount(res.data?.data?.commentCount)

      if (cursor) {
        // 추가 로딩인 경우 기존 데이터에 추가
        setComments(prev => [...prev, ...newComments]);
      } else {
        // 초기 로딩인 경우 데이터 교체
        setComments(newComments);
      }
      setPageInfo(newPageInfo);
    } catch {
      setError('댓글을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (loading || !pageInfo?.hasNext || showReplies) return;
    const el = listRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      fetchComments(pageInfo.nextCursor);
    }
  }, [loading, pageInfo, showReplies]);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const handleBack = () => {
    if (showReplies) {
      setSelectedCommentId(null);
      setShowReplies(false);
    } else {
      navigate(-1);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const parentId = showReplies && selectedCommentId ? selectedCommentId : 0;
      await TokenAxios.post(`/api/v1/webtoons/${articleId}/comments`, {
        content: commentText,
        parentId: parentId
      });
      setCommentText('');
      
      fetchComments(); // 댓글 작성 후 목록 새로고침
      if (showReplies && selectedCommentId) {
        handleViewReplies(selectedCommentId);
      }
    } catch {
      setError('댓글 작성에 실패했습니다.');
    }
  };

  const handleCommentDelete = useCallback(async (commentId) => {
    try {
      await TokenAxios.delete(`/api/v1/webtoons/${articleId}/comments/${commentId}`);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      Swal.fire('삭제 완료', '댓글이 삭제되었습니다.', 'success');
    } catch {
      Swal.fire('오류', '댓글 삭제에 실패했습니다.', 'error');
    }
  }, [articleId]);

  const handleCommentEdit = async (commentId, newContent) => {
    try {
      await TokenAxios.patch(`/api/v1/webtoons/${articleId}/comments/${commentId}`, {
        content: newContent
      });
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? { ...comment, content: newContent } : comment
        )
      );
      Swal.fire('수정 완료', '댓글이 수정되었습니다.', 'success');
    } catch {
      Swal.fire('오류', '댓글 수정에 실패했습니다.', 'error');
    }
  };

  const handleViewReplies = useCallback((commentId) => {
    setSelectedCommentId(commentId);
    setShowReplies(true);
    setShowGradient(true);
    setTimeout(() => {
      setShowGradient(false);
    }, 3000);
  }, []);

  const selectedComment = selectedCommentId ? comments.find(c => c.id === selectedCommentId) : null;
  const replies = selectedCommentId ? (selectedComment?.subComments || []) : [];
  const topLevelComments = comments;

  return (
    <Box 
      sx={{ 
        maxWidth: '430px',
        margin: '0 auto',
        height: '100vh',
        position: 'relative',
        bgcolor: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
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
            fontWeight: 'bold'
          }}
        >
          {showReplies ?  `답글 ${replies.length}개` : `댓글 ${commentCount}개`}
        </Typography>
      </Box>

      {/* 댓글 목록 */}
      <Box
        ref={listRef}
        onScroll={handleScroll}
        sx={{
          position: 'relative',
          height: 'calc(100vh - 56px - 72px)', // 헤더, 입력창 높이에 맞게 조정
          overflowY: 'auto',
          pb: 2,
        }}
      >
        {loading && !comments.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !showReplies ? (
          <>
            {topLevelComments.map(comment => (
              <Box key={comment.id} sx={{ px: 2 }}>
                <CommentItem
                  comment={comment}
                  onReply={() => handleViewReplies(comment.id)}
                  onDelete={handleCommentDelete}
                  onEdit={handleCommentEdit}
                  level={0}
                  isAuthor={user && comment.author === user.nickname}
                  replyCount={comment.subComments?.length || 0}
                  likeCount={comment.likeCount || 0}
                />
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </>
        ) : (
          selectedComment && (
            <>
              <Box sx={{ px: 2 }}>
                <CommentItem
                  comment={selectedComment}
                  level={0}
                  isAuthor={user && selectedComment.author === user.nickname}
                  onDelete={handleCommentDelete}
                  onEdit={handleCommentEdit}
                  replyCount={selectedComment.subComments?.length || 0}
                  likeCount={selectedComment.likeCount || 0}
                  isReplying={true}
                />
              </Box>
              {replies.map(reply => (
                <Box key={reply.id} sx={{ pl: 4, pr: 2 }}>
                  <CommentItem
                    comment={reply}
                    level={1}
                    isAuthor={user && reply.author === user.nickname}
                    onDelete={handleCommentDelete}
                    onEdit={handleCommentEdit}
                    likeCount={reply.likeCount || 0}
                  />
                </Box>
              ))}
            </>
          )
        )}
      </Box>

      {/* 댓글 입력 영역 */}
      {user ? (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'white',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            p: 2,
            display: 'flex',
            gap: 1,
            zIndex: 2,
            height: '72px', // 입력창 높이와 맞추기
          }}
        >
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={1}
            maxRows={3}
            placeholder={showReplies ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && commentText.trim()) {
                e.preventDefault();
                handleCommentSubmit(e);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                background: 'white',
                color: 'black',
                position: 'relative',
                '& fieldset': {
                  borderColor: showGradient ? 'transparent' : 'black',
                },
                '&:hover fieldset': {
                  borderColor: showGradient ? 'transparent' : 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: showGradient ? 'transparent' : 'black',
                },
                ...(showGradient && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    borderRadius: '22px',
                    background: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
                    backgroundSize: '200% 200%',
                    animation: 'rainbow 3s linear',
                    zIndex: -1,
                  }
                })
              },
              input: {
                color: 'black',
              },
              '@keyframes rainbow': {
                '0%': {
                  backgroundPosition: '0% 50%'
                },
                '50%': {
                  backgroundPosition: '100% 50%'
                },
                '100%': {
                  backgroundPosition: '0% 50%'
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: 'black',
              color: 'white',
              borderRadius: '20px',
              minWidth: 48,
              height: 40,
              px: 0,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#222' }
            }}
            disabled={!commentText.trim()}
            onClick={handleCommentSubmit}
          >
            <SendIcon sx={{ fontSize: 24 }} />
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(232, 245, 253, 0.95)',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Alert 
            severity="info" 
            sx={{ 
              py: 1.5,
              '& .MuiAlert-message': {
                width: '100%',
                textAlign: 'center'
              },
              '& .MuiAlert-icon': {
                display: 'none'
              }
            }}
          >
            댓글을 작성하려면 <Link component={RouterLink} to={`/login?from=${encodeURIComponent(location.pathname)}`}>로그인</Link>이 필요합니다.
          </Alert>
        </Box>
      )}
    </Box>
  );
}

export default CommentPage; 