import { useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { CHALLENGES } from '../../lib/challenges';
import { Button } from '../common/Button';
import { Check, ChevronRight, Lock } from 'lucide-react';

export function QuestsScreen() {
  const { state, completeChallenge } = useAppState();
  const { stats } = state;
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const handleComplete = (day: number, name: string) => {
    completeChallenge(day, name);
    setExpandedDay(null);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 page-transition">
      <div className="px-5 pt-6 safe-top">
        {/* Header card */}
        <div className="bg-white rounded-3xl border border-border p-5 mb-6 shadow-sm">
          {stats.challengeCompleted ? (
            <div className="text-center">
              <h2 className="text-lg font-bold text-text mb-1">
                7 Day Challenge Complete! 🎉
              </h2>
              <p className="text-sm text-text-light">
                You talked to 7 strangers in 7 days.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-text">
                  7 Day One Hello Challenge
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${((stats.currentDay - 1) / 7) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-text-light font-medium whitespace-nowrap">
                  Day {stats.currentDay} of 7
                </span>
              </div>
            </>
          )}
        </div>

        {/* Challenge list */}
        <div className="space-y-2">
          {CHALLENGES.map((challenge) => {
            const isCompleted = challenge.day_number < stats.currentDay || stats.challengeCompleted;
            const isCurrent = challenge.day_number === stats.currentDay && !stats.challengeCompleted;
            const isFuture = challenge.day_number > stats.currentDay && !stats.challengeCompleted;
            const isExpanded = expandedDay === challenge.day_number;

            return (
              <div key={challenge.id}>
                <button
                  onClick={() => {
                    if (isCurrent) setExpandedDay(isExpanded ? null : challenge.day_number);
                  }}
                  disabled={isFuture}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    isCompleted
                      ? 'bg-success/5 border-success/20'
                      : isCurrent
                        ? 'bg-primary/5 border-primary/30 shadow-sm'
                        : 'bg-secondary/50 border-border/50 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Status icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isCurrent
                            ? 'bg-primary text-white animate-pulse-soft'
                            : 'bg-border text-text-lighter'
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={16} strokeWidth={3} />
                      ) : isFuture ? (
                        <Lock size={14} />
                      ) : (
                        <span className="text-xs font-bold">{challenge.day_number}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-lighter font-medium">
                          Day {challenge.day_number}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            TODAY
                          </span>
                        )}
                      </div>
                      <p className={`font-semibold ${isFuture ? 'text-text-lighter' : 'text-text'}`}>
                        {challenge.name}
                      </p>
                    </div>

                    {/* Arrow for current */}
                    {isCurrent && (
                      <ChevronRight
                        size={18}
                        className={`text-primary transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    )}
                  </div>
                </button>

                {/* Expanded detail view */}
                {isExpanded && isCurrent && (
                  <div className="mt-1 bg-white rounded-2xl border border-primary/20 p-5 animate-slide-up">
                    <h3 className="font-bold text-text mb-2">{challenge.name}</h3>
                    <p className="text-text-light mb-3">{challenge.description}</p>
                    {challenge.tips && (
                      <div className="bg-primary/5 rounded-xl p-3 mb-4">
                        <p className="text-sm text-text-light">
                          <span className="font-semibold text-primary">Tip: </span>
                          {challenge.tips}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() => handleComplete(challenge.day_number, challenge.name)}
                      fullWidth
                    >
                      Complete Challenge
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Coming soon section */}
        {stats.challengeCompleted && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-text mb-3">Coming Soon</h3>
            <div className="space-y-2">
              {['Deeper Connections', 'Neighborhood Explorer', 'Confidence Builder'].map((name) => (
                <div
                  key={name}
                  className="bg-secondary/50 rounded-2xl border border-border/50 p-4 opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
                      <Lock size={14} className="text-text-lighter" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-lighter">{name}</p>
                      <p className="text-xs text-text-lighter">Coming soon</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
