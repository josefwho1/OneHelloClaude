import { useState, useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { Remi } from '../remi/Remi';
import { Button } from '../common/Button';
import { Search, Plus, MapPin, Calendar, Star, User, ChevronDown, ChevronUp } from 'lucide-react';
import type { Hello } from '../../types';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function HelloEntry({ entry }: { entry: Hello }) {
  const [expanded, setExpanded] = useState(false);
  const { showLogModal } = useAppState();
  const hasName = Boolean(entry.name);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        hasName
          ? 'bg-white border-border'
          : 'bg-card-muted border-border/60'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text truncate">
              {hasName ? (
                <>
                  {entry.name} <Star size={14} className="inline text-primary" />
                </>
              ) : (
                <>
                  Someone <User size={14} className="inline text-text-lighter" />
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-text-lighter">
            {entry.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {entry.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(entry.created_at)}
            </span>
          </div>
          {!expanded && entry.notes && (
            <p className="text-sm text-text-light mt-1.5 truncate">{entry.notes}</p>
          )}
          {!hasName && !expanded && (
            <p className="text-xs text-primary mt-1">Tap to add details</p>
          )}
        </div>
        <div className="text-text-lighter ml-2 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50">
          {entry.notes && (
            <p className="text-sm text-text-light whitespace-pre-wrap mb-2">{entry.notes}</p>
          )}
          {entry.challenge_name && (
            <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {entry.challenge_name}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

export function HelloBookScreen() {
  const { state, showLogModal } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return state.entries;
    const q = searchQuery.toLowerCase();
    return state.entries.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.notes && e.notes.toLowerCase().includes(q))
    );
  }, [state.entries, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto pb-24 page-transition">
      <div className="px-5 pt-6 safe-top">
        {/* Header */}
        <h1 className="text-2xl font-bold text-text mb-4">Your Hello Book</h1>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-lighter" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, place, or notes"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-lighter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Entries list */}
        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <HelloEntry key={entry.id} entry={entry} />
            ))}
          </div>
        ) : state.entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Remi expression="logging" size={120} />
            <h3 className="text-lg font-semibold text-text mt-4 mb-2">
              Your first hello will appear here
            </h3>
            <p className="text-text-light text-sm mb-4">
              Complete a challenge or tap + to log one
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <p className="text-text-lighter">No results for "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => showLogModal()}
        className="fixed bottom-20 right-5 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30 safe-bottom"
        aria-label="Log a hello"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
