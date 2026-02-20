import { getPendingSync } from '../../lib/storage';
import { useEffect, useState } from 'react';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';

export function SyncBadge() {
  const [status, setStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    function check() {
      const pending = getPendingSync();
      setPendingCount(pending.length);
      if (pending.length === 0) setStatus('synced');
      else if (navigator.onLine) setStatus('syncing');
      else setStatus('offline');
    }
    check();
    const interval = setInterval(check, 3000);
    window.addEventListener('online', check);
    window.addEventListener('offline', check);
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', check);
      window.removeEventListener('offline', check);
    };
  }, []);

  if (status === 'synced') return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        status === 'syncing'
          ? 'bg-warning/10 text-warning'
          : 'bg-danger/10 text-danger'
      }`}
    >
      {status === 'syncing' ? (
        <>
          <Loader2 size={12} className="animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <CloudOff size={12} />
          Offline · {pendingCount} pending
        </>
      )}
    </div>
  );
}
