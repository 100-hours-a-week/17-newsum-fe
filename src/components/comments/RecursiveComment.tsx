// src/components/comments/RecursiveComment.tsx
import React from 'react';
import { Box } from '@mui/material';
import { CommentData } from '../../types/comment';
import CommentItem from './CommentItem'; // 댓글 아이템 컴포넌트

interface RecursiveCommentProps {
  comment: CommentData; // 현재 렌더링할 댓글
  allComments: CommentData[]; // 전체 댓글 목록 (자식 찾기용)
  onReply: (commentId: string) => void; // 답글 달기 핸들러
  onDelete?: (commentId: string) => void; // 삭제 핸들러
  level: number; // 현재 댓글의 깊이 (들여쓰기용)
  replyingToCommentId: string | null; // 현재 답글다는 대상 ID
  renderReplyForm: (parentId: string) => React.ReactNode; // 답글 폼 렌더링 함수
}

const RecursiveComment: React.FC<RecursiveCommentProps> = ({
  comment,
  allComments,
  onReply,
  onDelete,
  level,
  replyingToCommentId,
  renderReplyForm
}) => {
  // 현재 댓글의 자식 댓글들 찾기
  const children = allComments.filter(c => c.parentId === comment.id);

  return (
    <Box>
      {/* 현재 댓글 아이템 렌더링 */}
      <CommentItem
        comment={comment}
        onDelete={onDelete}
        onReply={onReply}
        level={level}
      />

      {/* 현재 댓글에 답글 다는 중이면 답글 폼 렌더링 */}
      {replyingToCommentId === comment.id && (
        <Box sx={{ pl: (level + 1) * 3, py: 1 }}> {/* 폼도 들여쓰기 */}
          {renderReplyForm(comment.id)}
        </Box>
      )}

      {/* 자식 댓글들이 있다면 재귀적으로 렌더링 */}
      {children.length > 0 && (
        <Box sx={{ /* 자식 댓글 영역 스타일링 (선택 사항) */ }}>
          {children.map(child => (
            <RecursiveComment
              key={child.id}
              comment={child}
              allComments={allComments}
              onReply={onReply}
              onDelete={onDelete}
              level={level + 1} // 자식은 레벨 증가
              replyingToCommentId={replyingToCommentId}
              renderReplyForm={renderReplyForm}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecursiveComment;