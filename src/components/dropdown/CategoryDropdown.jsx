import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { showInfoSwal } from '../modal/ShowInfoModal';

const CATEGORY = {
  WRITERS: 'AI작가 즐겨찾기',
  KEYWORDS: '키워드 즐겨찾기',
  WEBTOONS: '웹툰 즐겨찾기',
};

const DropdownContainer = styled(Box)`
  position: relative;
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;

const DropdownMenu = styled(Box)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 1px;
`;

const MenuItem = styled(Button)`
  width: 100%;
  padding: 16px;
  text-align: center;
  color: ${props => props.theme.palette.text.primary};
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background-color: ${props => props.selected ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Overlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  clip-path: polygon(0 60px, 100% 60px, 100% calc(100% - 56px), 0 calc(100% - 56px));

  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 100%;
  }

  @media (max-width: 767px) {
    max-width: 100%;
  }
`;

const HeaderContainer = styled(Box)`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
`;

function CategoryDropdown({ selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuItemClick = (category) => {
    if (category === CATEGORY.KEYWORDS) {
      navigate('/keyword-bookmarks');
    } else if (category === CATEGORY.WEBTOONS) {
      navigate('/bookmarks');
    } else if (category === CATEGORY.WRITERS) {
      showInfoSwal();
    }
    setIsOpen(false);
  };

  return (
    <DropdownContainer>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: 'text.primary',
          mt: -0.5,
          '&:hover': { backgroundColor: 'transparent' },
        }}
        endIcon={isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {selectedCategory}
      </Button>

      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <Overlay onClick={() => setIsOpen(false)} />
          {/* 드롭다운 메뉴 */}
          <DropdownMenu>
            {Object.values(CATEGORY).map((cat) => (
              <MenuItem
                key={cat}
                onClick={() => handleMenuItemClick(cat)}
                selected={cat === selectedCategory}
                sx={{
                  opacity: cat === CATEGORY.WRITERS ? 0.5 : 1,
                  cursor: cat === CATEGORY.WRITERS ? 'not-allowed' : 'pointer',
                }}
              >
                {cat}
              </MenuItem>
            ))}
          </DropdownMenu>
        </>
      )}
    </DropdownContainer>
  );
}

export default CategoryDropdown; 