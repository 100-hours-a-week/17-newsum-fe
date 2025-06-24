import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Container, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import DefaultAxios from '../api/DefaultAxios';
import CategoryGrid from '../components/grid/CategoryGrid';

function TodayWebtoonsPage() {
    const navigate = useNavigate();
    const [webtoons, setWebtoons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodayWebtoons = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await DefaultAxios.get('/api/v1/webtoons/todayWebtoons');
                setWebtoons(res.data?.data?.TodayWebtoons || []);
            } catch (e) {
                setError('오늘의 웹툰을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchTodayWebtoons();
    }, []);

    return (
        <Box sx={{ pb: 7 }}>
            <Box sx={{ position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBackIcon /></IconButton>
                <Typography variant="subtitle1" component="h1" sx={{ ml: 1, flexGrow: 1, fontWeight: 'bold', textAlign: 'center' }}>오늘의 웹툰</Typography>
                <Box sx={{ width: 35, height: 35, ml: 1 }} />
            </Box>
            <Container maxWidth="lg" sx={{ overflowX: 'hidden', pt: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                ) : webtoons.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            오늘 생성된 웹툰이 없습니다.
                        </Typography>
                    </Box>
                ) : (
                    <CategoryGrid title="" articles={webtoons} />
                )}
            </Container>
        </Box>
    );
}

export default TodayWebtoonsPage; 