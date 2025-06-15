import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import TokenAxios from '../api/TokenAxios';
import { useAuth } from '../contexts/AuthContext';
import MoveLogin from '../components/modal/MoveLogin';

function AiAuthorListPage() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            setLoading(true);
            try {
                const res = await TokenAxios.get('/api/v2/ai-authors?size=10');
                setAuthors(res.data.data.authors);
            } catch (e) {
                setAuthors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    // 구독 버튼 클릭 핸들러
    const handleSubscribe = async (authorId, subscribedStatus) => {
        if (!isLoggedIn) {
            setLoginModalOpen(true);
            return;
        }
        try {
            await TokenAxios.post(`/api/v2/ai-authors/${authorId}/subscriptions`);
            setAuthors(authors =>
                authors.map(a =>
                    a.id === authorId ? { ...a, subscribed: !subscribedStatus } : a
                )
            );
        } catch (e) {
            // 에러 처리 필요시 추가
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', p: 2 }}>
            {/* 상단 헤더 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, height: 44 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ p: 0.5 }}>
                    <ArrowBackIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
                <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                    AI작가목록
                </Typography>
                <Box sx={{ width: 40 }} /> {/* 오른쪽 여백 맞춤 */}
            </Box>
            {authors.length === 0 && (
                <Typography sx={{ textAlign: 'center', color: '#aaa', mt: 8 }}>
                    등록된 AI 작가가 없습니다.
                </Typography>
            )}
            {authors.map(author => (
                <Box
                    key={author.id}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 1,
                        borderRadius: 2,
                        border: '1px solid #eee',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f9f9f9' }
                    }}
                    onClick={() => navigate(`/ai-authors/${author.id}`)}
                >
                    <Avatar
                        src={author.profileImageUrl}
                        sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>{author.name}</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: author.subscribed ? '#fff' : '#222',
                            color: author.subscribed ? '#222' : '#fff',
                            border: '1px solid #222',
                            borderRadius: 2,
                            minWidth: 56,
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: author.subscribed ? '#f5f5f5' : '#111',
                            }
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            handleSubscribe(author.id, author.subscribed);
                        }}
                    >
                        {author.subscribed ? '구독중' : '구독'}
                    </Button>
                </Box>
            ))}
            <MoveLogin open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </Box>
    );
}

export default AiAuthorListPage; 