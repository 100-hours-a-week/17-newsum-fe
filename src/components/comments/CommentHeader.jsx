import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CommentHeader({
    title,
    onBack
}) {
    return (
        <Box sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'white',
            zIndex: 1,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center'
        }}>
            <IconButton onClick={onBack} edge="start">
                <ArrowBackIcon />
            </IconButton>
            <Typography
                variant="subtitle1"
                component="h1"
                sx={{
                    ml: 1,
                    flexGrow: 1,
                    fontWeight: 'bold'
                }}
            >
                {title}
            </Typography>
        </Box>
    );
}

export default CommentHeader; 