import React, { useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import NotificationItem from './NotificationItem';

function getNotificationLink(notification) {
  // 타입별 링크 분기
  const { type, content, id, targetId } = notification;
  switch (type) {
    case 'TOP3':
      return '/';
    case 'FAVORITE_KEYWORD':
    case 'FAVORITE_AI_AUTHOR':
      // 웹툰 디테일 페이지, id 또는 targetId 활용
      return `/article/${notification.targetId || notification.id}`;
    case 'REPLY':
      // 답글 페이지
      return `/article/${notification.targetId || notification.id}/comments`;
    case 'COMMENT_LIKE':
      // 댓글 페이지
      return `/article/${notification.targetId || notification.id}/comments`;
    default:
      return '';
  }
}

function NotificationList({ notifications, loading, lastNotificationRef, onDelete, onRead }) {
  return (
    <Box sx={{ px: 1, pt: 1 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>
      )}
      {!loading && notifications.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8, color: '#aaa' }}>
          <Typography variant="body1">알림이 없습니다</Typography>
        </Box>
      )}
      {notifications.map((noti, idx) => (
        <div key={noti.id} ref={idx === notifications.length - 1 ? lastNotificationRef : null}>
          <NotificationItem notification={noti} onDelete={onDelete} link={getNotificationLink(noti)} onRead={onRead} />
        </div>
      ))}
    </Box>
  );
}

export default NotificationList; 