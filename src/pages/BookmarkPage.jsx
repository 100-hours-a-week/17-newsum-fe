import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Container } from '@mui/material';
import TokenAxios from '../api/TokenAxios';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import MoveLogin from '../components/modal/MoveLogin';
import CategoryGrid from '../components/grid/CategoryGrid';

function BookmarkPage() {
    const [bookmarkedWebtoons, setBookmarkedWebtoons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();
    const location = useLocation();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [pageInfo, setPageInfo] = useState(null);

    const fetchBookmarkedWebtoons = useCallback(async (cursor = null) => {
        if (!isLoggedIn) {
            setLoading(false);
            setLoginModalOpen(true);
            return;
        }

        try {
            setLoading(true);
            const params = {
                size: 10
            };
            // 첫 페이지가 아니고, 커서가 있을 때만 커서 파라미터 추가
            if (cursor && bookmarkedWebtoons.length > 0) {
                params.cursor = cursor;
            }

            const response = await TokenAxios.get('/api/v1/users/favorites/webtoons', { params });
            console.log('북마크 응답:', response.data);

            const { data } = response.data;
            if (!data) {
                console.error('응답 데이터가 없습니다:', response.data);
                return;
            }

            const newWebtoons = data.webtoons || [];
            const newPageInfo = data.pageInfo || null;

            if (cursor) {
                setBookmarkedWebtoons(prev => [...prev, ...newWebtoons]);
            } else {
                setBookmarkedWebtoons(newWebtoons);
            }
            setPageInfo(newPageInfo);
        } catch (err) {
            console.error('북마크 목록 로딩 중 오류:', err);
            setError(err.message || '북마크 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, bookmarkedWebtoons.length]);

    useEffect(() => {
        fetchBookmarkedWebtoons();
    }, [fetchBookmarkedWebtoons]);

    const handleScroll = useCallback(() => {
        if (loading || !pageInfo?.hasNext) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 100) {
            fetchBookmarkedWebtoons(pageInfo.nextCursor);
        }
    }, [loading, pageInfo, fetchBookmarkedWebtoons]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (loading && bookmarkedWebtoons.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 1 }}>
                {bookmarkedWebtoons.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            북마크한 웹툰이 없습니다.
                        </Typography>
                    </Box>
                ) : (
                    <CategoryGrid
                        title="북마크한 웹툰"
                        time=""
                        articles={bookmarkedWebtoons}
                    />
                )}
                {loading && bookmarkedWebtoons.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Box>

            <MoveLogin
                open={loginModalOpen}
                onCancel={() => setLoginModalOpen(false)}
                from={location.pathname}
            />
        </Container>
    );
}

export default BookmarkPage; 