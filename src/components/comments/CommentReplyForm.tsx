// src/components/comments/CommentReplyForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

interface CommentReplyFormProps {
  parentId: string | null; // 답글 대상 ID (최상위 댓글은 null)
  onSubmit: (content: string, parentId: string | null) => Promise<void>; // 등록 처리 함수
  onCancel?: () => void; // 취소 처리 함수 (선택 사항)
  placeholder?: string;
  submitButtonText?: string;
}

const CommentReplyForm: React.FC<CommentReplyFormProps> = ({
  parentId,
  onSubmit,
  onCancel,
  placeholder = "댓글을 입력하세요...",
  submitButtonText = "등록"
}) => {
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return; // 내용 없으면 등록 불가

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), parentId); // 부모에게 내용과 parentId 전달
      setContent(''); // 성공 시 입력창 비우기
      if (onCancel) onCancel(); // 성공 시 폼 닫기 (취소 핸들러 재활용)
    } catch (error) {
      console.error("Failed to submit comment:", error);
      // 에러 처리 UI (예: 스낵바) 표시 가능
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, my: 1 }}>
      <TextField
        fullWidth
        multiline
        minRows={1} // 최소 1줄
        maxRows={4} // 최대 4줄
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={content}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
          {onCancel && (
              <Button
                  size="small"
                  onClick={onCancel}
                  disabled={isSubmitting}
              >
                  취소
              </Button>
          )}
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            sx={{ position: 'relative' }} // 로딩 표시 위치 기준
          >
            {submitButtonText}
            {isSubmitting && ( // 로딩 중 스피너 표시
              <CircularProgress
                size={20}
                sx={{
                  color: 'inherit',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-10px',
                  marginLeft: '-10px',
                }}
              />
            )}
          </Button>
      </Box>
    </Box>
  );
};

export default CommentReplyForm;