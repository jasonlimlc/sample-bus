import React, { useState } from 'react';

interface TopAppBarProps {
  currentTab: 'routes' | 'nearby' | 'alerts' | 'saved';
  onSelectTab: (tab: 'routes' | 'nearby' | 'alerts' | 'saved') => void;
  onLocateUser: () => void;
  savedCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onSelectTab,
  onLocateUser,
  savedCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-surface-canvas docked full-width top-0 sticky z-40 shadow-sm border-b border-outline-variant/30">
      <div className="flex justify-between items-center w-full px-4 h-14 max-w-7xl mx-auto">
        {/* Brand & Leading Icon */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => onSelectTab('routes')}
        >
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-xs">
            <span className="material-symbols-outlined text-[20px]" data-icon="directions_bus">
              directions_bus
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-title-lg font-title-lg font-bold tracking-tight text-primary-container leading-tight">
              SBS Transit Live
            </span>
            <span className="hidden sm:inline-block text-body-sm font-body-sm text-slate-text-muted -mt-0.5">
              CityTransit Network OS
            </span>
          </div>
        </div>

        {/* Web Desktop Navigation Cluster */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
          <button
            onClick={() => onSelectTab('routes')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'routes'
                ? 'text-primary font-bold bg-surface-container'
                : 'text-on-surface-variant hover:bg-surface-container font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="route">
              route
            </span>
            <span className="text-title-sm font-title-sm">Routes</span>
          </button>

          <button
            onClick={() => onSelectTab('nearby')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'nearby'
                ? 'text-primary font-bold bg-surface-container'
                : 'text-on-surface-variant hover:bg-surface-container font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="near_me">
              near_me
            </span>
            <span className="text-title-sm font-title-sm">Nearby</span>
          </button>

          <button
            onClick={() => onSelectTab('alerts')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer relative ${
              currentTab === 'alerts'
                ? 'text-primary font-bold bg-surface-container'
                : 'text-on-surface-variant hover:bg-surface-container font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="warning">
              warning
            </span>
            <span className="text-title-sm font-title-sm">Alerts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-status-moderate"></span>
          </button>

          <button
            onClick={() => onSelectTab('saved')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'saved'
                ? 'text-primary font-bold bg-surface-container'
                : 'text-on-surface-variant hover:bg-surface-container font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="bookmark">
              bookmark
            </span>
            <span className="text-title-sm font-title-sm">Saved</span>
            {savedCount > 0 && (
              <span className="bg-primary-container text-on-primary text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Live Location & Network Status Telemetry */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 bg-surface-subtle border border-outline-variant/40 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-normal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-normal"></span>
            </span>
            <span className="text-body-sm font-body-sm text-on-surface font-medium">
              Somerset / Orchard area, Singapore • ±5m
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-status-normal/10 border border-status-normal/30 text-status-normal px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px]" data-icon="sensors">
              sensors
            </span>
            <span className="text-label-badge font-label-badge uppercase tracking-wider font-bold">
              LTA LIVE
            </span>
          </div>

          <div className="flex items-center gap-1 relative">
            <button
              onClick={onLocateUser}
              aria-label="Locate me"
              title="Recalibrate GPS Location"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95 duration-150 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="my_location">
                my_location
              </span>
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              title="Transit Alerts & Notifications"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95 duration-150 relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon="notifications">
                notifications
              </span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-route-express-pink rounded-full ring-2 ring-surface-canvas"></span>
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-surface-canvas border border-outline-variant/50 rounded-xl shadow-xl z-50 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                  <span className="text-title-sm font-title-sm font-bold text-on-surface">Transit Dispatches</span>
                  <span className="text-[11px] font-semibold text-status-normal bg-status-normal/10 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-outline-variant/20 hover:bg-surface-container transition-colors">
                    <div className="flex items-center justify-between text-xs font-bold text-route-express-pink">
                      <span>Line 147 Headway</span>
                      <span className="text-[10px] text-slate-text-muted">Just now</span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface mt-0.5">
                      Bus 147 (SBS3482D) arriving now at Dhoby Ghaut Exit B.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-subtle border border-outline-variant/20 hover:bg-surface-container transition-colors">
                    <div className="flex items-center justify-between text-xs font-bold text-status-moderate">
                      <span>Weather Alert</span>
                      <span className="text-[10px] text-slate-text-muted">15m ago</span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface mt-0.5">
                      Passing showers in Orchard corridor. Wet surface caution.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTab('alerts');
                  }}
                  className="w-full text-center text-xs font-semibold text-primary-container pt-1 hover:underline cursor-pointer"
                >
                  View All Live Advisories →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Header Location Pill */}
      <div className="lg:hidden bg-surface-container-low px-4 py-1.5 border-b border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="material-symbols-outlined text-[16px] text-primary" data-icon="location_on">
            location_on
          </span>
          <span className="text-body-sm font-body-sm text-on-surface truncate">
            Somerset / Orchard area, Singapore • 5m accuracy
          </span>
        </div>
        <span className="text-label-code font-label-code text-slate-text-muted shrink-0 text-xs">
          GPS SYNC
        </span>
      </div>
    </header>
  );
};
