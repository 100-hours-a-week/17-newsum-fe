// src/components/Layout/Footer.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // padding-top & padding-bottom
        px: 2, // padding-left & padding-right
        mt: 'auto', // 페이지 내용이 짧아도 푸터를 하단에 고정 (flexbox 사용 필요)
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          NewSum. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;