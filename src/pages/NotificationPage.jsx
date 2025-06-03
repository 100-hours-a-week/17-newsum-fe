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
  // type, content, createdAt 등에서 표시용 데이터 생성
  let title = '';
  let message = '';
  switch (noti.type) {
    case 'TOP3':
      title = '실시간 TOP3';
      message = '실시간 뉴스가 변경되었습니다!';
      break;
    case 'FAVORITE_KEYWORD':
      title = noti.content;
      message = `[${noti.content}] 키워드가 포함된 뉴스가 발매되었습니다!`;
      break;
    case 'FAVORITE_AI_AUTHOR':
      title = noti.content;
      message = `[${noti.content}] 작가의 신작이 발표되었습니다!`;
      break;
    case 'REPLY':
      title = '답글이 추가되었습니다!';
      message = noti.content;
      break;
    case 'COMMENT_LIKE':
      title = '인기 댓글 알림';
      message = '많은 사람들이 댓글에 공감해요!';
      break;
    default:
      title = noti.type;
      message = noti.content;
  }
  return {
    ...noti,
    title,
    message,
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
  useSseNotifications((newNoti) => {
    setNotifications((prev) => {
      // 중복 방지(원하면 targetId 기준)
      if (prev.some(n => n.targetId === newNoti.targetId && n.targetType === newNoti.targetType)) return prev;
      // 새 알림을 맨 위에 추가
      return [newNoti, ...prev];
    });
    // 2초 후 isNew 해제
    if (newTimerRef.current) clearTimeout(newTimerRef.current);
    newTimerRef.current = setTimeout(() => {
      setNotifications((prev) => prev.map(n => ({ ...n, isNew: false })));
    }, 2000);
  });

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