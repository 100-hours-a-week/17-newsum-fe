import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTitleStore = create(
  persist(
    (set) => ({
      title: '',
      setTitle: (title) => set({ title }),
      thumbnailUrl: '',
      setThumbnailUrl: (thumbnailUrl) => set({ thumbnailUrl }),
    }),
    {
      name: 'webtoon-title-storage', // localStorage key
      partialize: (state) => ({ title: state.title, thumbnailUrl: state.thumbnailUrl }), // title, thumbnailUrl만 저장
    }
  )
);