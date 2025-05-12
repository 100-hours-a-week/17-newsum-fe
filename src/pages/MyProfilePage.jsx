import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Avatar, IconButton, Modal } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import logoutLogo from '../assets/logout_logo.jpeg';

function MyProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState('');
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUser(userObj);
      setProfileImg(userObj.profileImageUrl || '');
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const handleLogoutClick = () => setOpen(true);

  const handleLogout = () => {
    setOpen(false);
    localStorage.removeItem('profileImage');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate(-1);
  };

  const handleCancel = () => setOpen(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0 }}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative', height: 60, mb: 2, borderBottom: '1px solid #eee' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }}>
          사용자 정보
        </Typography>
      </Box>

      <Avatar
        src={profileImg}
        alt={user?.nickname || '프로필'}
        sx={{
          width: 100,
          height: 100,
          margin: '24px auto 0 auto',
          border: '2px solid #eee',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          cursor: 'default',
        }}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 0.5, fontWeight: 600, textAlign: 'center' }}>
        {user?.nickname || '이름 없음'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center' }}>
        {user?.email || '이메일 없음'}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 320, mt: 2 }}>
        <Button fullWidth variant="outlined" onClick={handleEdit} sx={{ mb: 2, bgcolor: '#fff', color: '#111', borderColor: '#111', fontWeight: 500, borderRadius: 2, '&:hover': { bgcolor: '#f5f5f5', borderColor: '#111' } }}>
          회원정보 수정
        </Button>
        <Button fullWidth variant="outlined" onClick={handleLogoutClick} sx={{ bgcolor: '#fff', color: '#111', borderColor: '#111', fontWeight: 500, borderRadius: 2, '&:hover': { bgcolor: '#d32f2f', color: '#fff', borderColor: '#d32f2f' } }}>
          로그아웃
        </Button>
      </Box>

      <Modal open={open} onClose={handleCancel}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#fff', borderRadius: 3, boxShadow: 24, p: 4, width: 320, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', outline: 'none' }}>
          <Box component="img" src={logoutLogo} alt="Logout Logo" sx={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18, mb: 4, mt: 1 }}>
            로그아웃할거야 멍?
          </Typography>
          <Button fullWidth variant="contained" onClick={handleLogout} sx={{ bgcolor: '#111', color: '#fff', fontWeight: 600, borderRadius: 2, mb: 1.5, '&:hover': { bgcolor: '#d32f2f', color: '#fff' } }}>
            로그아웃
          </Button>
          <Button fullWidth variant="outlined" onClick={handleCancel} sx={{ bgcolor: '#fff', color: '#111', borderColor: '#111', fontWeight: 600, borderRadius: 2, '&:hover': { bgcolor: '#f5f5f5', borderColor: '#111' } }}>
            취소
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default MyProfilePage;