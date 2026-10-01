import React from 'react';
import { NEARBY_BUS_STOPS } from '../data/transitData';
import { BusStop } from '../types/transit';

interface NearbyViewProps {
  onSelectStop: (stop: BusStop) => void;
  onTrackService: (serviceNumber: string) => void;
}

export const NearbyView: React.FC<NearbyViewProps> = ({
  onSelectStop,
  onTrackService,
}) => {
  return (
    <div className="space-y-6">
      {/* Geolocation Radar Header */}
      <section className="bg-surface-canvas border border-outline-variant/40 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-status-normal/10 text-status-normal flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]" data-icon="radar">
                radar
              </span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">
                Nearby Bus Stops Radar
              </h2>
              <p className="text-body-sm text-slate-text-muted">
                Somerset / Orchard area, Singapore • Active GPS range 500m
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-normal/10 text-status-normal text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-status-normal animate-ping"></span>
              {NEARBY_BUS_STOPS.length} Stops Located
            </span>
          </div>
        </div>
      </section>

      {/* Nearby Bus Stops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEARBY_BUS_STOPS.map((stop) => {
          return (
            <div
              key={stop.code}
              className="bg-surface-canvas rounded-xl border border-outline-variant/40 p-5 shadow-sm hover:border-primary-container/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-primary-container/10 text-primary-container text-xs font-bold px-2 py-0.5 rounded font-label-code">
                      CODE: {stop.code}
                    </span>
                    {stop.mrtLines && (
                      <span className="bg-route-mrt-purple text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                        MRT {stop.mrtLines.join(' • ')}
                      </span>
                    )}
                  </div>
                  <span className="text-body-sm font-body-sm text-status-normal font-semibold flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-[16px]" data-icon="directions_walk">
                      directions_walk
                    </span>
                    {stop.distanceMetersFromUser}m ({stop.walkingMinutes} min)
                  </span>
                </div>

                <h3 className="text-title-lg font-bold text-on-surface mb-1">
                  {stop.name}
                </h3>
                <p className="text-body-sm text-slate-text-muted mb-3">
                  {stop.roadName}
                </p>

                <div className="p-2.5 rounded-lg bg-surface-subtle border border-outline-variant/30 text-xs text-on-surface-variant mb-4">
                  <span className="font-semibold text-on-surface">Calling Services: </span>
                  {stop.description}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/30">
                <button
                  onClick={() => onSelectStop(stop)}
                  className="flex-1 py-2 bg-primary-container text-on-primary font-semibold text-sm rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]" data-icon="timer">
                    timer
                  </span>
                  <span>View Live Arrivals</span>
                </button>
                <button
                  onClick={() => onTrackService('147')}
                  className="py-2 px-3 border border-outline-variant hover:bg-surface-subtle text-on-surface font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                  title="Track Service 147 at this stop"
                >
                  Line 147
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
