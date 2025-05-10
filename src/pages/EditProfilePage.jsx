import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Avatar, IconButton, TextField, Modal, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import TokenAxios from '../api/TokenAxios';
import logoutLogo from '../assets/logout_logo.jpeg';

function EditProfilePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [open, setOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setNickname(parsed.nickname || '');
      setProfileImg(parsed.profileImageUrl || '/default-profile.png');
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imageDataUrl = ev.target.result;
      setProfileImg(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleClearNickname = () => setNickname('');

  const handleSave = async () => {
    try {
      const body = {
        nickname: nickname,
        profileImage: profileImg,
      };

      const response = await TokenAxios.patch('/api/v1/users/me', body);

      const updated = response.data.data;
      localStorage.setItem('userInfo', JSON.stringify(updated));
      setSuccessModalOpen(true);
      setTimeout(() => {
        setSuccessModalOpen(false);
        navigate(-1);
      }, 2000);
    } catch (e) {
      alert('저장 실패');
    }
  };

  const handleOpenWithdrawModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative', height: 60, mb: 2, borderBottom: '1px solid #eee' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }}>
          회원정보 수정
        </Typography>
      </Box>

      <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
      <Box sx={{ position: 'relative', mt: 2 }}>
        <Avatar
          src={profileImg || '/default-profile.png'}
          alt="프로필 이미지"
          sx={{ width: 100, height: 100, border: '2px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}
          onClick={handleAvatarClick}
        />
        <AddCircleIcon sx={{ position: 'absolute', right: -4, bottom: -4, color: '#888', fontSize: 28 }} />
      </Box>

      <Box sx={{ width: '100%', maxWidth: 320, mt: 4 }}>
        <Typography sx={{ fontWeight: 500, mb: 1 }}>닉네임을 입력해주세요</Typography>
        <TextField
          fullWidth
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          InputProps={{
            endAdornment: nickname && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearNickname}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'right', display: 'block', color: '#888' }}>{nickname.length}/16</Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 320, mt: 4 }}>
        <Button fullWidth variant="contained" onClick={handleSave} sx={{ bgcolor: '#111', color: '#fff', fontWeight: 600, borderRadius: 2 }}>
          회원정보 저장
        </Button>
        <Button fullWidth variant="outlined" onClick={handleOpenWithdrawModal} sx={{ mt: 2, borderColor: '#111', color: '#111', fontWeight: 600, borderRadius: 2 }}>
          회원탈퇴
        </Button>
      </Box>

      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#fff', borderRadius: 3, boxShadow: 24, p: 4, width: 320, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600, fontSize: 18, mb: 2 }}>
            해당 기능은 곧 추가될 예정입니다!
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" sx={{ bgcolor: '#111', color: '#fff', borderRadius: 2, fontWeight: 600 }}>
            확인
          </Button>
        </Box>
      </Modal>

      <Modal open={successModalOpen}>
        <Box sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#fff', borderRadius: 3, boxShadow: 24, width: 320, height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', outline: 'none' }}>
          <Box component="img" src={logoutLogo} alt="완료" sx={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>
            회원정보가<br />수정되었습니다!
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default EditProfilePage;