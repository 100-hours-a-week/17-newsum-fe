import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/SendRounded';

function CommentInputForm({
    value,
    onChange,
    onSubmit,
    placeholder = "댓글을 입력하세요...",
    disabled = false
}) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && value.trim()) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 2,
                p: 2,
                borderTop: '1px solid #eee',
                bgcolor: 'white',
            }}
        >
            <TextField
                fullWidth
                size="small"
                multiline
                minRows={1}
                maxRows={3}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
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
                type="submit"
                variant="contained"
                sx={{
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: '20px',
                    minWidth: 48,
                    height: 40,
                    px: 0,
                    boxShadow: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#222' }
                }}
                disabled={!value.trim() || disabled}
            >
                <SendIcon sx={{ fontSize: 24 }} />
            </Button>
        </Box>
    );
}

export default CommentInputForm; 