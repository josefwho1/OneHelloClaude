import { useEffect, useState } from 'react';
import { AppProvider, useAppState } from './hooks/useAppState';
import { Onboarding } from './components/onboarding/Onboarding';
import { AuthScreen } from './components/auth/AuthScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { HelloBookScreen } from './components/hellobook/HelloBookScreen';
import { QuestsScreen } from './components/quests/QuestsScreen';
import { TabBar } from './components/common/TabBar';
import { Toast } from './components/common/Toast';
import { LogHelloModal } from './components/common/LogHelloModal';
import { isOnboardingComplete, getUserName } from './lib/storage';
import { supabase, isSupabaseConfigured } from './lib/supabase';

function AppContent() {
  const { state } = useAppState();
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthed(true);
      setAuthChecked(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading
  if (!authChecked) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Auth screen (skip if Supabase not configured or user has local data)
  const hasLocalData = getUserName() || isOnboardingComplete();
  if (!authed && !hasLocalData && isSupabaseConfigured()) {
    return <AuthScreen onSkip={() => setAuthed(true)} />;
  }

  // Onboarding
  if (!state.onboardingComplete) {
    return <Onboarding />;
  }

  // Main app
  return (
    <div className="flex flex-col min-h-full bg-secondary">
      {state.activeTab === 'home' && <HomeScreen />}
      {state.activeTab === 'hellobook' && <HelloBookScreen />}
      {state.activeTab === 'quests' && <QuestsScreen />}
      <TabBar />
      <LogHelloModal />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
