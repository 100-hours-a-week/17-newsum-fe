import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Modal } from '@mui/material';
import logoutLogo from '../../assets/logout_logo.jpeg';

function MoveLogin({ open, onCancel }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <Modal
            open={open}
            onClose={onCancel}
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#fff',
                    borderRadius: 3,
                    boxShadow: 24,
                    width: 320,
                    height: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    outline: 'none'
                }}
            >
                <Box
                    component="img"
                    src={logoutLogo}
                    alt="로그인"
                    sx={{
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        mb: 2
                    }}
                />
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: 18,
                        textAlign: 'center'
                    }}
                >
                    로그인이 필요합니다!<br />
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3, width: '100%', maxWidth: 200 }}>
                    <Button
                        onClick={handleLogin}
                        variant="contained"
                        sx={{
                            bgcolor: '#111',
                            color: '#fff',
                            borderRadius: 2,
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: '#333'
                            }
                        }}
                    >
                        로그인
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant="outlined"
                        sx={{
                            borderColor: '#111',
                            color: '#111',
                            borderRadius: 2,
                            fontWeight: 600,
                            '&:hover': {
                                borderColor: '#111',
                                bgcolor: '#f5f5f5'
                            }
                        }}
                    >
                        취소
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default MoveLogin; 