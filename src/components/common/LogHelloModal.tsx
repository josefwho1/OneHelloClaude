import { useState, useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { getChallengeForDay } from '../../lib/challenges';
import { Remi } from '../remi/Remi';
import { Button } from './Button';
import { X } from 'lucide-react';

export function LogHelloModal() {
  const { state, hideLogModal, logHello, updateHello, showToast } = useAppState();
  const { showLogModal: isOpen, logModalChallengeId } = state;

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Pre-fill notes for challenge completions
  useEffect(() => {
    if (isOpen && logModalChallengeId) {
      const challenge = getChallengeForDay(logModalChallengeId);
      if (challenge) {
        setNotes(`One Hello 7-Day Challenge | Day ${logModalChallengeId} | ${challenge.name}`);
      }
      // Find the existing entry to update
    } else {
      setName('');
      setLocation('');
      setNotes('');
    }
  }, [isOpen, logModalChallengeId]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (logModalChallengeId) {
      // Find the auto-created entry and update it
      const existingEntry = state.entries.find(
        (e) => e.challenge_id === logModalChallengeId && !e.has_details
      );
      if (existingEntry) {
        updateHello(existingEntry.id, {
          name: name.trim() || null,
          location: location.trim() || null,
          notes: notes.trim() || existingEntry.notes,
          has_details: Boolean(name.trim() || location.trim()),
        });
      }
    } else {
      // Log a new hello
      logHello({
        name: name.trim() || null,
        location: location.trim() || null,
        notes: notes.trim() || null,
        challenge_id: null,
        challenge_name: null,
        has_details: Boolean(name.trim() || location.trim()),
      });
    }

    showToast('Hello logged! 🦝');
    hideLogModal();
    setName('');
    setLocation('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={hideLogModal} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg animate-slide-up safe-bottom">
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={hideLogModal}
            className="absolute top-4 right-4 p-2 text-text-lighter hover:text-text rounded-full hover:bg-secondary"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <Remi expression="logging" size={80} />
            <h2 className="text-xl font-bold text-text mt-2">Log your hello</h2>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-light mb-1.5 block">
                Name <span className="text-text-lighter">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Their name"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-lighter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-light mb-1.5 block">
                Where you met <span className="text-text-lighter">(optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Coffee shop, park, bus stop..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-lighter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-light mb-1.5 block">
                Notes <span className="text-text-lighter">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you talk about?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-lighter focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <Button onClick={handleSubmit} fullWidth size="lg">
              Log hello 👋
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
