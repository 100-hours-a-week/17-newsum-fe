import React from 'react';
import { Button, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/numberFormat';
import styled from '@emotion/styled';

const StyledCommentButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: normal;
  justify-content: flex-start;
  text-transform: none;
  margin-bottom: 16px;
  
  &:hover {
    background-color: #eeeeee;
  }
`;

/**
 * 댓글 페이지로 이동하는 버튼 컴포넌트
 * 
 * @param {Object} props
 * @param {number} props.articleId - 게시물 ID
 * @param {number} props.commentCount - 댓글 수
 */
const CommentButton = ({ articleId, commentCount = 0 }) => {
  const navigate = useNavigate();
  
  const handleCommentClick = () => {
    navigate(`/article/${articleId}/comments`);
  };
  
  return (
    <StyledCommentButton fullWidth onClick={handleCommentClick}>
      <ChatBubbleOutlineIcon sx={{ fontSize: '1.2rem' }} />
      <Typography variant="body2">댓글 {formatNumber(commentCount)}개</Typography>
    </StyledCommentButton>
  );
};

export default CommentButton; 