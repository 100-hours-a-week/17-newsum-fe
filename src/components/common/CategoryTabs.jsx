import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

export const categories = [
  { value: 'all', label: '전체' }, 
  { value: '정치', label: '정치' }, 
  { value: '경제', label: '경제' },
  { value: '사회', label: '사회' }, 
  { value: 'IT', label: 'IT' },
  { value: '과학', label: '과학' }, 
  { value: '라이프', label: '라이프' },
];

const StyledTab = styled(Tab)`
  color: #666;
  border-radius: 8px;
  padding: 0px 0px;
  min-width: 60px;
  text-transform: none;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.Mui-selected {
    color: white;
    background-color: black;
  }
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    display: none;
  }
`;

function CategoryTabs({ activeTab, onTabChange }) {
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    if (onTabChange) {
      onTabChange(event, newValue);
    }
    if (newValue === 'all') {
      navigate('/');
    } else {
      navigate(`/category/${newValue}`);
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <StyledTabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable" 
        scrollButtons="auto" 
        allowScrollButtonsMobile
      >
        {categories.map((cat) => (
          <StyledTab key={cat.value} label={cat.label} value={cat.value} />
        ))}
      </StyledTabs>
    </Box>
  );
}

export default CategoryTabs; 