import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ searchQuery, onSearchChange }) {
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
      <TextField
        fullWidth
        placeholder="검색어를 입력하세요"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            backgroundColor: '#f5f5f5',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
          },
        }}
      />
    </Box>
  );
}

export default SearchBar; 