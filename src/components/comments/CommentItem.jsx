// src/components/comments/CommentItem.jsx
import React, { useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, IconButton, Menu, MenuItem, TextField, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Swal from 'sweetalert2';
import TokenAxios from '../../api/TokenAxios';

function CommentItem({ comment, onDelete, onReply, level, isAuthor = false, likeCount = 0, replyCount = 0, onEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
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

  const handleEditClick = () => {
    setEditMode(true);
    setAnchorEl(null);
  };

  const handleEditSubmit = () => {
    if (onEdit) onEdit(comment.id, editContent);
    setEditMode(false);
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setEditMode(false);
  };

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
            {editMode ? (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'white',
                      color: 'black',
                      '& fieldset': {
                        borderColor: 'black',
                      },
                      '&:hover fieldset': {
                        borderColor: 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'black',
                      },
                    },
                    input: {
                      color: 'black',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleEditSubmit}
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: '12px',
                    minWidth: 60,
                    mx: 1,
                    '&:hover': { bgcolor: '#222' }
                  }}
                >
                  수정
                </Button>
                <Button
                  size="small"
                  onClick={handleEditCancel}
                  sx={{
                    color: 'black',
                    minWidth: 40,
                    fontWeight: 600,
                    ml: 0,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  취소
                </Button>
              </Box>
            ) : (
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
                sx={{ display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 0.5 }}
              >
                {comment.content}
              </Typography>
            )}
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
                  {likeCount}
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
                    {replyCount}
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
            <MenuItem onClick={handleEditClick}>수정</MenuItem>
            <MenuItem onClick={handleDeleteClick}>삭제</MenuItem>
          </Menu>
        </>
      )}
    </ListItem>
  );
}

export default CommentItem;