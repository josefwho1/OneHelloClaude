import { Home, BookOpen, Compass } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import type { TabName } from '../../types';

const tabs: { name: TabName; label: string; icon: typeof Home }[] = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'hellobook', label: 'Hello Book', icon: BookOpen },
  { name: 'quests', label: 'Quests', icon: Compass },
];

export function TabBar() {
  const { state, setActiveTab } = useAppState();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = state.activeTab === tab.name;
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
                isActive ? 'text-primary' : 'text-text-lighter'
              }`}
              aria-label={tab.label}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
