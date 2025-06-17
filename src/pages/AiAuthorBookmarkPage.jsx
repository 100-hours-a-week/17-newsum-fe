import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
    CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import CategoryDropdown from '../components/dropdown/CategoryDropdown';
import BookmarkMenu from '../components/bookmark/BookmarkMenu';
import MoveLogin from '../components/modal/MoveLogin';
import { useAuth } from '../contexts/AuthContext';
import TokenAxios from '../api/TokenAxios';
import CategoryGrid from '../components/grid/CategoryGrid';

function AiAuthorBookmarkPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('AI작가 즐겨찾기');
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [writers, setWriters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState(null);

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
        navigate('/ai-authors');
    };

    const handleDeleteBookmark = () => {
        setMenuOpen(false);
        // 북마크 삭제 로직 구현
    };

    const fetchWriters = useCallback(async (cursor = null) => {
        if (!isLoggedIn) {
            setLoading(false);
            setLoginModalOpen(true);
            return;
        }

        try {
            setLoading(true);
            const params = { size: 10 };
            if (cursor) params.cursor = cursor;

            const response = await TokenAxios.get('/api/v1/users/favorites/writers', { params });
            const data = response.data?.data;

            if (cursor) {
                setWriters(prev => [...prev, ...data.writers]);
            } else {
                setWriters(data.writers);
            }
            setPageInfo(data.pageInfo);
        } catch (err) {
            console.error('AI작가 즐겨찾기 로딩 오류:', err);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchWriters();
    }, [fetchWriters]);

    const handleScroll = useCallback(() => {
        if (loading || !pageInfo?.hasNext) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 100) {
            fetchWriters(pageInfo.nextCursor);
        }
    }, [loading, pageInfo, fetchWriters]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

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
                    px: 0,
                    py: 0,
                    width: '100%',
                    maxWidth: { xs: '430px', md: '100vw' },
                    margin: '0 auto',
                    height: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* 드롭다운: 항상 100% */}
                <CategoryDropdown
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* 아이콘 버튼들: absolute로 위에 겹치게 */}
                <IconButton
                    onClick={handleBack}
                    edge="start"
                    sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        p: 2,
                        mt: 0,
                        '&:hover': { backgroundColor: 'transparent' },
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
                <IconButton
                    onClick={handleMenuClick}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        p: 2,
                        mt: 0,
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
                {loading && writers.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : writers.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            AI작가 즐겨찾기 항목이 없습니다.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <CategoryGrid title="" time="" articles={writers} />
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}

export default AiAuthorBookmarkPage; 