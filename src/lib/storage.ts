import type { Hello, UserStats } from '../types';
import { CHALLENGES } from './challenges';

const KEYS = {
  USER_STATS: 'onehello_user_stats',
  HELLO_ENTRIES: 'onehello_hello_entries',
  PENDING_SYNC: 'onehello_pending_sync',
  CHALLENGES_CACHE: 'onehello_challenges_cache',
  USER_NAME: 'onehello_user_name',
  ONBOARDING_COMPLETE: 'onehello_onboarding_complete',
  USER_ID: 'onehello_user_id',
} as const;

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be full or unavailable
  }
}

// User name
export function getUserName(): string {
  return localStorage.getItem(KEYS.USER_NAME) || '';
}

export function setUserName(name: string): void {
  localStorage.setItem(KEYS.USER_NAME, name);
}

// Onboarding
export function isOnboardingComplete(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING_COMPLETE) === 'true';
}

export function setOnboardingComplete(): void {
  localStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
}

// User ID (local fallback when no auth)
export function getLocalUserId(): string {
  let id = localStorage.getItem(KEYS.USER_ID);
  if (!id) {
    id = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(KEYS.USER_ID, id);
  }
  return id;
}

// User stats
export function getDefaultStats(): UserStats {
  return {
    streak: 0,
    longestStreak: 0,
    totalHellos: 0,
    weekHellos: 0,
    currentDay: 1,
    challengeCompleted: false,
    lastHelloDate: null,
    lastUpdated: new Date().toISOString(),
  };
}

export function getUserStats(): UserStats {
  return getItem<UserStats>(KEYS.USER_STATS, getDefaultStats());
}

export function setUserStats(stats: UserStats): void {
  setItem(KEYS.USER_STATS, { ...stats, lastUpdated: new Date().toISOString() });
}

// Hello entries
export function getHelloEntries(): Hello[] {
  return getItem<Hello[]>(KEYS.HELLO_ENTRIES, []);
}

export function setHelloEntries(entries: Hello[]): void {
  setItem(KEYS.HELLO_ENTRIES, entries);
}

export function addHelloEntry(entry: Hello): void {
  const entries = getHelloEntries();
  entries.unshift(entry);
  setHelloEntries(entries);
}

export function updateHelloEntry(id: string, updates: Partial<Hello>): void {
  const entries = getHelloEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    entries[idx] = { ...entries[idx], ...updates };
    setHelloEntries(entries);
  }
}

// Pending sync
export function getPendingSync(): string[] {
  return getItem<string[]>(KEYS.PENDING_SYNC, []);
}

export function addPendingSync(id: string): void {
  const pending = getPendingSync();
  if (!pending.includes(id)) {
    pending.push(id);
    setItem(KEYS.PENDING_SYNC, pending);
  }
}

export function removePendingSync(id: string): void {
  const pending = getPendingSync().filter((pid) => pid !== id);
  setItem(KEYS.PENDING_SYNC, pending);
}

// Challenges cache
export function getChallengesCache() {
  return getItem(KEYS.CHALLENGES_CACHE, CHALLENGES);
}

// Date helpers
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isToday(dateStr: string): boolean {
  return dateStr.startsWith(getTodayDateString());
}

export function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday start
  startOfWeek.setDate(startOfWeek.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek;
}

export function wasYesterday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
}

// Calculate streak from entries
export function recalculateStats(entries: Hello[], currentStats: UserStats): UserStats {
  const totalHellos = entries.length;
  const weekHellos = entries.filter((e) => isThisWeek(e.created_at)).length;
  const today = getTodayDateString();
  const lastHelloDate = entries.length > 0 ? entries[0].created_at.split('T')[0] : null;

  let streak = currentStats.streak;

  // If user just logged a hello today and didn't have one before today
  if (lastHelloDate === today && currentStats.lastHelloDate !== today) {
    if (currentStats.lastHelloDate === null || wasYesterday(currentStats.lastHelloDate)) {
      streak = currentStats.streak + 1;
    } else if (currentStats.lastHelloDate === today) {
      // Already counted today
    } else {
      streak = 1; // Streak broken, start fresh
    }
  }

  const longestStreak = Math.max(currentStats.longestStreak, streak);

  return {
    ...currentStats,
    streak,
    longestStreak,
    totalHellos,
    weekHellos,
    lastHelloDate: lastHelloDate || currentStats.lastHelloDate,
    lastUpdated: new Date().toISOString(),
  };
}
