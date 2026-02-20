import { useAppState } from '../../hooks/useAppState';
import { getChallengeForDay } from '../../lib/challenges';
import { Button } from '../common/Button';
import { SyncBadge } from '../common/SyncBadge';
import { Flame, HandMetal, BookOpen, Compass } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen() {
  const { state, showLogModal, completeChallenge, setActiveTab } = useAppState();
  const { stats, userName } = state;
  const challenge = getChallengeForDay(stats.currentDay);
  const isInChallenge = !stats.challengeCompleted && stats.currentDay <= 7;

  const handleCompleteChallenge = () => {
    if (challenge) {
      completeChallenge(stats.currentDay, challenge.name);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 page-transition">
      <div className="px-5 pt-6 safe-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">
            {getGreeting()}, {userName}! 🦝
          </h1>
          <SyncBadge />
        </div>

        {/* Challenge Card or Daily Hello */}
        {isInChallenge ? (
          <div className="bg-white rounded-3xl border border-border p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                7 Day One Hello Challenge
              </span>
              <span className="text-sm text-text-light font-medium">
                Day {stats.currentDay} of 7
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-secondary rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((stats.currentDay - 1) / 7) * 100}%` }}
              />
            </div>

            {challenge && (
              <div className="mb-5">
                <p className="text-xs text-text-lighter uppercase tracking-wide font-semibold mb-1">
                  Today's Challenge
                </p>
                <h2 className="text-lg font-bold text-text mb-1">{challenge.name}</h2>
                <p className="text-text-light">{challenge.description}</p>
              </div>
            )}

            <Button onClick={handleCompleteChallenge} fullWidth size="lg">
              Complete Challenge
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-border p-6 mb-6 shadow-sm">
            <div className="text-center mb-5">
              <span className="text-sm font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                Daily Hello
              </span>
              <h2 className="text-xl font-bold text-text mt-3">
                Have you said hello today?
              </h2>
            </div>
            <Button onClick={() => showLogModal()} fullWidth size="lg">
              Log Your Hello
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={18} className="text-primary" />
              <span className="text-sm text-text-lighter font-medium">Streak</span>
            </div>
            <p className="text-2xl font-bold text-text">
              {stats.streak > 0 ? `${stats.streak} day${stats.streak !== 1 ? 's' : ''} 🔥` : 'No streak yet'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <HandMetal size={18} className="text-primary" />
              <span className="text-sm text-text-lighter font-medium">This Week</span>
            </div>
            <p className="text-2xl font-bold text-text">
              {stats.weekHellos} hello{stats.weekHellos !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {stats.challengeCompleted && (
          <div className="bg-white rounded-2xl border border-border p-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-text-lighter font-medium">Total Hellos</span>
            </div>
            <p className="text-2xl font-bold text-text">{stats.totalHellos}</p>
          </div>
        )}

        {/* Bottom actions */}
        <div className="space-y-3">
          {isInChallenge && (
            <Button onClick={() => showLogModal()} fullWidth variant="outline" size="sm">
              Log Another Hello
            </Button>
          )}
          {stats.challengeCompleted && (
            <div className="flex gap-3">
              <Button onClick={() => setActiveTab('hellobook')} fullWidth variant="outline" size="sm">
                <BookOpen size={16} className="mr-2" />
                Hello Book
              </Button>
              <Button onClick={() => setActiveTab('quests')} fullWidth variant="outline" size="sm">
                <Compass size={16} className="mr-2" />
                Challenges
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
