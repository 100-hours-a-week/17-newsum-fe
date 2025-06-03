import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { readNotification } from '../../services/notificationApi';

function NotificationItem({ notification, onDelete, link, onRead }) {
  const navigate = useNavigate();
  const [isCloseHover, setIsCloseHover] = useState(false);
  const isNew = notification.isNew;
  const baseBg = notification.isRead ? '#f6f6f6' : '#fff';
  const handleClick = async () => {
    if (link) {
      if (!notification.isRead) {
        // 비동기 읽음 처리
        readNotification(notification.id).catch(() => {});
        if (onRead) onRead(notification.id);
      }
      navigate(link);
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: 1.2,
        borderBottom: '1px solid #f0f0f0',
        gap: 1,
        cursor: link ? 'pointer' : 'default',
        bgcolor: isNew ? '#fffbe6' : baseBg,
        transition: 'background 0.3s',
        ...(isCloseHover
          ? {}
          : {
              '&:hover': {
                bgcolor: link ? '#f0f4fa' : baseBg,
              },
            }),
      }}
      onClick={handleClick}
    >
      <Avatar src={logo} alt="logo" sx={{ width: 44, height: 44, mr: 1, bgcolor: '#fff', border: '1px solid #eee' }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15, color: '#222', mb: 0.2, lineHeight: 1.2 }}>{notification.title}</Typography>
        <Typography variant="body2" sx={{ color: '#444', fontSize: 13, mb: 0.5, lineHeight: 1.3, wordBreak: 'keep-all' }}>{notification.message}</Typography>
        <Typography variant="caption" sx={{ color: '#aaa', fontSize: 11 }}>{notification.time}</Typography>
      </Box>
      <IconButton
        size="small"
        sx={{ mt: 0.5, '&:hover': { bgcolor: '#eee' }, zIndex: 2 }}
        onMouseEnter={() => setIsCloseHover(true)}
        onMouseLeave={() => setIsCloseHover(false)}
        onClick={e => { e.stopPropagation(); onDelete && onDelete(notification.id); }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default NotificationItem; 