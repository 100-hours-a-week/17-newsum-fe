import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert, Link, TextField, Button, Modal } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import CommentItem from '../components/comments/CommentItem';
import CommentInputForm from '../components/comments/CommentInputForm';
import CommentHeader from '../components/comments/CommentHeader';
import LoginRequiredAlert from '../components/comments/LoginRequiredAlert';
import DefaultAxios from '../api/DefaultAxios';
import TokenAxios from '../api/TokenAxios';
import Swal from 'sweetalert2';
import SendIcon from '@mui/icons-material/SendRounded';
import MoveLogin from '../components/modal/MoveLogin';

function CommentPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [showGradient, setShowGradient] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
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

      // 로그인 상태에 따라 적절한 axios 인스턴스 선택
      const axiosInstance = isLoggedIn ? TokenAxios : DefaultAxios;
      const res = await axiosInstance.get(`/api/v1/webtoons/${articleId}/comments`, { params });
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
    if (!commentText.trim()) {
      if (!isLoggedIn) { // 비회원일 경우 로그인 모달 표시
        setLoginModalOpen(true);
        return;
      }
      return; // 로그인 상태이고 내용이 없으면 그냥 리턴
    }

    // 로그인 상태가 아니면 모달 표시 (내용이 있더라도)
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

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

      fetchComments(); // 댓글 작성 후 목록 새로고침
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
        overflow: 'hidden',
      }}
    >
      {/* 메인 댓글 목록 영역 */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'transform 0.3s ease-in-out',
          transform: showReplies ? 'translateX(-100%)' : 'translateX(0%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 헤더 */}
        <CommentHeader
          title={showReplies ? `답글 ${replies.length}개` : `댓글 ${commentCount}개`}
          onBack={handleBack}
        />

        {/* 댓글 목록 */}
        <Box
          ref={listRef}
          onScroll={handleScroll}
          sx={{
            position: 'relative',
            height: 'calc(100vh - 56px - 72px)',
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
                    comment={{ ...comment, articleId }}
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
          ) : null}
        </Box>

        {/* 댓글 입력 영역 (메인) */}
        {isLoggedIn ? (
          <CommentInputForm
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onSubmit={handleCommentSubmit}
            placeholder="댓글을 입력하세요..."
          />
        ) : (
          <LoginRequiredAlert currentPath={location.pathname} />
        )}
      </Box>

      {/* 답글 페이지 영역 */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'transform 0.3s ease-in-out',
          transform: showReplies ? 'translateX(0%)' : 'translateX(100%)',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          visibility: showReplies ? 'visible' : 'hidden',
        }}
      >
        {/* 헤더 (답글 페이지) */}
        <CommentHeader
          title={`답글 ${replies.length}개`}
          onBack={handleBack}
        />

        {/* 답글 목록 */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            pb: 2,
            bgcolor: 'white',
          }}
        >
          {selectedComment && (
            <Box sx={{ px: 2 }}>
              <CommentItem
                comment={{ ...selectedComment, articleId }}
                level={0}
                isAuthor={user && selectedComment.author === user.nickname}
                onDelete={handleCommentDelete}
                onEdit={handleCommentEdit}
                replyCount={selectedComment.subComments?.length || 0}
                likeCount={selectedComment.likeCount || 0}
                isReplying={true}
              />
            </Box>
          )}
          {replies.map(reply => (
            <Box key={reply.id} sx={{ pl: 4, pr: 2 }}>
              <CommentItem
                comment={{ ...reply, articleId }}
                level={1}
                isAuthor={user && reply.author === user.nickname}
                onDelete={handleCommentDelete}
                onEdit={handleCommentEdit}
                likeCount={reply.likeCount || 0}
              />
            </Box>
          ))}
        </Box>

        {/* 댓글 입력 영역 (답글) */}
        {isLoggedIn ? (
          <CommentInputForm
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onSubmit={handleCommentSubmit}
            placeholder="답글을 입력하세요..."
          />
        ) : (
          <LoginRequiredAlert currentPath={location.pathname} />
        )}
      </Box>

      <MoveLogin open={loginModalOpen} onCancel={() => setLoginModalOpen(false)} from={location.pathname} />
    </Box>
  );
}

export default CommentPage; 