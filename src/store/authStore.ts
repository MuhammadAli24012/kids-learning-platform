import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: RegisterData) => Promise<User | null>;
  logout: () => void;
  switchUser: (userId: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'parent' | 'child';
  parentId?: string;
  age?: number;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Fetch users from demo data
          const response = await fetch('/data/users.json');
          const data = await response.json();
          
          // Find user by email (for demo purposes, any password works)
          const user = data.users.find((u: User) => u.email === email);
          
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return user;
          } else {
            set({ isLoading: false });
            return null;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return null;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create new user object
          const newUser: User = {
            id: `user_${Date.now()}`,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            subscription: 'free',
            ...(userData.role === 'child' && {
              parentId: userData.parentId,
              age: userData.age,
              preferences: {
                language: 'english',
                difficulty: 'beginner',
                favoriteSubjects: []
              },
              progress: {
                totalXP: 0,
                level: 1,
                gamesCompleted: 0,
                storiesRead: 0,
                streakDays: 0,
                achievements: []
              }
            }),
            createdAt: new Date().toISOString()
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return newUser;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return null;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      switchUser: async (userId: string) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/data/users.json');
          const data = await response.json();
          
          const user = data.users.find((u: User) => u.id === userId);
          
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Switch user error:', error);
          set({ isLoading: false });
        }
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
