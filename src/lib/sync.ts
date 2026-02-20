import { supabase, isSupabaseConfigured } from './supabase';
import {
  getHelloEntries,
  setHelloEntries,
  getPendingSync,
  removePendingSync,
  getUserStats,
  setUserStats,
} from './storage';
import type { Hello, UserStats } from '../types';

export async function syncPendingHellos(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const pending = getPendingSync();
  if (pending.length === 0) return;

  const entries = getHelloEntries();

  for (const localId of pending) {
    const entry = entries.find((e) => e.id === localId);
    if (!entry) {
      removePendingSync(localId);
      continue;
    }

    try {
      const { data, error } = await supabase
        .from('hellos')
        .insert({
          user_id: entry.user_id,
          name: entry.name,
          location: entry.location,
          notes: entry.notes,
          challenge_id: entry.challenge_id,
          challenge_name: entry.challenge_name,
          has_details: entry.has_details,
          created_at: entry.created_at,
        })
        .select()
        .single();

      if (!error && data) {
        // Replace local ID with server ID
        const updatedEntries = getHelloEntries().map((e) =>
          e.id === localId ? { ...e, id: data.id, synced: true } : e
        );
        setHelloEntries(updatedEntries);
        removePendingSync(localId);
      }
    } catch {
      // Will retry later
      break;
    }
  }
}

export async function syncUserProgress(stats: UserStats, userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from('user_progress').upsert({
      user_id: userId,
      current_streak: stats.streak,
      longest_streak: stats.longestStreak,
      current_challenge_day: stats.currentDay,
      challenge_completed: stats.challengeCompleted,
      last_hello_date: stats.lastHelloDate,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // Silent fail, will retry
  }
}

export async function fetchRemoteHellos(userId: string): Promise<Hello[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('hellos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((h: Record<string, unknown>) => ({
      id: h.id as string,
      user_id: h.user_id as string,
      name: h.name as string | null,
      location: h.location as string | null,
      notes: h.notes as string | null,
      challenge_id: h.challenge_id as number | null,
      challenge_name: h.challenge_name as string | null,
      has_details: h.has_details as boolean,
      created_at: h.created_at as string,
      synced: true,
    }));
  } catch {
    return [];
  }
}

export async function fetchRemoteProgress(userId: string): Promise<UserStats | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    return {
      streak: data.current_streak,
      longestStreak: data.longest_streak,
      totalHellos: 0,
      weekHellos: 0,
      currentDay: data.current_challenge_day,
      challengeCompleted: data.challenge_completed,
      lastHelloDate: data.last_hello_date,
      lastUpdated: data.updated_at,
    };
  } catch {
    return null;
  }
}

export function getSyncStatus(): 'synced' | 'syncing' | 'offline' {
  const pending = getPendingSync();
  if (pending.length === 0) return 'synced';
  if (navigator.onLine) return 'syncing';
  return 'offline';
}
