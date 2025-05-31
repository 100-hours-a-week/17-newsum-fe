import React from 'react';
import { Alert, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function LoginRequiredAlert({ currentPath }) {
    return (
        <Alert severity="info" sx={{ mx: 2, my: 2 }}>
            <Typography variant="body2" display="inline">
                댓글을 작성하려면&nbsp;
            </Typography>
            <Link
                component={RouterLink}
                to={`/login?from=${encodeURIComponent(currentPath)}`}
                underline="hover"
                color="inherit"
                sx={{ fontWeight: 'bold' }}
            >
                로그인이 필요합니다.
            </Link>
        </Alert>
    );
}

export default LoginRequiredAlert; 