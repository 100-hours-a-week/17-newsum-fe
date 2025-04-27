// src/components/Layout/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon         from '@mui/icons-material/Search';
import PersonOutlineIcon  from '@mui/icons-material/PersonOutline';

function Header() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          NewSum (JS)
        </Typography>
        <Box>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton
            component={RouterLink}
            to="/login"
            color="inherit"
            sx={{ ml: 1 }}
          >
            <PersonOutlineIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
