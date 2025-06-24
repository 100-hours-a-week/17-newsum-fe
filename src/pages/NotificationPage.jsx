import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotificationItem from '../components/common/NotificationItem';
import logo from '../assets/logo.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import NotificationList from '../components/common/NotificationList';
import { fetchNotifications, deleteAllNotifications, deleteNotification } from '../services/notificationApi';
import useSseNotifications from '../utils/sseConnect.jsx';

function formatNotification(noti) {
  const type = noti.targetType || noti.type;
  let link = '';
  switch (type) {
    case 'TOP3':
      link = '/';
      break;
    case 'FAVORITE_KEYWORD':
    case 'FAVORITE_AI_AUTHOR':
      link = `/article/${noti.targetId}`;
      break;
    case 'REPLY':
    case 'COMMENT_LIKE':
      link = `/article/${noti.targetId}/comments`;
      break;
    default:
      link = '';
  }
  return {
    ...noti,
    type,
    link,
    title: noti.title,
    message: noti.content,
    time: noti.createdAt ? noti.createdAt.replace('T', ' ').slice(0, 16) : '',
  };
}

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState('');
  const [error, setError] = useState(null);
  const observer = useRef();
  const navigate = useNavigate();
  // 새 알림 반짝임 해제 타이머 관리
  const newTimerRef = useRef(null);
  const [connectMsg, setConnectMsg] = useState('');

  // 알림 불러오기
  const loadNotifications = useCallback(async (init = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNotifications({ cursor: init ? '' : cursor, size: 10 });
      // 응답 구조: { data: [...], nextCursor: '', hasMore: true }
      setNotifications(prev => init ? res.data : [...prev, ...res.data]);
      setCursor(res.nextCursor || '');
      setHasMore(res.hasMore);
    } catch (e) {
      setError('알림을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  // 최초 로드
  useEffect(() => {
    loadNotifications(true);
    // eslint-disable-next-line
  }, []);

  // 무한스크롤 트리거 ref
  const lastNotificationRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadNotifications();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadNotifications]);

  // SSE 알림 수신
  useSseNotifications(
    (newNoti) => {
      const formatted = formatNotification(newNoti);
      setNotifications((prev) => {
        if (prev.some(n => n.targetId === formatted.targetId && n.targetType === formatted.targetType)) return prev;
        return [formatted, ...prev];
      });
      if (newTimerRef.current) clearTimeout(newTimerRef.current);
      newTimerRef.current = setTimeout(() => {
        setNotifications((prev) => prev.map(n => ({ ...n, isNew: false })));
      }, 2000);
    }
  );

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch {}
  };

  const handleDeleteOne = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications => notifications.filter(n => n.id !== id));
    } catch {}
  };

  return (
    <Box sx={{ pb: 7 }}>
      {connectMsg && (
        <Box sx={{
          position: 'sticky', top: 0, zIndex: 2000, bgcolor: '#222', color: '#fff',
          textAlign: 'center', py: 1, fontWeight: 600, fontSize: 15, borderRadius: 2, mb: 1
        }}>{connectMsg}</Box>
      )}
      {/* 커스텀 상단바 - 댓글 CommentHeader와 동일하게 */}
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
        <IconButton onClick={() => navigate(-1)} edge="start">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{ ml: 1, flexGrow: 1, fontWeight: 'bold' }}
        >
          알림
        </Typography>
        <Button onClick={handleDeleteAll} sx={{ color: '#222', fontWeight: 600, fontSize: 14, minWidth: 0 }}>전체 삭제</Button>
      </Box>
      {/* 알림 리스트 */}
      <NotificationList
        notifications={notifications.map(formatNotification)}
        loading={loading}
        lastNotificationRef={lastNotificationRef}
        onDelete={handleDeleteOne}
        onRead={id => setNotifications(notifications => notifications.map(n => n.id === id ? { ...n, isRead: true } : n))}
      />
      {error && <Box sx={{ color: 'red', textAlign: 'center', mt: 2 }}>{error}</Box>}
    </Box>
  );
}

export default NotificationPage; 