import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function MyProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    // 세션스토리지에서 유저 정보 불러오기
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    // 로컬스토리지에서 이미지 불러오기
    const localImg = localStorage.getItem('profileImage');
    if (localImg) setProfileImg(localImg);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleEdit = () => {
    // 회원정보 수정 페이지로 이동 (추후 구현)
    alert('회원정보 수정 기능은 준비중입니다.');
  };

  // 프로필 이미지 클릭 시 파일 선택창 열기
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 이미지 저장
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImg(ev.target.result);
      localStorage.setItem('profileImage', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 0,
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          height: 60,
          mb: 2,
          borderBottom: '1px solid #eee',
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            letterSpacing: 1,
          }}
        >
          사용자 정보
        </Typography>
      </Box>

      {/* 프로필 사진 (클릭 시 파일 선택) */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Avatar
        src={profileImg || user?.profileImage || ''}
        alt={user?.name || '프로필'}
        sx={{
          width: 100,
          height: 100,
          margin: '24px auto 0 auto',
          border: '2px solid #eee',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          cursor: 'pointer',
        }}
        onClick={handleAvatarClick}
      />

      {/* 이름, 이메일 */}
      <Typography variant="h6" sx={{ mt: 3, mb: 0.5, fontWeight: 600, textAlign: 'center' }}>
        {user?.name || '이름 없음'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center' }}>
        {user?.email || '이메일 없음'}
      </Typography>

      {/* 버튼 영역 */}
      <Box sx={{ width: '100%', maxWidth: 320, mt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleEdit}
          sx={{
            mb: 2,
            bgcolor: '#fff',
            color: '#111',
            borderColor: '#111',
            fontWeight: 500,
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#f5f5f5',
              borderColor: '#111',
            },
          }}
        >
          회원정보 수정
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleLogout}
          sx={{
            bgcolor: '#fff',
            color: '#d32f2f',
            borderColor: '#d32f2f',
            fontWeight: 500,
            borderRadius: 2,
            '&:hover': {
              bgcolor: '#d32f2f',
              color: '#fff',
              borderColor: '#d32f2f',
            },
          }}
        >
          로그아웃
        </Button>
      </Box>
    </Box>
  );
}

export default MyProfilePage;
