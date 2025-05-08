import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import RecentGrid from '../components/grid/RecentGrid';
import TokenAxios from '../api/TokenAxios';

function RecentPage() {
  const navigate = useNavigate();
  const [recentData, setRecentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await TokenAxios.get('/api/v1/users/webtoons/recent');
        setRecentData(res.data?.data?.webtoons || {});
      } catch (e) {
        setError('최근 본 웹툰을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box sx={{ pb: 7 }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} edge="start"><ArrowBackIcon /></IconButton>
        <Typography variant="subtitle1" component="h1" sx={{ ml: 1, flexGrow: 1, fontWeight: 'bold' }}>최근 본 뉴스</Typography>
      </Box>
      <RecentGrid webtoonsByDate={recentData} />
    </Box>
  );
}

export default RecentPage;