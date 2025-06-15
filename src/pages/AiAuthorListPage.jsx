import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar, CircularProgress } from '@mui/material';
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
                setAuthors(res.data.data.authors.map(a => ({ ...a, isSubscribed: a.isSubscribed || false })));
            } catch (e) {
                setAuthors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    // 구독 버튼 클릭 핸들러
    const handleSubscribe = async (authorId, isSubscribed) => {
        if (!isLoggedIn) {
            setLoginModalOpen(true);
            return;
        }
        try {
            await TokenAxios.post(`/api/v2/ai-authors/${authorId}/subscriptions`);
            setAuthors(authors =>
                authors.map(a =>
                    a.id === authorId ? { ...a, isSubscribed: !isSubscribed } : a
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
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                AI작가목록
            </Typography>
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
                >
                    <Avatar
                        src={author.profileImageUrl}
                        sx={{ width: 56, height: 56, mr: 2 }}
                        onClick={() => navigate(`/ai-authors/${author.id}`)}
                    />
                    <Box
                        sx={{ flex: 1 }}
                        onClick={() => navigate(`/ai-authors/${author.id}`)}
                    >
                        <Typography sx={{ fontWeight: 600 }}>{author.name}</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: author.isSubscribed ? '#fff' : '#222',
                            color: author.isSubscribed ? '#222' : '#fff',
                            border: '1px solid #222',
                            borderRadius: 2,
                            minWidth: 56,
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: author.isSubscribed ? '#f5f5f5' : '#111',
                            }
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            handleSubscribe(author.id, author.isSubscribed);
                        }}
                    >
                        {author.isSubscribed ? '구독중' : '구독'}
                    </Button>
                </Box>
            ))}
            <MoveLogin open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </Box>
    );
}

export default AiAuthorListPage; 