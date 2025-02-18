import { create } from 'zustand';

interface UserState {
  user: string;
  setUser: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: 'Guest',
  setUser: (name) => set({ user: name }),
}));