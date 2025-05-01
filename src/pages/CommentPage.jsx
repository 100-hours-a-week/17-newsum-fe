import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert, Link, TextField, Button } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import CommentItem from '../components/comments/CommentItem';

// 목업 댓글 데이터
const initialMockComments = (articleId) => [
  { id: 'cmt001', articleId: articleId, author: '댓글러1', content: '정말 유익한 기사네요!', createdAt: '2025-04-15T11:00:00Z', parentId: null },
  { id: 'cmt002', articleId: articleId, author: '궁금해요', content: '이 부분은 조금 더 설명이 필요할 것 같아요.\n다른 의견 있으신 분?', createdAt: '2025-04-15T11:30:00Z', parentId: null },
  { id: 'cmt003', articleId: articleId, author: '개발자A', content: 'cmt001님 의견 감사합니다. 저도 그렇게 생각해요.', createdAt: '2025-04-15T11:35:00Z', parentId: 'cmt001' },
  { id: 'cmt004', articleId: articleId, author: '지나가던B', content: '저는 cmt002님 의견에 동의합니다.', createdAt: '2025-04-15T11:40:00Z', parentId: 'cmt002' },
  { id: 'cmt005', articleId: articleId, author: '댓글러1', content: '개발자A님 답글 감사합니다!', createdAt: '2025-04-15T11:45:00Z', parentId: 'cmt003' },
];

function CommentPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // 목업 댓글 데이터 로드
    setComments(initialMockComments(articleId));
  }, [articleId]);

  const handleBack = () => {
    if (showReplies) {
      setSelectedCommentId(null);
      setShowReplies(false);
    } else {
      navigate(-1);
    }
  };

  const handleCommentSubmit = useCallback(async () => {
    if (!articleId || !user || !commentText.trim()) return;
    
    const newCommentObject = {
      id: `cmt${Date.now()}`,
      articleId: articleId,
      author: user.name,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      parentId: selectedCommentId
    };
    
    setComments(prevComments => [newCommentObject, ...prevComments]);
    setCommentText('');
  }, [articleId, user, commentText, selectedCommentId]);

  const handleCommentDelete = useCallback((commentId) => {
    console.log('Deleting comment:', commentId);
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  }, []);

  const handleViewReplies = useCallback((commentId) => {
    setSelectedCommentId(commentId);
    setShowReplies(true);
  }, []);

  const selectedComment = selectedCommentId ? comments.find(c => c.id === selectedCommentId) : null;
  const replies = selectedCommentId ? comments.filter(c => c.parentId === selectedCommentId) : [];
  const topLevelComments = comments.filter(comment => comment.parentId === null);

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
        {!showReplies ? (
          topLevelComments.map(comment => (
            <Box key={comment.id} sx={{ px: 2 }}>
              <CommentItem
                comment={comment}
                onReply={() => handleViewReplies(comment.id)}
                onDelete={handleCommentDelete}
                level={0}
                isAuthor={user && comment.author === user.name}
              />
            </Box>
          ))
        ) : (
          <>
            {selectedComment && (
              <>
                <Box sx={{ px: 2 }}>
                  <CommentItem
                    comment={selectedComment}
                    level={0}
                    isAuthor={user && selectedComment.author === user.name}
                    onDelete={handleCommentDelete}
                  />
                </Box>
                {replies.map(reply => (
                  <Box key={reply.id} sx={{ pl: 4, pr: 2 }}>
                    <CommentItem
                      comment={reply}
                      level={1}
                      isAuthor={user && reply.author === user.name}
                      onDelete={handleCommentDelete}
                    />
                  </Box>
                ))}
              </>
            )}
          </>
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
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={!commentText.trim()}
            sx={{
              minWidth: 'auto',
              px: 2,
              borderRadius: '20px'
            }}
          >
            등록
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