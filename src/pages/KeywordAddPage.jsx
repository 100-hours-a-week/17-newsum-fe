import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
    Button,
    InputBase,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/Layout/BottomNav';

const MAX_KEYWORDS = 20;

function KeywordAddPage() {
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState(['머스크', '엔비디아']);
    const [input, setInput] = useState('');

    const handleBack = () => {
        navigate(-1);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleAdd = () => {
        if (input.trim() && keywords.length < MAX_KEYWORDS) {
            setKeywords([...keywords, input.trim()]);
            setInput('');
        }
    };

    const handleRemove = (idx) => {
        setKeywords(keywords.filter((_, i) => i !== idx));
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
                        fontWeight: 500,
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
                        sx={{ ml: 'auto', borderRadius: 2, minWidth: 56, height: 32, fontWeight: 500 }}
                        onClick={handleAdd}
                        disabled={!input.trim() || keywords.length >= MAX_KEYWORDS}
                    >
                        추가
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        pb: 0.5,
                    }}
                >
                    <InputBase
                        placeholder="예) 삼성전자"
                        value={input}
                        onChange={handleInputChange}
                        inputProps={{ maxLength: 20 }}
                        sx={{ flex: 1, fontSize: '1rem', color: '#aaa' }}
                    />
                    <Typography sx={{ color: '#aaa', fontSize: '0.95rem', ml: 1 }}>
                        {input.length}/20
                    </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                {/* 키워드 리스트 */}
                {keywords.map((kw, idx) => (
                    <Box
                        key={kw + idx}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #eee',
                            py: 1,
                            fontSize: '1.1rem',
                        }}
                    >
                        <Typography sx={{ flex: 1, fontSize: '1.1rem', color: '#222' }}>{kw}</Typography>
                        <IconButton onClick={() => handleRemove(idx)} size="small">
                            <CloseIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                    </Box>
                ))}
            </Container>
            <BottomNav />
        </Box>
    );
}

export default KeywordAddPage; 