import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  hasNewNotification: false,
  setHasNewNotification: (hasNew) => set({ hasNewNotification: hasNew }),
})); 