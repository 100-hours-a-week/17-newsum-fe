// src/components/comments/CommentItem.jsx
import React, { useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function CommentItem({ comment, onDelete, onReply, level, isAuthor = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const open = Boolean(anchorEl);

  const formatDateTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' });
    } catch (e) {
      return dateString;
    }
  };

  const handleMoreClick = (event) => {
    if (isAuthor) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleClose();
    if (onDelete) onDelete(comment.id);
  };

  const handleReplyClick = () => {
    if (onReply) onReply(comment.id);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        pl: level * 3,
        bgcolor: level > 0 ? `rgba(0, 0, 0, ${level * 0.03})` : 'inherit',
        py: 1,
      }}
    >
      <ListItemAvatar sx={{ minWidth: '45px' }}>
        <Avatar
          sx={{ width: 30, height: 30 }}
          alt={comment.author}
          src={`https://api.dicebear.com/8.x/initials/svg?seed=${comment.author}`}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
              {comment.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDateTime(comment.createdAt)}
            </Typography>
          </Box>
        }
        secondaryTypographyProps={{ component: 'div' }}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 0.5 }}
            >
              {comment.content}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  cursor: 'pointer',
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '16px',
                  padding: '4px 8px',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                  }
                }} 
                onClick={handleLikeClick}
              >
                {isLiked ? (
                  <FavoriteIcon sx={{ fontSize: '1rem', color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: '1rem' }} />
                )}
                <Typography variant="caption" color="text.secondary">
                  {10}
                </Typography>
              </Box>
              {!level && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5, 
                    cursor: 'pointer',
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '16px',
                    padding: '4px 8px',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                    }
                  }} 
                  onClick={handleReplyClick}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: '1rem' }} />
                  <Typography variant="caption" color="text.secondary">
                    {4}
                  </Typography>
                </Box>
              )}
            </Box>
          </React.Fragment>
        }
      />
      {isAuthor && (
        <>
          <IconButton
            edge="end"
            aria-label="more"
            onClick={handleMoreClick}
            size="small"
            sx={{ mt: 1 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose}>수정</MenuItem>
            <MenuItem onClick={handleDeleteClick}>삭제</MenuItem>
          </Menu>
        </>
      )}
    </ListItem>
  );
}

export default CommentItem;