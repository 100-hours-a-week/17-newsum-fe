import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import TokenAxios from '../api/TokenAxios';
import DefaultAxios from '../api/DefaultAxios';
import { useAuth } from '../contexts/AuthContext';
import MoveLogin from '../components/modal/MoveLogin';
import CategoryGrid from '../components/grid/CategoryGrid';

function AiAuthorDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [subscribing, setSubscribing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const axiosInstance = isLoggedIn ? TokenAxios : DefaultAxios;
                const res = await axiosInstance.get(`/api/v2/ai-authors/${id}`);
                setAuthor(res.data.data);
                setIsSubscribed(res.data.data.isSubscribed ?? false);
                setSubscriberCount(res.data.data.subscriberCount ?? 0);
            } catch (e) {
                console.error("AI 작가 상세 정보 조회 실패:", e);
                setAuthor(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, isLoggedIn]);

    const handleSubscribe = async () => {
        if (!isLoggedIn) {
            setLoginModalOpen(true);
            return;
        }
        if (subscribing) return;
        setSubscribing(true);
        try {
            await TokenAxios.post(`/api/v2/ai-authors/${id}/subscriptions`);
            setIsSubscribed(prev => !prev);
            setSubscriberCount(count => count + (isSubscribed ? -1 : 1));
        } catch (e) {
            console.error("구독 상태 변경 실패:", e);
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }
    if (!author) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>작가 정보를 불러올 수 없습니다.</Box>;
    }

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', p: 2 }}>
            {/* 상단 헤더 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, height: 44 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ p: 0.5 }}>
                    <ArrowBackIcon sx={{ fontSize: '1.5rem' }} />
                </IconButton>
                <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                    AI작가상세페이지
                </Typography>
                <Box sx={{ width: 40 }} />
            </Box>
            {/* 프로필, 이름, 스타일, 소개 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar src={author.profileImageUrl} sx={{ width: 80, height: 80, mb: 1 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>{author.name}</Typography>
                <Typography sx={{ color: '#888', fontSize: '0.95rem', mb: 0.5 }}>{author.style}</Typography>
                <Typography sx={{ color: '#444', fontSize: '0.98rem', mb: 1, textAlign: 'center' }}>
                    {author.introduction}
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: isSubscribed ? '#fff' : '#222',
                        color: isSubscribed ? '#222' : '#fff',
                        border: '1px solid #222',
                        borderRadius: 2,
                        minWidth: 100,
                        fontWeight: 600,
                        mb: 0.5,
                        '&:hover': {
                            bgcolor: isSubscribed ? '#f5f5f5' : '#111',
                        }
                    }}
                    onClick={handleSubscribe}
                    disabled={subscribing}
                >
                    {isSubscribed ? '구독중' : '구독하기'}
                </Button>
            </Box>
            {/* 작성한 뉴스(웹툰) 리스트 */}
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', mb: 1, mt: 2 }}>작성한 뉴스</Typography>
            <CategoryGrid title="" articles={author.webtoons || []} />
            {(!author.webtoons || author.webtoons.length === 0) && (
                <Typography sx={{ color: '#aaa', textAlign: 'center', mt: 2 }}>작성한 뉴스가 없습니다.</Typography>
            )}
            <MoveLogin open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </Box>
    );
}

export default AiAuthorDetailPage; 