// src/components/comments/CommentItem.jsx
import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, IconButton, Button, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';

function CommentItem({ comment, onDelete, onReply, level }) {
  const formatDateTime = (dateString) => { /* ... 이전과 동일 ... */
    try { return new Date(dateString).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return dateString; }
  };
  const handleDeleteClick = () => { if (onDelete) onDelete(comment.id); };
  const handleReplyClick = () => { if (onReply) onReply(comment.id); };

  return (
    <ListItem alignItems="flex-start" divider sx={{ pl: level * 3, bgcolor: level > 0 ? `rgba(0, 0, 0, ${level * 0.03})` : 'inherit' }}>
      <ListItemAvatar sx={{ minWidth: '45px' }}>
        <Avatar sx={{ width: 30, height: 30 }} alt={comment.author} src={`https://api.dicebear.com/8.x/initials/svg?seed=${comment.author}`} />
      </ListItemAvatar>
      <ListItemText
        primary={ <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>{comment.author}</Typography> }
        secondaryTypographyProps={{ component: 'div' }} // ★ 중요: p > div 오류 방지
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 0.5 }}>
              {comment.content}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">{formatDateTime(comment.createdAt)}</Typography>
              {onReply && (
                <Link component="button" variant="caption" onClick={handleReplyClick} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <ReplyIcon sx={{ fontSize: '1rem', mr: 0.3 }} /> 답글 달기
                </Link>
              )}
            </Box>
          </React.Fragment>
        }
      />
      {onDelete && ( <IconButton edge="end" aria-label="delete" onClick={handleDeleteClick} size="small" sx={{ mt: 1 }}><DeleteIcon fontSize="small" /></IconButton> )}
    </ListItem>
  );
}

export default CommentItem;