// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

// 사용할 색상 정의 (필요에 따라 조정)
const PRIMARY_COLOR = '#673AB7'; // 예시: MUI Deep Purple 500 계열 (이미지와 유사)
const SECONDARY_COLOR = '#9575CD'; // 예시: 조금 더 연한 보라색 (Deep Purple 300)
const BACKGROUND_DEFAULT = '#F4F6F8'; // 예시: 매우 연한 회색 배경 (이미지의 메인 배경과 유사)
const BACKGROUND_PAPER = '#FFFFFF'; // 예시: 카드, Paper 등은 흰색 배경
const TEXT_PRIMARY = '#212121'; // 예시: 거의 검은색 텍스트 (MUI Grey 900)
const TEXT_SECONDARY = '#757575'; // 예시: 중간 회색 텍스트 (MUI Grey 600)

const theme = createTheme({
  // 색상 팔레트 설정
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      // contrastText: '#ffffff', // 필요시 대비 색상 지정
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
    background: {
      default: BACKGROUND_DEFAULT, // 앱 전체 기본 배경색
      paper: BACKGROUND_PAPER,    // Paper, Card 등의 컴포넌트 배경색
    },
    text: {
      primary: TEXT_PRIMARY,     // 주 텍스트 색상
      secondary: TEXT_SECONDARY,   // 부가 텍스트 색상
    },
    divider: 'rgba(0, 0, 0, 0.12)', // 구분선 색상
  },

  // 타이포그래피 설정
  typography: {
    // 이전에 설정한 'Noto Sans KR' 폰트 유지 (index.css에 import 되어 있어야 함)
    fontFamily: '"Noto Sans KR", sans-serif',
    // 필요에 따라 h1~h6, body1, body2 등의 기본 스타일 조정 가능
    // 예시:
    // h5: { fontWeight: 700, fontSize: '1.5rem' },
    // body1: { fontSize: '0.95rem' },
  },

  // 컴포넌트 그림자(Elevation) 조정 (선택 사항)
  // shadows: [ ... 기본 그림자 배열 또는 커스텀 배열 ... ], // 좀 더 플랫하게 하려면 그림자 약하게 조정

  // 컴포넌트 모양 설정
  shape: {
    borderRadius: 8, // 전역 보더 라디우스 (기본값 4보다 약간 둥글게)
  },

  // 개별 컴포넌트 기본 스타일 재정의 (선택 사항)
  components: {
    // 예시: AppBar 스타일 조정
    MuiAppBar: {
      defaultProps: {
        elevation: 0, // 상단 바 그림자 제거 (플랫 디자인)
        color: 'inherit', // 배경색을 부모 요소로부터 상속 (흰색 배경에 검은 글씨 등)
      },
      styleOverrides: {
        root: {
           backgroundColor: BACKGROUND_PAPER, // AppBar 배경 흰색으로
           borderBottom: `1px solid rgba(0, 0, 0, 0.12)`, // 하단 구분선 추가
        },
        colorInherit: {
           color: TEXT_PRIMARY, // AppBar 텍스트 색상
        }
      }
    },
    // 예시: Button 스타일 조정
    MuiButton: {
      defaultProps: {
        disableElevation: true, // 버튼 기본 그림자 제거
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // 버튼 텍스트 대문자 변환 비활성화
          // borderRadius: 8, // 개별적으로도 설정 가능
        },
        containedPrimary: { // Primary 색상 Contained 버튼
          // color: '#ffffff', // 필요시 텍스트 색상 강제 지정
        },
      },
    },
    // 예시: Card 스타일 조정
    MuiCard: {
      defaultProps: {
        elevation: 1, // 카드 기본 그림자 약하게 (0~24)
      },
      styleOverrides: {
        root: {
           borderRadius: 12, // 카드 모서리 더 둥글게 (shape.borderRadius보다 우선)
        },
      },
    },
     // 예시: Paper 스타일 조정
     MuiPaper: {
        defaultProps: {
            elevation: 1, // Paper 기본 그림자 약하게
        },
         styleOverrides: {
             root: {
                // backgroundColor: BACKGROUND_PAPER, // 이미 palette에서 설정됨
             },
         },
     },
     // 예시: Tabs 스타일 조정
     MuiTabs: {
         styleOverrides: {
             indicator: { // 선택된 탭 아래 인디케이터
                 // backgroundColor: PRIMARY_COLOR, // 기본적으로 primary 사용
                 height: '3px',
             },
         }
     },
     MuiTab: {
         styleOverrides: {
             root: {
                 textTransform: 'none', // 탭 텍스트 대문자 변환 비활성화
                 fontWeight: 500, // 탭 텍스트 굵기
                 '&.Mui-selected': { // 선택된 탭 스타일
                     // color: PRIMARY_COLOR, // 기본적으로 primary 사용
                 },
             },
         }
     }
  },
});

export default theme;