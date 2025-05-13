// src/components/comments/CommentItem.jsx
import React, { useState, useRef } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, IconButton, Menu, MenuItem, TextField, Button } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/SendRounded';

function getLines(text, maxLines = 4) {
  // 줄바꿈 기준으로 자르기
  const lines = text.split('\n');
  if (lines.length <= maxLines) return { visible: text, hidden: '' };
  return {
    visible: lines.slice(0, maxLines).join('\n'),
    hidden: lines.slice(maxLines).join('\n'),
  };
}

function CommentItem({ comment, onDelete, onReply, level, isAuthor = false, likeCount = 0, replyCount = 0, onEdit, isReplying = false }) {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const open = Boolean(anchorEl);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const { visible, hidden } = getLines(comment.content, 4);

  const formatDateTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
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

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        pl: level * 3,
        bgcolor: isReplying ? 'rgba(0, 0, 0, 0.03)' : level > 0 ? `rgba(0, 0, 0, ${level * 0.03})` : 'inherit',
        py: 1,
      }}
    >
      <ListItemAvatar sx={{ minWidth: '45px' }}>
        <Avatar
          sx={{ width: 30, height: 30 }}
          alt={comment.author}
          src={`${comment.authorProfileImageUrl}`}
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
        sx={{
          overflow: 'visible',
          textOverflow: 'unset ',
          whiteSpace: 'normal',
        }}
        secondaryTypographyProps={{
          component: 'div',
          sx: {
            overflow: 'visible ',
            textOverflow: 'unset ',
            display: 'block ',
            whiteSpace: 'normal ',
            WebkitLineClamp: 'unset ',
            WebkitBoxOrient: 'unset ',
          }
        }}
        secondary={
          <React.Fragment>
            {editMode ? (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={3}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey && editContent.trim()) {
                      e.preventDefault();
                      handleEditSubmit();
                    }
                  }}
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
                  <SendIcon sx={{ fontSize: 24 }} />
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
              <>
                <Typography
                  ref={contentRef}
                  component="div"
                  variant="body2"
                  color="text.primary"
                  sx={{
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    mb: 0.5,
                    display: 'block',
                  }}
                >
                  {expanded ? comment.content : visible}
                </Typography>
                {!expanded && hidden && (
                  <Button
                    size="small"
                    sx={{ mt: 0.5, minHeight: 0, minWidth: 0, p: 0, fontSize: 12, color: 'black', display: 'block' }}
                    onClick={() => setExpanded(true)}
                  >
                    ... 자세히보기
                  </Button>
                )}
                {expanded && hidden && (
                  <Button
                    size="small"
                    sx={{ mt: 0.5, minHeight: 0, minWidth: 0, p: 0, fontSize: 12, color: 'black', display: 'block' }}
                    onClick={() => setExpanded(false)}
                  >
                    접기
                  </Button>
                )}
              </>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <IconButton size="small" onClick={handleLikeClick}>
                <FavoriteBorderIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>{likeCount}</Typography>
              </IconButton>
              {level === 0 && (
                <IconButton 
                  size="small" 
                  onClick={handleReplyClick}
                >
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>{replyCount}</Typography>
                </IconButton>
              )}
              {isAuthor && (
                <IconButton size="small" onClick={handleMoreClick}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </React.Fragment>
        }
      />
      {isAuthor && (
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
      )}
    </ListItem>
  );
}

export default CommentItem;