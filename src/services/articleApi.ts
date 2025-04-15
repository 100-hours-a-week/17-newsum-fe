// src/services/articleApi.ts
import { ArticleSummary, ArticleDetail } from '../types/article'; // ArticleDetail import 추가

// --- 임시 목업 데이터 (content 필드 및 상세 내용 추가) ---
const mockArticles: ArticleDetail[] = [ // 타입을 ArticleDetail로 변경하고 content 추가
  {
    id: 'news001', title: 'AI가 분석한 최신 뉴스 트렌드', summary: '인공지능 기술이 뉴스 소비 패턴을 어떻게 바꾸고 있는지...', thumbnailUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-earth-light-light-effect-news-technology-blue-image_784111.jpg', source: 'AI 타임즈', publishedAt: '2025-04-15T10:00:00Z', category: 'IT/과학',
    content: '<h3>AI 기반 뉴스 소비의 변화</h3><p>최근 몇 년간 인공지능(AI) 기술은 미디어 산업, 특히 뉴스 소비 방식에 혁명적인 변화를 가져왔습니다. 개인 맞춤형 뉴스 추천 알고리즘은 사용자가 관심 있을 만한 기사를 선별하여 제공함으로써 정보 과잉 시대에 효율적인 뉴스 탐색을 가능하게 합니다.</p><p>또한, AI는 가짜 뉴스 판별에도 중요한 역할을 합니다. 자연어 처리(NLP) 기술을 통해 기사의 신뢰도를 분석하고, 출처의 평판을 평가하여 사용자에게 보다 검증된 정보를 제공하려는 노력이 이어지고 있습니다.</p><p>하지만 AI 기반 추천 시스템의 편향성 문제와 여론 형성의 불균형 등 해결해야 할 과제도 남아있습니다. 앞으로 AI와 미디어의 공존은 더욱 심화될 것이며, 기술의 발전과 함께 윤리적인 고민도 병행되어야 할 것입니다.</p>' // 상세 내용 추가
  },
  {
    id: 'news002', title: '글로벌 경제, 다음 분기 전망은?', summary: '세계 경제가 직면한 주요 이슈와 다가올 분기의 경제 성장률...', thumbnailUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-earth-light-light-effect-news-technology-blue-image_784111.jpg', source: '글로벌 이코노미', publishedAt: '2025-04-15T09:30:00Z', category: '경제',
    content: '<h4>주요 경제 지표 분석</h4><p>최근 발표된 주요 경제 지표들은 혼조세를 보이고 있습니다. 미국의 소비자 물가 지수(CPI)는 예상치를 상회하며 인플레이션 압력이 여전함을 시사했지만, 유럽 중앙은행(ECB)은 금리 인하 가능성을 열어두었습니다.</p><p>중국의 경제 회복 속도는 시장 기대에 미치지 못하고 있으며, 이는 글로벌 공급망과 원자재 가격에 영향을 미치고 있습니다. 다가오는 분기에는 각국 중앙은행의 통화 정책 방향과 지정학적 리스크가 주요 변수로 작용할 전망입니다.</p><h5>전문가 의견</h5><p>"단기적인 변동성은 크겠지만, 장기적으로는 기술 혁신 분야를 중심으로 성장 모멘텀이 나타날 수 있습니다." - OOO 연구원</p>'
  },
  // ... 다른 기사들에도 content 필드 추가 ...
  { id: 'news003', title: '봄맞이 국내 여행 추천 스팟 Top 5', summary: '따뜻한 봄날, 가족 또는 연인과 함께 떠나기 좋은 국내 숨겨진 명소...', thumbnailUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-earth-light-light-effect-news-technology-blue-image_784111.jpg', source: '여행 매거진', publishedAt: '2025-04-14T15:00:00Z', category: '라이프', content: '<p>봄의 정취를 만끽할 수 있는 국내 여행지 5곳을 소개합니다. 1. ... 2. ... </p>' },
  { id: 'news005', title: '환경 보호를 위한 작은 실천 방법', summary: '지구를 지키는 일상 속 작은 습관들. 누구나 쉽게 따라 할 수 있는...', thumbnailUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-earth-light-light-effect-news-technology-blue-image_784111.jpg', source: '그린 포스트', publishedAt: '2025-04-13T18:00:00Z', category: '사회', content: '<p>일상에서 쉽게 실천할 수 있는 환경 보호 방법입니다. 1. 텀블러 사용하기...</p>' },
  { id: 'news006', title: '정부, 새로운 부동산 정책 발표', summary: '시장 안정화를 위한 새로운 부동산 정책이 발표되었습니다...', thumbnailUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-earth-light-light-effect-news-technology-blue-image_784111.jpg', source: '대한 뉴스', publishedAt: '2025-04-15T11:00:00Z', category: '정치', content: '<p>정부는 오늘 새로운 부동산 안정화 대책을 발표했습니다. 주요 내용은 다음과 같습니다...</p>' },
  { id: 'news007', title: '최신 스마트폰 기술 동향', summary: '폴더블부터 롤러블까지, 최신 스마트폰 기술 동향을 살펴봅니다...', thumbnailUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-earth-light-light-effect-news-technology-blue-image_784111.jpg', source: '테크 리뷰', publishedAt: '2025-04-15T12:00:00Z', category: 'IT/과학', content: '<p>스마트폰 시장의 최신 기술 트렌드를 알아봅니다. 폴더블 디스플레이의 발전과...</p>' },
];

export const fetchArticles = async (
    page: number = 1,
    limit: number = 10, // 한 페이지당 항목 수 (상수로 관리하는 것이 좋음)
    category: string = 'all'
): Promise<{ articles: ArticleSummary[], totalCount: number }> => {
  console.log(`Workspaceing articles - page: ${page}, limit: ${limit}, category: ${category}`);

  await new Promise(resolve => setTimeout(resolve, 500));

  const filteredArticles = category === 'all'
    ? mockArticles
    : mockArticles.filter(article => article.category === category);

  // ★★★ 중요: 필터링된 전체 개수를 계산 ★★★
  const totalCount = filteredArticles.length;

  const start = (page - 1) * limit;
  const end = start + limit;
  // 목록용 데이터는 content 제외
  const paginatedArticles = filteredArticles.slice(start, end)
      .map(({ content, ...summary }) => summary);

  return { articles: paginatedArticles, totalCount: totalCount }; // totalCount 반환 확인!
};

// --- 특정 ID의 기사 상세 정보를 가져오는 함수 시뮬레이션 추가 ---
export const fetchArticleById = async (id: string): Promise<ArticleDetail | null> => {
  console.log(`Workspaceing article detail for id: ${id}`);
  // 실제 API 호출 시:
  // const response = await fetch(`/api/articles/${id}`);
  // if (!response.ok) {
  //   if (response.status === 404) return null; // 404 에러 시 null 반환
  //   throw new Error('Failed to fetch article detail');
  // }
  // return response.json();

  // --- 시뮬레이션 ---
  await new Promise(resolve => setTimeout(resolve, 300)); // 0.3초 딜레이

  const article = mockArticles.find(article => article.id === id);

  // if (Math.random() > 0.9) throw new Error('Simulated API Error!'); // 에러 테스트

  return article || null; // 찾았으면 해당 기사 반환, 없으면 null 반환
};