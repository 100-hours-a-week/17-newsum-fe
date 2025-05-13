import { createTheme } from '@mui/material/styles';

// 이전 테마 설정 내용을 JavaScript 객체로 가져옵니다.
const PRIMARY_COLOR = '#673AB7';
const SECONDARY_COLOR = '#9575CD';
const BACKGROUND_DEFAULT = '#F4F6F8';
const BACKGROUND_PAPER = '#FFFFFF';
const TEXT_PRIMARY = '#212121';
const TEXT_SECONDARY = '#757575';

const theme = createTheme({
  palette: {
    primary: { main: PRIMARY_COLOR },
    secondary: { main: SECONDARY_COLOR },
    background: { default: BACKGROUND_DEFAULT, paper: BACKGROUND_PAPER },
    text: { primary: TEXT_PRIMARY, secondary: TEXT_SECONDARY },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: { /* ... 이전 설정과 동일 (타입 제거) ... */
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: { root: { backgroundColor: BACKGROUND_PAPER, borderBottom: `1px solid rgba(0, 0, 0, 0.12)` }, colorInherit: { color: TEXT_PRIMARY } }
    },
    MuiButton: { /* ... 이전 설정과 동일 (타입 제거) ... */
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { textTransform: 'none' } }
    },
    MuiCard: { /* ... 이전 설정과 동일 (타입 제거) ... */
        defaultProps: { elevation: 1 },
        styleOverrides: { root: { borderRadius: 12 } }
    },
    MuiPaper: { /* ... 이전 설정과 동일 (타입 제거) ... */
        defaultProps: { elevation: 1 }
    },
    MuiTabs: { /* ... 이전 설정과 동일 (타입 제거) ... */
         styleOverrides: { indicator: { height: '3px' } }
    },
    MuiTab: { /* ... 이전 설정과 동일 (타입 제거) ... */
         styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } }
    }
  },
});

export default theme; 