import React from 'react';
import { BusStop } from '../types/transit';

interface SavedViewProps {
  savedStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onRemoveSavedStop: (code: string) => void;
  onSwitchToRoutes: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedStops,
  onSelectStop,
  onRemoveSavedStop,
  onSwitchToRoutes,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-surface-canvas border border-outline-variant/40 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]" data-icon="bookmark">
                bookmark
              </span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">
                Saved Stops &amp; Commute Favorites
              </h2>
              <p className="text-body-sm text-slate-text-muted">
                Fast-track transit departure boards for your daily routes
              </p>
            </div>
          </div>

          <span className="text-body-sm font-semibold text-primary-container bg-primary-container/10 px-3 py-1 rounded-full self-start sm:self-auto">
            {savedStops.length} Bookmarked
          </span>
        </div>
      </section>

      {savedStops.length === 0 ? (
        <div className="bg-surface-canvas rounded-xl border border-outline-variant/40 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-subtle text-slate-text-muted flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]" data-icon="bookmark_border">
              bookmark_border
            </span>
          </div>
          <h3 className="text-title-lg font-bold text-on-surface">No saved stops yet</h3>
          <p className="text-body-sm text-slate-text-muted max-w-sm mx-auto">
            Click "Save Stop" on Dhoby Ghaut Exit B or any transit station to pin it to this dashboard.
          </p>
          <button
            onClick={onSwitchToRoutes}
            className="px-4 py-2 bg-primary-container text-on-primary font-semibold text-sm rounded-lg hover:bg-primary transition-colors cursor-pointer"
          >
            Explore Routes &amp; Stops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedStops.map((stop) => (
            <div
              key={stop.code}
              className="bg-surface-canvas rounded-xl border border-outline-variant/40 p-5 shadow-sm hover:border-primary-container/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="bg-primary-container/10 text-primary-container text-xs font-bold px-2 py-0.5 rounded font-label-code">
                    CODE: {stop.code}
                  </span>
                  <button
                    onClick={() => onRemoveSavedStop(stop.code)}
                    className="text-slate-text-muted hover:text-status-disrupted p-1 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="delete">
                      delete
                    </span>
                  </button>
                </div>

                <h3 className="text-title-lg font-bold text-on-surface mb-1">
                  {stop.name}
                </h3>
                <p className="text-body-sm text-slate-text-muted mb-3">
                  {stop.roadName}
                </p>

                {stop.mrtLines && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-xs text-slate-text-muted">Interchange:</span>
                    <span className="bg-route-mrt-purple text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {stop.mrtLines.join(' • ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-xs text-status-normal font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-status-normal"></span>
                  Live transponders active
                </span>
                <button
                  onClick={() => onSelectStop(stop)}
                  className="px-4 py-1.5 bg-primary-container text-on-primary font-semibold text-xs rounded-lg hover:bg-primary transition-colors cursor-pointer"
                >
                  Track Bus Arrivals →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
