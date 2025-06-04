import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
    Button,
    InputBase,
    Divider,
    Modal
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/Layout/BottomNav';
import TokenAxios from '../api/TokenAxios';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import logoutLogo from '../assets/logout_logo.jpeg';
import InfoAlertModal from '../components/modal/InfoAlertModal';

const MAX_KEYWORDS = 20;

function KeywordAddPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [keywords, setKeywords] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.length > 20) {
            value = value.slice(0, 20);
        }
        setInput(value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const fetchKeywords = async () => {
        try {
            const res = await TokenAxios.get('/api/v1/users/keywords/subscriptions');
            setKeywords(res.data.data.keywords || []);
        } catch (e) {
            setKeywords([]);
        }
    };

    useEffect(() => {
        fetchKeywords();
    }, []);

    const handleAdd = async () => {
        if (loading) return;
        if (!input.trim() || keywords.length >= MAX_KEYWORDS || input.length > 20) return;
        setLoading(true);
        try {
            const res = await TokenAxios.post('/api/v1/users/keywords/subscriptions', { keyword: input.trim() });
            if (res.data?.code === 200) {
                await fetchKeywords();
                setInput('');
            } else {
                Swal.fire({ icon: 'error', text: res.data?.message || '키워드 추가에 실패했습니다.' });
            }
        } catch (err) {
            if (err.response?.data?.message && err.response.data.message.includes('이미 구독')) {
                setDuplicateModalOpen(true);
            } else if (err.response?.data?.message) {
                Swal.fire({ icon: 'error', text: err.response.data.message });
            } else {
                Swal.fire({ icon: 'error', text: '키워드 추가에 실패했습니다.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (idx, keywordId) => {
        try {
            await TokenAxios.delete(`/api/v1/users/keywords/${keywordId}`);
            setKeywords(keywords.filter((_, i) => i !== idx));
        } catch (e) {
            Swal.fire({ icon: 'error', text: '키워드 삭제에 실패했습니다.' });
        }
    };

    return (
        <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: '#fff' }}>
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
                <Typography
                    variant="h6"
                    sx={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                    }}
                >
                    키워드 추가
                </Typography>
                <Box sx={{ width: 40 }} />
            </Box>

            {/* 키워드 입력 및 추가 */}
            <Container maxWidth="lg" sx={{ pt: 4, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>
                        키워드({keywords.length}/{MAX_KEYWORDS})
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        type="button"
                        sx={{
                            ml: 'auto',
                            borderRadius: 2,
                            minWidth: 56,
                            height: 32,
                            fontWeight: 500,
                            borderColor: '#222',
                            color: '#222',
                            backgroundColor: '#fff',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: '#222',
                                color: '#fff',
                                borderColor: '#222',
                            },
                        }}
                        onClick={handleAdd}
                        disabled={!input.trim() || keywords.length >= MAX_KEYWORDS || loading || input.length > 20}
                    >
                        추가
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0,
                        pb: 0.5,
                    }}
                >
                    <InputBase
                        placeholder="예) 삼성전자"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        inputProps={{ maxLength: 20 }}
                        sx={{ flex: 1, fontSize: '1rem', color: '#aaa' }}
                    />
                    <Typography sx={{ color: '#aaa', fontSize: '0.95rem', ml: 1 }}>
                        {input.length}/20
                    </Typography>
                </Box>
                <Divider sx={{ mb: 0.5 }} />
                {input.length === 20 && (
                    <Typography sx={{ color: 'error.main', fontSize: '0.95rem', mb: 1, ml: 0.5 }}>
                        20자 이상은 불가능합니다!
                    </Typography>
                )}
                {/* 키워드 리스트 */}
                {keywords.map((kw, idx) => (
                    <Box
                        key={kw.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #eee',
                            py: 1,
                            fontSize: '1.1rem',
                        }}
                    >
                        <Typography sx={{ flex: 1, fontSize: '1.1rem', color: '#222' }}>{kw.content}</Typography>
                        <IconButton onClick={() => handleRemove(idx, kw.id)} size="small">
                            <CloseIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                    </Box>
                ))}
            </Container>
            <BottomNav />

            {/* 중복 키워드 안내 모달 */}
            <InfoAlertModal
                open={duplicateModalOpen}
                onClose={() => setDuplicateModalOpen(false)}
                message="이미 구독한 키워드입니다!"
                autoCloseMs={1000}
            />
        </Box>
    );
}

export default KeywordAddPage; 