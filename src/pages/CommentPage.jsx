import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert, Link, TextField, Button } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import CommentItem from '../components/comments/CommentItem';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';

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


  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await DefaultAxios.get(`/api/v1/webtoons/${articleId}/comments`);
      console.log(res.data)
      setComments(res.data?.data?.comments || []);
    } catch {
      setError('댓글을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      fetchComments();
      if (showReplies && selectedCommentId) {
        handleViewReplies(selectedCommentId);
      }
    } catch {
      setError('댓글 작성에 실패했습니다.');
    }
  };

  const handleCommentDelete = useCallback((commentId) => {
    console.log('Deleting comment:', commentId);
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  }, []);

  const handleViewReplies = useCallback((commentId) => {
    setSelectedCommentId(commentId);
    setShowReplies(true);
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
        overflow: 'hidden'
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
          {showReplies ? '답글' : `댓글 ${comments.length}개`}
        </Typography>
      </Box>

      {/* 댓글 목록 */}
      <Box sx={{ flex: 1, overflow: 'auto', pb: user ? 7 : 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !showReplies ? (
          topLevelComments.map(comment => (
            <Box key={comment.id} sx={{ px: 2 }}>
              <CommentItem
                comment={comment}
                onReply={() => handleViewReplies(comment.id)}
                onDelete={handleCommentDelete}
                level={0}
                isAuthor={user && comment.author === user.name}
                replyCount={comment.subComments?.length || 0}
                likeCount={comment.likeCount || 0}
              />
            </Box>
          ))
        ) : (
          selectedComment && (
            <>
              <Box sx={{ px: 2 }}>
                <CommentItem
                  comment={selectedComment}
                  level={0}
                  isAuthor={user && selectedComment.author === user.name}
                  onDelete={handleCommentDelete}
                  replyCount={selectedComment.subComments?.length || 0}
                  likeCount={selectedComment.likeCount || 0}
                />
              </Box>
              {replies.map(reply => (
                <Box key={reply.id} sx={{ pl: 4, pr: 2 }}>
                  <CommentItem
                    comment={reply}
                    level={1}
                    isAuthor={user && reply.author === user.name}
                    onDelete={handleCommentDelete}
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
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'white',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            p: 2,
            display: 'flex',
            gap: 1
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder={showReplies ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
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
              minWidth: 80,
              height: 40,
              px: 3,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#222' }
            }}
            disabled={!commentText.trim()}
            onClick={handleCommentSubmit}
          >
            {showReplies ? "답글" : "댓글"}
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
            댓글을 작성하려면 <Link component={RouterLink} to="/login">로그인</Link>이 필요합니다.
          </Alert>
        </Box>
      )}
    </Box>
  );
}

export default CommentPage; 