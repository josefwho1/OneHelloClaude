import { useState } from 'react';
import { Remi } from '../remi/Remi';
import { Button } from '../common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthScreenProps {
  onSkip: () => void;
}

export function AuthScreen({ onSkip }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();

  const handleSubmit = async () => {
    if (!configured) {
      onSkip();
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <Remi expression="waving" size={100} />
          <h1 className="text-2xl font-bold text-text">One Hello</h1>
          <p className="text-text-light">
            {configured
              ? mode === 'signup'
                ? 'Create your account to sync across devices'
                : 'Welcome back!'
              : 'Get started with One Hello'}
          </p>
        </div>

        {configured ? (
          <div className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-lighter" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-lighter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-lighter" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-lighter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {error && (
              <p className="text-danger text-sm text-center">{error}</p>
            )}

            <Button onClick={handleSubmit} fullWidth disabled={loading || !email || !password}>
              {mode === 'signup' ? (
                <>
                  <UserPlus size={18} className="mr-2" />
                  {loading ? 'Creating account...' : 'Sign Up'}
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  {loading ? 'Signing in...' : 'Sign In'}
                </>
              )}
            </Button>

            <button
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="w-full text-center text-sm text-primary font-medium"
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-text-lighter">or</span>
              </div>
            </div>

            <Button onClick={onSkip} fullWidth variant="ghost">
              Continue without account
            </Button>
          </div>
        ) : (
          <Button onClick={onSkip} fullWidth size="lg">
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
}
