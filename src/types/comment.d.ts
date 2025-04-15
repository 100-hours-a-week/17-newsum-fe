// src/types/comment.d.ts
export interface CommentData {
  id: string;
  articleId: string;
  author: string;
  content: string;
  createdAt: string;
  parentId: string | null; // ★★★ 부모 댓글 ID 추가 (최상위 댓글은 null) ★★★
}