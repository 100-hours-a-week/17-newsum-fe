// src/components/comments/CommentReplyForm.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

function CommentReplyForm({ parentId, onSubmit, onCancel, placeholder = "댓글을 입력하세요...", submitButtonText = "등록" }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => { setContent(event.target.value); };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), parentId);
      setContent('');
      if (onCancel) onCancel();
    } catch (error) { console.error("Failed to submit comment:", error); }
    finally { setIsSubmitting(false); }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, my: 1 }}>
      <TextField fullWidth multiline minRows={1} maxRows={4} variant="outlined" size="small" placeholder={placeholder} value={content} onChange={handleChange} disabled={isSubmitting}/>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {onCancel && (<Button size="small" onClick={onCancel} disabled={isSubmitting}>취소</Button>)}
        <Button variant="contained" size="small" onClick={handleSubmit} disabled={!content.trim() || isSubmitting} sx={{ position: 'relative' }}>
          {submitButtonText}
          {isSubmitting && (<CircularProgress size={20} sx={{ color: 'inherit', position: 'absolute', top: '50%', left: '50%', marginTop: '-10px', marginLeft: '-10px', }} />)}
        </Button>
      </Box>
    </Box>
  );
}

export default CommentReplyForm;