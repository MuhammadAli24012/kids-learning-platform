export interface User {
  id: string;
  email?: string;
  name: string;
  role: 'parent' | 'child';
  subscription?: 'free' | 'standard' | 'premium';
  children?: string[];
  parentId?: string;
  age?: number;
  preferences?: {
    language: 'english' | 'arabic' | 'urdu';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    favoriteSubjects: string[];
  };
  progress?: UserProgress;
  createdAt?: string;
}

export interface UserProgress {
  totalXP: number;
  level: number;
  gamesCompleted: number;
  storiesRead: number;
  streakDays: number;
  achievements: string[];
  lastActivity?: string;
}

export interface Game {
  id: string;
  title: string;
  category: 'math' | 'science' | 'language';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  image: string;
  xpReward: number;
  estimatedTime: string;
  ageRange: string;
  languages: string[];
  content: GameContent;
  subscription: 'free' | 'standard' | 'premium';
}

export interface GameContent {
  type: string;
  theme: string;
  [key: string]: any;
}

export interface Story {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  image: string;
  estimatedTime: string;
  ageRange: string;
  languages: string[];
  xpReward: number;
  moral: string;
  chapters: StoryChapter[];
  subscription: 'free' | 'standard' | 'premium';
}

export interface StoryChapter {
  id: number;
  title: string;
  content: {
    [language: string]: string;
  };
  image: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  xpReward: number;
  requirement: {
    type: string;
    count?: number;
    category?: string;
    language?: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  description: string;
  features: string[];
  limitations: string[];
  color: string;
  popular: boolean;
  stripePriceId: string | null;
  yearlyPrice?: number;
  yearlyPriceId?: string;
}

export interface GameSession {
  gameId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  xpEarned: number;
  mistakes: number;
  timeSpent: number;
}

export interface StorySession {
  storyId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  chaptersRead: number[];
  language: string;
  xpEarned: number;
}

export type Language = 'english' | 'arabic' | 'urdu';
export type Theme = 'light' | 'dark';
