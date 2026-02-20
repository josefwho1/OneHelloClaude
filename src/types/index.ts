export interface Hello {
  id: string;
  user_id: string;
  name: string | null;
  location: string | null;
  notes: string | null;
  challenge_id: number | null;
  challenge_name: string | null;
  has_details: boolean;
  created_at: string;
  synced: boolean;
}

export interface UserProgress {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  current_challenge_day: number;
  challenge_completed: boolean;
  last_hello_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: number;
  day_number: number;
  name: string;
  description: string;
  tips: string | null;
}

export interface UserStats {
  streak: number;
  longestStreak: number;
  totalHellos: number;
  weekHellos: number;
  currentDay: number;
  challengeCompleted: boolean;
  lastHelloDate: string | null;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export type RemiExpression =
  | 'waving'
  | 'celebrating'
  | 'curious'
  | 'logging'
  | 'understanding'
  | 'shaking';

export type OnboardingStep =
  | 'welcome'
  | 'greeting'
  | 'reflection'
  | 'research'
  | 'challenge'
  | 'public-place'
  | 'yes-public'
  | 'did-it'
  | 'add-details'
  | 'skip-details'
  | 'no-public'
  | 'walkthrough-1'
  | 'walkthrough-2'
  | 'walkthrough-3'
  | 'walkthrough-4';

export type TabName = 'home' | 'hellobook' | 'quests';
