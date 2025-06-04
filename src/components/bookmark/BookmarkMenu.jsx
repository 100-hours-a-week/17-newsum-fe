import React from 'react';
import { Slide, Paper, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * 북마크 하단 메뉴 컴포넌트
 * 
 * @param {Object} props
 * @param {boolean} props.open - 메뉴 표시 여부
 * @param {Function} props.onAddClick - 북마크 추가 버튼 클릭 핸들러
 * @param {Function} props.onDeleteClick - 북마크 삭제 버튼 클릭 핸들러
 */
function BookmarkMenu({ open, onAddClick, onDeleteClick }) {
    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: '50px',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
                    maxWidth: '430px',
                    margin: '0 auto',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Button
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={onAddClick}
                        sx={{
                            justifyContent: 'flex-start',
                            py: 1.5,
                            color: 'text.primary',
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        }}
                    >
                        북마크 추가하기
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<DeleteIcon />}
                        onClick={onDeleteClick}
                        sx={{
                            justifyContent: 'flex-start',
                            py: 1.5,
                            color: 'text.primary',
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        }}
                    >
                        북마크 삭제하기
                    </Button>
                </Box>
            </Paper>
        </Slide>
    );
}

export default BookmarkMenu; 