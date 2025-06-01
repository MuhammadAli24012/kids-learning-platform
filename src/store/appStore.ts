import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Theme } from '../types';

interface AppState {
  language: Language;
  theme: Theme;
  isLoading: boolean;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'english',
      theme: 'light',
      isLoading: false,

      setLanguage: (language: Language) => {
        set({ language });
      },

      setTheme: (theme: Theme) => {
        set({ theme });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      }
    }),
    {
      name: 'app-settings'
    }
  )
);
