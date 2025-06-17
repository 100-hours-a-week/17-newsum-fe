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

function KeywordBookmarkPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('키워드 즐겨찾기');
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [webtoons, setWebtoons] = useState([]);
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
        navigate('/keyword-add');
    };

    const handleDeleteBookmark = () => {
        setMenuOpen(false);
        // 북마크 삭제 로직 구현
    };

    const fetchWebtoons = useCallback(async (cursor = null) => {
        if (!isLoggedIn) {
            setLoading(false);
            setLoginModalOpen(true);
            return;
        }

        try {
            setLoading(true);
            const params = { size: 10 };
            if (cursor) params.cursor = cursor;

            const response = await TokenAxios.get('/api/v1/users/keywords/webtoons', { params });
            const data = response.data?.data;

            if (cursor) {
                setWebtoons(prev => [...prev, ...data.webtoons]);
            } else {
                setWebtoons(data.webtoons);
            }
            setPageInfo(data.pageInfo);
        } catch (err) {
            console.error('키워드 기반 웹툰 목록 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchWebtoons();
    }, [fetchWebtoons]);

    const handleScroll = useCallback(() => {
        if (loading || !pageInfo?.hasNext) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 100) {
            fetchWebtoons(pageInfo.nextCursor);
        }
    }, [loading, pageInfo, fetchWebtoons]);

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

            <MoveLogin open={loginModalOpen} onClose={() => setLoginModalOpen(false)} from={location.pathname} />

            {/* 컨텐츠 영역 */}
            <Container maxWidth="lg" sx={{ overflowX: 'hidden', pt: 2 }}>
                {loading && webtoons.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : webtoons.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            키워드 즐겨찾기 항목이 없습니다.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <CategoryGrid title="" time="" articles={webtoons} />
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

export default KeywordBookmarkPage; 