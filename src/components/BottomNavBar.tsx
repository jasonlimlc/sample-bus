import React from 'react';

interface BottomNavBarProps {
  currentTab: 'routes' | 'nearby' | 'alerts' | 'saved';
  onSelectTab: (tab: 'routes' | 'nearby' | 'alerts' | 'saved') => void;
  savedCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-canvas shadow-[0_-4px_16px_rgba(17,17,22,0.06)] border-t border-outline-variant/30">
      {/* Item 1: Routes */}
      <button
        onClick={() => onSelectTab('routes')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl active:scale-95 transition-all cursor-pointer ${
          currentTab === 'routes'
            ? 'text-primary-container bg-surface-container font-bold'
            : 'text-slate-text-muted hover:text-primary-container'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]" data-icon="route">
          route
        </span>
        <span className="text-label-badge font-label-badge mt-0.5">Routes</span>
      </button>

      {/* Item 2: Nearby */}
      <button
        onClick={() => onSelectTab('nearby')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl active:scale-95 transition-all cursor-pointer ${
          currentTab === 'nearby'
            ? 'text-primary-container bg-surface-container font-bold'
            : 'text-slate-text-muted hover:text-primary-container'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]" data-icon="near_me">
          near_me
        </span>
        <span className="text-label-badge font-label-badge mt-0.5">Nearby</span>
      </button>

      {/* Item 3: Alerts */}
      <button
        onClick={() => onSelectTab('alerts')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl active:scale-95 transition-all cursor-pointer relative ${
          currentTab === 'alerts'
            ? 'text-primary-container bg-surface-container font-bold'
            : 'text-slate-text-muted hover:text-primary-container'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]" data-icon="warning">
          warning
        </span>
        <span className="text-label-badge font-label-badge mt-0.5">Alerts</span>
        <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-status-moderate"></span>
      </button>

      {/* Item 4: Saved */}
      <button
        onClick={() => onSelectTab('saved')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl active:scale-95 transition-all cursor-pointer relative ${
          currentTab === 'saved'
            ? 'text-primary-container bg-surface-container font-bold'
            : 'text-slate-text-muted hover:text-primary-container'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]" data-icon="bookmark">
          bookmark
        </span>
        <span className="text-label-badge font-label-badge mt-0.5">Saved</span>
        {savedCount > 0 && (
          <span className="absolute top-0.5 right-1.5 bg-primary-container text-white text-[9px] font-bold px-1 rounded-full">
            {savedCount}
          </span>
        )}
      </button>
    </nav>
  );
};
