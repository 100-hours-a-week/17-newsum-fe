// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react'; // useCallback import
import { Typography, Container, Box, Grid, CircularProgress, Alert, Tabs, Tab, Pagination } from '@mui/material';
import { ArticleSummary } from '../types/article';
import { fetchArticles } from '../services/articleApi';
import ArticleCard from '../components/article/ArticleCard'; // 경로 확인!

// 표시할 카테고리 목록 정의 (value는 API 파라미터 또는 필터링에 사용할 값)
const categories = [
  { value: 'all', label: '전체' },
  { value: '정치', label: '정치' },
  { value: '경제', label: '경제' },
  { value: '사회', label: '사회' },
  { value: 'IT/과학', label: 'IT/과학' },
  { value: '라이프', label: '라이프' },
  // { value: '스포츠', label: '스포츠'}, // 필요시 추가
];

const ITEMS_PER_PAGE = 6; // 페이지당 표시할 기사 수를 상수로 정의 (예: 6개)

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // 현재 선택된 탭의 value를 저장하는 상태 (기본값은 categories 배열의 첫번째 항목)
  const [activeTab, setActiveTab] = useState<string>(categories[0].value);
  // --- 페이지네이션 상태 추가 ---
  const [page, setPage] = useState<number>(1); // 현재 페이지 번호 (기본값 1)
  const [totalCount, setTotalCount] = useState<number>(0); // 총 기사 수

  // 총 페이지 수 계산 (totalCount와 ITEMS_PER_PAGE 기반)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 데이터를 불러오는 함수 (useCallback 사용: activeTab 변경 시 함수 재생성 방지)
  const loadArticles = useCallback(async (category: string) => {
    try {
      setLoading(true); // 로딩 시작
      setError(null);   // 이전 에러 초기화
      console.log(`Requesting category: ${category}`); // 요청 카테고리 로그
      // 선택된 카테고리로 API 함수 호출 (페이지는 일단 1로 고정)
      const response = await fetchArticles(1, ITEMS_PER_PAGE, category);
      setArticles(response.articles); // 받아온 데이터로 상태 업데이트
      // setTotalCount(response.totalCount); // 페이지네이션 시 사용
    } catch (err) {
      // 에러 처리
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching articles.');
      }
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false); // 로딩 종료 (성공/실패 여부 무관)
    }
  }, []); // 이 함수는 마운트 시 한 번만 생성됨

  /// 탭 또는 페이지 변경 시 데이터 로드
  useEffect(() => {
    // 컴포넌트 마운트 또는 탭/페이지 변경 시 해당 카테고리의 해당 페이지 로드
    loadArticles(activeTab, page);
  }, [activeTab, page, loadArticles]); // page를 의존성 배열에 추가

  // 탭 변경 핸들러 (페이지 1로 리셋 추가)
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setPage(1); // ★★★ 탭 변경 시 무조건 1페이지로 이동 ★★★
  };

  // --- 페이지 변경 핸들러 추가 ---
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // 사용자가 선택한 페이지 번호로 상태 업데이트
    // (선택 사항) 페이지 변경 시 스크롤을 위로 이동시키는 로직
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* 카테고리 탭 영역 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}> {/* 탭 아래 구분선 */}
          <Tabs
            value={activeTab} // 현재 활성화된 탭 지정
            onChange={handleTabChange} // 탭 변경 시 호출될 함수 연결
            variant="scrollable" // 탭 개수가 많아지면 좌우 스크롤 가능
            scrollButtons="auto" // 스크롤 버튼 자동 표시 (필요할 때만)
            allowScrollButtonsMobile // 모바일에서도 스크롤 버튼 사용
            aria-label="News categories"
          >
            {/* categories 배열을 순회하며 Tab 컴포넌트 렌더링 */}
            {categories.map((cat) => (
              <Tab key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Tabs>
        </Box>

        {/* 로딩 상태 표시 */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* 에러 상태 표시 */}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {/* 기사 목록 또는 "뉴스 없음" 메시지 표시 */}
        {!loading && !error && (
          <Grid container spacing={3}>
            {articles.length > 0 ? (
              articles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <ArticleCard article={article} />
                </Grid>
              ))
            ) : (
              // 현재 카테고리에 기사가 없을 경우
              <Grid item xs={12}>
                <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                  '{categories.find(c => c.value === activeTab)?.label}' 카테고리에 표시할 뉴스가 없습니다.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* --- 페이지네이션 컴포넌트 추가 --- */}
        {/* 로딩 중 아닐 때, 에러 없을 때, 전체 페이지가 1보다 클 때만 표시 */}
        {!loading && !error && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}> {/* 위아래 패딩 추가 */}
            <Pagination
              count={totalPages} // 전체 페이지 수
              page={page} // 현재 활성화된 페이지 번호
              onChange={handlePageChange} // 페이지 번호 클릭 시 호출될 함수
              color="primary" // MUI 테마의 primary 색상 사용
              size="large" // 페이지네이션 크기 (small, medium, large)
              showFirstButton // '맨 처음' 버튼 표시 여부
              showLastButton // '맨 마지막' 버튼 표시 여부
              // boundaryCount={2} // 양 끝에 항상 표시할 페이지 수
              // siblingCount={1} // 현재 페이지 양 옆에 표시할 페이지 수 (기본값 1)
            />
          </Box>
        )}

      </Box>
    </Container>
  );
};

export default HomePage;