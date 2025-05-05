// src/services/articleApi.js

// --- 임시 목업 데이터 (상세 내용 및 parentId 포함) ---
// JavaScript에서는 타입을 명시하지 않습니다.
const mockArticles = [
  {
    id: '1',
    title: '우리가 사랑한 영웅, 이순신',
    summary: '인공지능 기술이 뉴스 소비 패턴을 어떻게 바꾸고 있는지...',
    thumbnailUrl: 'https://sinsa-image.s3.ap-northeast-2.amazonaws.com/01.jpg',
    source: 'AI 타임즈',
    publishedAt: '2025-04-15T10:00:00Z',
    category: 'IT/과학',
    viewCount: 108000,
    content: '<h3>AI 기반 뉴스 소비의 변화</h3><p>최근 몇 년간 인공지능(AI) 기술은 미디어 산업... (이하 생략, 이전 내용 참고)'
  },
  {
    id: '2',
    title: '걸어서 템플로',
    summary: '세계 경제가 직면한 주요 이슈와 다가올 분기의 경제 성장률...',
    thumbnailUrl: 'https://sinsa-image.s3.ap-northeast-2.amazonaws.com/02.jpg',
    source: '글로벌 이코노미',
    publishedAt: '2025-04-15T09:30:00Z',
    category: '경제',
    viewCount: 214200,
    content: '<h4>주요 경제 지표 분석</h4><p>최근 발표된 주요 경제 지표들은 혼조세를... (이하 생략, 이전 내용 참고)'
  },
  {
    id: '3',
    title: '워킹데드 오상이',
    summary: '따뜻한 봄날, 가족 또는 연인과 함께 떠나기 좋은 국내 숨겨진 명소...',
    thumbnailUrl: 'https://sinsa-image.s3.ap-northeast-2.amazonaws.com/03.jpg',
    source: '여행 매거진',
    publishedAt: '2025-04-14T15:00:00Z',
    category: '라이프',
    viewCount: 110300,
    content: '<p>봄의 정취를 만끽할 수 있는... (이하 생략)'
  },
  {
    id: '4',
    title: '우주패스를 구독했더니',
    summary: '지구를 지키는 일상 속 작은 습관들. 누구나 쉽게 따라 할 수 있는...',
    thumbnailUrl: 'https://sinsa-image.s3.ap-northeast-2.amazonaws.com/04.jpg',
    source: '그린 포스트',
    publishedAt: '2025-04-13T18:00:00Z',
    category: '사회',
    viewCount: 88700,
    content: '<p>일상에서 쉽게 실천할 수 있는... (이하 생략)'
  },
  {
    id: '5',
    title: '에버소울: 영혼의 시작점',
    summary: '시장 안정화를 위한 새로운 부동산 정책이 발표되었습니다...',
    thumbnailUrl: 'https://sinsa-image.s3.ap-northeast-2.amazonaws.com/05.jpg',
    source: '대한 뉴스',
    publishedAt: '2025-04-15T11:00:00Z',
    category: '정치',
    viewCount: 125400,
    content: '<p>정부는 오늘 새로운 부동산 안정화... (이하 생략)'
  },
  {
    id: '6',
    title: '아가일 스페셜 웹툰',
    summary: '폴더블부터 롤러블까지, 최신 스마트폰 기술 동향을 살펴봅니다...',
    thumbnailUrl: '',
    source: '테크 리뷰',
    publishedAt: '2025-04-15T12:00:00Z',
    category: 'IT/과학',
    viewCount: 98900,
    content: '<p>스마트폰 시장의 최신 기술... (이하 생략)'
  },
];

// --- 기사 목록 함수 ---
export const fetchArticles = async (page = 1, limit = 10, category = 'all') => {
  console.log(`Workspaceing articles - page: ${page}, limit: ${limit}, category: ${category}`);
  await new Promise(resolve => setTimeout(resolve, 500));

  const filteredArticles = category === 'all'
    ? mockArticles
    : mockArticles.filter(article => article.category === category);

  const totalCount = filteredArticles.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  // content 필드 제외하고 반환 (JavaScript 구조 분해 할당 활용)
  const paginatedArticles = filteredArticles.slice(start, end).map(({ content, ...summary }) => summary);

  return { articles: paginatedArticles, totalCount: totalCount };
};

// --- 상세 기사 함수 ---
export const fetchArticleById = async (id) => {
  console.log(`Workspaceing article detail for id: ${id}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const article = mockArticles.find(article => article.id === id);
  return article || null;
};