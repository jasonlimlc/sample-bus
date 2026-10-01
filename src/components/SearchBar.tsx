import React from 'react';
import { FREQUENT_SERVICES } from '../data/transitData';
import { BusService } from '../types/transit';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  activeServiceNumber: string;
  onSelectService: (serviceNum: string) => void;
  activeDirection: 1 | 2;
  onChangeDirection: (dir: 1 | 2) => void;
  currentService: BusService;
  showNearestStop: boolean;
  onToggleNearestStop: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  activeServiceNumber,
  onSelectService,
  activeDirection,
  onChangeDirection,
  currentService,
  showNearestStop,
  onToggleNearestStop,
}) => {
  return (
    <section className="bg-surface-canvas border border-outline-variant/40 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        {/* Search Input Bar */}
        <form onSubmit={onSearchSubmit} className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-container">
            <span className="material-symbols-outlined text-[22px]" data-icon="search">
              search
            </span>
          </div>
          <input
            className="w-full h-12 pl-11 pr-24 rounded-lg bg-surface-subtle border border-outline-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container text-title-lg font-title-lg text-on-surface font-semibold placeholder:text-slate-text-muted transition-all outline-none"
            placeholder="Search bus service, stop code, or road name..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                className="px-2 py-1 rounded text-body-sm font-body-sm text-slate-text-muted hover:text-on-surface flex items-center gap-1 cursor-pointer"
                title="Clear Search"
              >
                <span className="material-symbols-outlined text-[18px]" data-icon="cancel">
                  cancel
                </span>
              </button>
            )}
            <button
              type="submit"
              className="h-9 px-3 rounded-md bg-primary-container text-on-primary text-title-sm font-title-sm font-medium hover:bg-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Go</span>
            </button>
          </div>
        </form>

        {/* Quick Access Popular Bus Routes */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-body-sm font-body-sm text-slate-text-muted mr-1 shrink-0 font-medium">
            Frequent:
          </span>
          {FREQUENT_SERVICES.map((serviceNum) => {
            const isActive = serviceNum === activeServiceNumber;
            return (
              <button
                key={serviceNum}
                onClick={() => onSelectService(serviceNum)}
                className={`h-8 px-2.5 rounded-md font-headline-md text-sm font-bold flex items-center shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary shadow-sm ring-2 ring-primary-container/20'
                    : 'bg-surface-subtle hover:bg-surface-container border border-outline-variant/60 text-on-surface'
                }`}
              >
                {serviceNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Direction Toggle & Geolocation Proximity Mode Switcher */}
      <div className="pt-3 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Direction Segmented Controller */}
        <div className="flex items-center bg-surface-subtle p-1 rounded-lg border border-outline-variant/30 max-w-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onChangeDirection(1)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-title-sm font-title-sm transition-all cursor-pointer ${
              activeDirection === 1
                ? 'bg-surface-canvas shadow-xs text-primary-container font-semibold border border-outline-variant/20'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
          >
            {activeDirection === 1 && (
              <span className="w-2 h-2 rounded-full bg-status-normal"></span>
            )}
            <span>{currentService.direction1Label}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeDirection(2)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-title-sm font-title-sm transition-all cursor-pointer ${
              activeDirection === 2
                ? 'bg-surface-canvas shadow-xs text-primary-container font-semibold border border-outline-variant/20'
                : 'text-on-surface-variant hover:text-on-surface font-medium'
            }`}
          >
            {activeDirection === 2 && (
              <span className="w-2 h-2 rounded-full bg-status-normal"></span>
            )}
            <span>{currentService.direction2Label}</span>
          </button>
        </div>

        {/* Proximity Toggle Switch */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <label
            htmlFor="nearest-toggle"
            onClick={onToggleNearestStop}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="material-symbols-outlined text-[20px] text-primary" data-icon="near_me">
              near_me
            </span>
            <span className="text-body-md font-body-md font-medium text-on-surface">
              Show Nearest Stop to Me
            </span>
          </label>
          <button
            type="button"
            id="nearest-toggle"
            role="switch"
            aria-checked={showNearestStop}
            onClick={onToggleNearestStop}
            className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors focus:outline-none cursor-pointer ${
              showNearestStop ? 'bg-primary-container' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-on-primary rounded-full shadow-md transform transition-transform ${
                showNearestStop ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>
    </section>
  );
};
