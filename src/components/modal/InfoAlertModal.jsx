import React, { useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import logoutLogo from '../../assets/logout_logo.jpeg';

function InfoAlertModal({ open, onClose, message, image, autoCloseMs }) {
    useEffect(() => {
        if (open && autoCloseMs) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseMs);
            return () => clearTimeout(timer);
        }
    }, [open, autoCloseMs, onClose]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
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
            }}>
                <Box
                    component="img"
                    src={image || logoutLogo}
                    alt="안내"
                    sx={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', mb: 2 }}
                />
                <Typography sx={{ fontWeight: 600, fontSize: 18, textAlign: 'center' }}>
                    {message}
                </Typography>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{ mt: 3, bgcolor: '#111', color: '#fff', borderRadius: 2, fontWeight: 600 }}
                >
                    확인
                </Button>
            </Box>
        </Modal>
    );
}

export default InfoAlertModal; 