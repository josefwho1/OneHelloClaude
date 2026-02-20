import { useState, useEffect } from 'react';
import { Remi } from '../remi/Remi';
import { Button } from '../common/Button';
import { useAppState } from '../../hooks/useAppState';
import { getChallengeForDay } from '../../lib/challenges';
import type { OnboardingStep } from '../../types';

export function Onboarding() {
  const { setName, finishOnboarding, completeChallenge, showLogModal, logHello } = useAppState();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserNameLocal] = useState('');
  const [reflectionAnswer, setReflectionAnswer] = useState('');

  // Auto-advance greeting screen
  useEffect(() => {
    if (step === 'greeting') {
      const timer = setTimeout(() => setStep('reflection'), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSetName = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
      setUserNameLocal(nameInput.trim());
      setStep('greeting');
    }
  };

  const handleDidIt = () => {
    // Complete day 1 challenge
    const challenge = getChallengeForDay(1);
    if (challenge) {
      completeChallenge(1, challenge.name);
    }
    setStep('did-it');
  };

  const handleAddToHelloBook = () => {
    setStep('add-details');
  };

  const handleLogFirstHello = (name: string, location: string, notes: string) => {
    // The challenge completion already created an entry, but we update it
    // Actually, let's navigate to walkthrough
    setStep('walkthrough-1');
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="waving" size={160} />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-text">Welcome to One Hello!</h1>
              <p className="text-lg text-text-light">I'm Remi.</p>
            </div>
            <div className="w-full space-y-3">
              <label className="text-text-light text-sm font-medium">What's your name?</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text text-center text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <Button onClick={handleSetName} fullWidth disabled={!nameInput.trim()}>
                Continue
              </Button>
            </div>
          </div>
        );

      case 'greeting':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="shaking" size={160} />
            <h1 className="text-2xl font-bold text-text">
              Nice to meet you, {userName}! 👋
            </h1>
          </div>
        );

      case 'reflection':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="curious" size={140} />
            <h2 className="text-xl font-bold text-text">
              When's the last time you started a conversation with a stranger?
            </h2>
            <div className="w-full space-y-2">
              {['This week', 'Last week', 'A few weeks ago', "I don't remember"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setReflectionAnswer(opt)}
                  className={`w-full px-4 py-3 rounded-xl border text-left transition-all ${
                    reflectionAnswer === opt
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-border text-text hover:border-primary/30'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <Button onClick={() => setStep('research')} fullWidth disabled={!reflectionAnswer}>
              Continue
            </Button>
          </div>
        );

      case 'research':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="logging" size={140} />
            <div className="space-y-4">
              <p className="text-lg text-text leading-relaxed">
                Even brief conversations with strangers increase happiness.
              </p>
              <p className="text-lg font-semibold text-text">Ready to change that?</p>
            </div>
            <Button onClick={() => setStep('challenge')} fullWidth>
              I'm curious
            </Button>
          </div>
        );

      case 'challenge':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="celebrating" size={140} />
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-text">
                The One Hello 7-Day Challenge
              </h1>
              <p className="text-lg text-text-light">
                One hello a day. 7 Days. 7 Strangers.
              </p>
            </div>
            <Button onClick={() => setStep('public-place')} fullWidth size="lg">
              Let's do it
            </Button>
          </div>
        );

      case 'public-place':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="curious" size={140} />
            <h2 className="text-xl font-bold text-text">
              Are you in a public place right now?
            </h2>
            <div className="w-full space-y-3">
              <Button onClick={() => setStep('yes-public')} fullWidth>
                Yes
              </Button>
              <Button onClick={() => setStep('no-public')} fullWidth variant="secondary">
                No, I'm at home
              </Button>
            </div>
          </div>
        );

      case 'yes-public':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="celebrating" size={120} />
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text">
                Perfect! Let's do Day 1 right now.
              </h2>
              <p className="text-base text-text-light font-medium">
                Smile & say hello to someone new.
              </p>
              <p className="text-sm text-text-lighter leading-relaxed">
                The barista. Someone in line. A stranger walking by.
                Just say "hello" or "good morning" — that's it.
              </p>
            </div>
            <div className="w-full space-y-3">
              <Button onClick={handleDidIt} fullWidth>
                I did it!
              </Button>
              <Button onClick={() => setStep('walkthrough-1')} fullWidth variant="ghost">
                I'll do this later
              </Button>
            </div>
          </div>
        );

      case 'did-it':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="celebrating" size={160} />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text">Day 1 complete! 🎉</h1>
              <p className="text-text-light">You just said hello to a stranger!</p>
              <p className="text-text-light">Want to remember them?</p>
            </div>
            <div className="w-full space-y-3">
              <Button onClick={handleAddToHelloBook} fullWidth>
                Add to Hello Book
              </Button>
              <Button onClick={() => setStep('skip-details')} fullWidth variant="ghost">
                Skip for now
              </Button>
            </div>
          </div>
        );

      case 'add-details':
        return <OnboardingLogForm onComplete={() => setStep('walkthrough-1')} />;

      case 'skip-details':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="logging" size={140} />
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text">No worries!</h2>
              <p className="text-text-light">
                Your Hello Book helps you remember everyone you meet.
              </p>
              <p className="text-text-light">Let me show you around.</p>
            </div>
            <Button onClick={() => setStep('walkthrough-1')} fullWidth>
              Continue
            </Button>
          </div>
        );

      case 'no-public':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <Remi expression="understanding" size={140} />
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text">No worries!</h2>
              <p className="text-text-light">
                One Hello works best when you're out in the world.
              </p>
              <p className="text-text-light">
                Next time you're out, come back and do Day 1.
              </p>
              <p className="text-text-light">For now, let me show you around.</p>
            </div>
            <Button onClick={() => setStep('walkthrough-1')} fullWidth>
              Continue
            </Button>
          </div>
        );

      case 'walkthrough-1':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">🏠</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text">This is Home</h2>
              <div className="text-text-light text-left space-y-1.5 bg-secondary rounded-xl p-4">
                <p>Here you'll see:</p>
                <p>• Today's challenge</p>
                <p>• Your current streak</p>
                <p>• Your hello stats</p>
              </div>
            </div>
            <Button onClick={() => setStep('walkthrough-2')} fullWidth>
              Next
            </Button>
          </div>
        );

      case 'walkthrough-2':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text">Complete Your Challenge</h2>
              <p className="text-text-light">
                Tap here when you've done today's hello.
              </p>
              <p className="text-sm text-text-lighter">
                (You can log extra hellos anytime from the home screen)
              </p>
            </div>
            <Button onClick={() => setStep('walkthrough-3')} fullWidth>
              Next
            </Button>
          </div>
        );

      case 'walkthrough-3':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">📖</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text">Your Hello Book</h2>
              <p className="text-text-light">
                This is where your hellos live.
              </p>
              <p className="text-sm text-text-lighter">
                Search by name, place, or notes to find anyone you've met.
              </p>
            </div>
            <Button onClick={() => setStep('walkthrough-4')} fullWidth>
              Next
            </Button>
          </div>
        );

      case 'walkthrough-4':
        return (
          <div className="flex flex-col items-center text-center gap-6 page-transition">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">🧭</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-text">Quests</h2>
              <p className="text-text-light">
                This is where you'll find conversation challenges.
              </p>
              <p className="text-sm text-text-lighter">
                You're starting with the 7-Day Challenge—7 progressive prompts to help you talk to strangers.
              </p>
              <p className="text-xs text-text-lighter mt-1">
                More challenge packs coming soon!
              </p>
            </div>
            <Button onClick={finishOnboarding} fullWidth size="lg">
              Let's begin
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  // Progress dots for walkthrough
  const walkthroughSteps: OnboardingStep[] = ['walkthrough-1', 'walkthrough-2', 'walkthrough-3', 'walkthrough-4'];
  const walkthroughIdx = walkthroughSteps.indexOf(step);

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        {renderStep()}
      </div>
      {walkthroughIdx >= 0 && (
        <div className="flex gap-2 mt-8">
          {walkthroughSteps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= walkthroughIdx ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Mini form for logging first hello during onboarding
function OnboardingLogForm({ onComplete }: { onComplete: () => void }) {
  const { state, updateHello } = useAppState();
  const [name, setNameVal] = useState('');
  const [location, setLocation] = useState('');

  // Find the most recent entry (should be the Day 1 auto-created one)
  const latestEntry = state.entries[0];

  const handleSubmit = () => {
    if (latestEntry) {
      const updates: Record<string, unknown> = {};
      if (name.trim()) Object.assign(updates, { name: name.trim() });
      if (location.trim()) Object.assign(updates, { location: location.trim() });
      if (name.trim() || location.trim()) Object.assign(updates, { has_details: true });
      updateHello(latestEntry.id, updates);
    }
    onComplete();
  };

  return (
    <div className="flex flex-col items-center gap-5 page-transition">
      <Remi expression="logging" size={100} />
      <h2 className="text-xl font-bold text-text">Log your hello</h2>
      <div className="w-full space-y-4">
        <div>
          <label className="text-sm font-medium text-text-light mb-1 block">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setNameVal(e.target.value)}
            placeholder="Their name"
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-text-light mb-1 block">Where you met (optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Coffee shop, park, etc."
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-text-light mb-1 block">Notes</label>
          <textarea
            value={latestEntry?.notes || ''}
            readOnly
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-text-light text-sm resize-none"
          />
        </div>
        <Button onClick={handleSubmit} fullWidth>
          Log hello 👋
        </Button>
      </div>
    </div>
  );
}
