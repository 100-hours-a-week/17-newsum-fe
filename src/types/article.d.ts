// src/types/article.d.ts
export interface ArticleSummary {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl?: string; // Optional thumbnail image URL
  source: string; // 출처 (신문사 등)
  publishedAt: string; // 발행일시 (ISO 문자열 등)
  category?: string;
}

// 상세 페이지를 위한 타입 (나중에 확장)
export interface ArticleDetail extends ArticleSummary {
  content: string; // 전체 내용
  author?: string;
  // ... more fields
}
