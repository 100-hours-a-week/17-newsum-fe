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
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const fetchAuthors = useCallback(async () => {
        if (!isLoggedIn) {
            setLoading(false);
            setLoginModalOpen(true);
            return;
        }

        try {
            setLoading(true);
            const response = await TokenAxios.get('/api/v1/users/favorite/ai-authors');
            const data = response.data?.data;

            setAuthors(data || []);
        } catch (err) {
            console.error('AI작가 즐겨찾기 로딩 오류:', err);
            setAuthors([]);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    const handleAuthorClick = (authorId) => {
        navigate(`/ai-authors/${authorId}`);
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
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : authors.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            AI작가 즐겨찾기 항목이 없습니다.
                        </Typography>
                    </Box>
                ) : (
                    authors.map(author => (
                        <Box key={author.id} sx={{ mb: 4 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 0.8 },
                                }}
                                onClick={() => handleAuthorClick(author.id)}
                            >
                                <Box
                                    component="img"
                                    src={author.profileImageUrl || '/path/to/default/profile.png'}
                                    alt={author.name}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        mr: 1,
                                        objectFit: 'cover',
                                        border: '1px solid #eee'
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {author.name}
                                </Typography>
                            </Box>
                            {author.webtoons && author.webtoons.length > 0 ? (
                                <CategoryGrid articles={author.webtoons} />
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                                    작성한 웹툰이 없습니다.
                                </Typography>
                            )}
                        </Box>
                    ))
                )}
            </Container>
        </Box>
    );
}

export default AiAuthorBookmarkPage; 