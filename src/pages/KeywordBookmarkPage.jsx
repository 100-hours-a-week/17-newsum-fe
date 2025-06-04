import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import CategoryDropdown from '../components/dropdown/CategoryDropdown';
import BookmarkMenu from '../components/bookmark/BookmarkMenu';
import MoveLogin from '../components/modal/MoveLogin';
import { useAuth } from '../contexts/AuthContext';

function KeywordBookmarkPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('키워드 즐겨찾기');
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleAddBookmark = () => {
        setMenuOpen(false);
        if (!isLoggedIn) {
            setLoginModalOpen(true);
            return;
        }
        navigate('/keyword-add');
    };

    const handleDeleteBookmark = () => {
        setMenuOpen(false);
        // 북마크 삭제 로직 구현
    };

    return (
        <Box sx={{ pb: 7 }}>
            {/* 상단 헤더 */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'white',
                    zIndex: 10,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    px: 2,
                    py: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '44px',
                }}
            >
                <IconButton
                    onClick={handleBack}
                    edge="start"
                    sx={{
                        p: 0.5,
                        mt: -0.5,
                        '&:hover': { backgroundColor: 'transparent' },
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>

                <CategoryDropdown
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                <IconButton
                    onClick={handleMenuClick}
                    sx={{
                        p: 0.5,
                        mt: -0.5,
                        '&:hover': { backgroundColor: 'transparent' },
                    }}
                >
                    <MoreVertIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
            </Box>

            {/* 하단 메뉴 */}
            <BookmarkMenu
                open={menuOpen}
                onAddClick={handleAddBookmark}
                onDeleteClick={handleDeleteBookmark}
            />

            <MoveLogin open={loginModalOpen} onCancel={() => setLoginModalOpen(false)} from={location.pathname} />

            {/* 컨텐츠 영역 */}
            <Container maxWidth="lg" sx={{ overflowX: 'hidden', pt: 2 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        키워드 즐겨찾기 항목이 없습니다.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default KeywordBookmarkPage; 