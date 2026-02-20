import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { Hello, UserStats, TabName } from '../types';
import {
  getUserStats,
  setUserStats,
  getHelloEntries,
  setHelloEntries,
  addHelloEntry as storageAddHello,
  updateHelloEntry as storageUpdateHello,
  getUserName,
  setUserName as storageSetUserName,
  isOnboardingComplete,
  setOnboardingComplete as storageSetOnboardingComplete,
  getLocalUserId,
  getTodayDateString,
  recalculateStats,
  addPendingSync,
  getDefaultStats,
} from '../lib/storage';
import { syncPendingHellos, syncUserProgress } from '../lib/sync';

interface AppState {
  stats: UserStats;
  entries: Hello[];
  userName: string;
  onboardingComplete: boolean;
  activeTab: TabName;
  showLogModal: boolean;
  logModalChallengeId: number | null;
  toast: { message: string; action?: { label: string; onClick: () => void } } | null;
}

type Action =
  | { type: 'SET_STATS'; stats: UserStats }
  | { type: 'SET_ENTRIES'; entries: Hello[] }
  | { type: 'ADD_ENTRY'; entry: Hello }
  | { type: 'UPDATE_ENTRY'; id: string; updates: Partial<Hello> }
  | { type: 'SET_USER_NAME'; name: string }
  | { type: 'SET_ONBOARDING_COMPLETE' }
  | { type: 'SET_ACTIVE_TAB'; tab: TabName }
  | { type: 'SHOW_LOG_MODAL'; challengeId?: number | null }
  | { type: 'HIDE_LOG_MODAL' }
  | { type: 'SHOW_TOAST'; toast: AppState['toast'] }
  | { type: 'HIDE_TOAST' }
  | { type: 'COMPLETE_CHALLENGE' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATS':
      return { ...state, stats: action.stats };
    case 'SET_ENTRIES':
      return { ...state, entries: action.entries };
    case 'ADD_ENTRY': {
      const newEntries = [action.entry, ...state.entries];
      return { ...state, entries: newEntries };
    }
    case 'UPDATE_ENTRY': {
      const updated = state.entries.map((e) =>
        e.id === action.id ? { ...e, ...action.updates } : e
      );
      return { ...state, entries: updated };
    }
    case 'SET_USER_NAME':
      return { ...state, userName: action.name };
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, onboardingComplete: true };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab };
    case 'SHOW_LOG_MODAL':
      return { ...state, showLogModal: true, logModalChallengeId: action.challengeId ?? null };
    case 'HIDE_LOG_MODAL':
      return { ...state, showLogModal: false, logModalChallengeId: null };
    case 'SHOW_TOAST':
      return { ...state, toast: action.toast };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'COMPLETE_CHALLENGE': {
      const newDay = Math.min(state.stats.currentDay + 1, 8);
      const challengeCompleted = state.stats.currentDay >= 7;
      return {
        ...state,
        stats: {
          ...state.stats,
          currentDay: challengeCompleted ? state.stats.currentDay : newDay,
          challengeCompleted: challengeCompleted || state.stats.challengeCompleted,
        },
      };
    }
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  logHello: (hello: Omit<Hello, 'id' | 'user_id' | 'created_at' | 'synced'>) => void;
  updateHello: (id: string, updates: Partial<Hello>) => void;
  completeChallenge: (challengeDay: number, challengeName: string) => void;
  setName: (name: string) => void;
  finishOnboarding: () => void;
  setActiveTab: (tab: TabName) => void;
  showLogModal: (challengeId?: number | null) => void;
  hideLogModal: () => void;
  showToast: (message: string, action?: { label: string; onClick: () => void }) => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    stats: getUserStats(),
    entries: getHelloEntries(),
    userName: getUserName(),
    onboardingComplete: isOnboardingComplete(),
    activeTab: 'home',
    showLogModal: false,
    logModalChallengeId: null,
    toast: null,
  });

  // Persist stats changes
  useEffect(() => {
    setUserStats(state.stats);
  }, [state.stats]);

  // Persist entries changes
  useEffect(() => {
    setHelloEntries(state.entries);
  }, [state.entries]);

  // Background sync on online
  useEffect(() => {
    const handleOnline = () => {
      syncPendingHellos();
      syncUserProgress(state.stats, getLocalUserId());
    };
    window.addEventListener('online', handleOnline);
    // Try sync on mount
    handleOnline();
    return () => window.removeEventListener('online', handleOnline);
  }, [state.stats]);

  // Auto-dismiss toast
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  const logHello = useCallback(
    (hello: Omit<Hello, 'id' | 'user_id' | 'created_at' | 'synced'>) => {
      const id = `local_${Date.now()}`;
      const entry: Hello = {
        ...hello,
        id,
        user_id: getLocalUserId(),
        created_at: new Date().toISOString(),
        synced: false,
      };

      dispatch({ type: 'ADD_ENTRY', entry });
      storageAddHello(entry);
      addPendingSync(id);

      // Update stats
      const currentEntries = [entry, ...getHelloEntries().filter((e) => e.id !== id)];
      const newStats = recalculateStats(currentEntries, getUserStats());
      dispatch({ type: 'SET_STATS', stats: newStats });
      setUserStats(newStats);

      // Try to sync
      syncPendingHellos();
      syncUserProgress(newStats, getLocalUserId());
    },
    []
  );

  const updateHello = useCallback((id: string, updates: Partial<Hello>) => {
    dispatch({ type: 'UPDATE_ENTRY', id, updates });
    storageUpdateHello(id, updates);
  }, []);

  const completeChallenge = useCallback(
    (challengeDay: number, challengeName: string) => {
      // Auto-create hello entry
      const id = `local_${Date.now()}`;
      const entry: Hello = {
        id,
        user_id: getLocalUserId(),
        name: null,
        location: null,
        notes: `One Hello 7-Day Challenge | Day ${challengeDay} | ${challengeName}`,
        challenge_id: challengeDay,
        challenge_name: challengeName,
        has_details: false,
        created_at: new Date().toISOString(),
        synced: false,
      };

      dispatch({ type: 'ADD_ENTRY', entry });
      storageAddHello(entry);
      addPendingSync(id);

      // Update challenge day
      const currentStats = getUserStats();
      const isLastDay = challengeDay >= 7;
      const newStats: UserStats = {
        ...recalculateStats([entry, ...getHelloEntries().filter((e) => e.id !== id)], currentStats),
        currentDay: isLastDay ? currentStats.currentDay : currentStats.currentDay + 1,
        challengeCompleted: isLastDay || currentStats.challengeCompleted,
      };

      dispatch({ type: 'SET_STATS', stats: newStats });
      setUserStats(newStats);
      dispatch({ type: 'COMPLETE_CHALLENGE' });

      // Sync
      syncPendingHellos();
      syncUserProgress(newStats, getLocalUserId());

      // Show toast with option to add details
      dispatch({
        type: 'SHOW_TOAST',
        toast: {
          message: `Day ${challengeDay} complete! 🎉`,
          action: {
            label: 'Add Details',
            onClick: () => {
              dispatch({ type: 'SHOW_LOG_MODAL', challengeId: challengeDay });
            },
          },
        },
      });
    },
    []
  );

  const setName = useCallback((name: string) => {
    storageSetUserName(name);
    dispatch({ type: 'SET_USER_NAME', name });
  }, []);

  const finishOnboarding = useCallback(() => {
    storageSetOnboardingComplete();
    dispatch({ type: 'SET_ONBOARDING_COMPLETE' });
  }, []);

  const setActiveTab = useCallback((tab: TabName) => {
    dispatch({ type: 'SET_ACTIVE_TAB', tab });
  }, []);

  const showLogModalFn = useCallback((challengeId?: number | null) => {
    dispatch({ type: 'SHOW_LOG_MODAL', challengeId });
  }, []);

  const hideLogModal = useCallback(() => {
    dispatch({ type: 'HIDE_LOG_MODAL' });
  }, []);

  const showToast = useCallback(
    (message: string, action?: { label: string; onClick: () => void }) => {
      dispatch({ type: 'SHOW_TOAST', toast: { message, action } });
    },
    []
  );

  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        logHello,
        updateHello,
        completeChallenge,
        setName,
        finishOnboarding,
        setActiveTab,
        showLogModal: showLogModalFn,
        hideLogModal,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
