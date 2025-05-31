import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import styled from '@emotion/styled';

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

function CategoryDropdown({ selectedCategory, onCategoryChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuItemClick = (category) => {
        onCategoryChange(category);
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
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                            zIndex: 999,
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                    {/* 드롭다운 메뉴 */}
                    <DropdownMenu>
                        {Object.values(CATEGORY).map((cat) => (
                            <MenuItem
                                key={cat}
                                onClick={() => handleMenuItemClick(cat)}
                                selected={cat === selectedCategory}
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