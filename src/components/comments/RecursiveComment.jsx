// src/components/comments/RecursiveComment.jsx
import React from 'react';
import { Box } from '@mui/material';
import CommentItem from './CommentItem';

function RecursiveComment({ comment, allComments, onReply, onDelete, level, replyingToCommentId, renderReplyForm }) {
  // 현재 댓글의 자식 찾기
  const children = allComments.filter(c => c.parentId === comment.id);

  return (
    <Box>
      {/* 현재 댓글 */}
      <CommentItem comment={comment} onDelete={onDelete} onReply={onReply} level={level} />

      {/* 답글 폼 */}
      {replyingToCommentId === comment.id && (
        <Box sx={{ pl: (level + 1) * 3, py: 1 }}>
          {renderReplyForm(comment.id)}
        </Box>
      )}

      {/* 자식 댓글 (재귀 호출) */}
      {children.length > 0 && (
        <Box>
          {children.map(child => (
            <RecursiveComment
              key={child.id}
              comment={child}
              allComments={allComments}
              onReply={onReply}
              onDelete={onDelete}
              level={level + 1}
              replyingToCommentId={replyingToCommentId}
              renderReplyForm={renderReplyForm}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default RecursiveComment;