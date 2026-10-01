import React from 'react';
import { BusStop, BusArrivalPrediction } from '../types/transit';

interface NearestStopSpotlightProps {
  stop: BusStop;
  serviceNumber: string;
  predictions: BusArrivalPrediction[];
  secondsSinceUpdate: number;
  onRefresh: () => void;
  onOpenWalkGuide: () => void;
  onOpenRemind: () => void;
  isSaved: boolean;
  onToggleSaveStop: () => void;
}

export const NearestStopSpotlight: React.FC<NearestStopSpotlightProps> = ({
  stop,
  serviceNumber,
  predictions,
  secondsSinceUpdate,
  onRefresh,
  onOpenWalkGuide,
  onOpenRemind,
  isSaved,
  onToggleSaveStop,
}) => {
  return (
    <section className="bg-surface-canvas border-2 border-primary-container/20 rounded-xl p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Contextual Accent Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-container via-route-bus-orange to-route-express-pink"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-outline-variant/30">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-badge font-label-badge bg-route-express-pink/10 text-route-express-pink font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-route-express-pink animate-ping"></span>
              Nearest Stop Identified
            </span>
            <span className="bg-surface-subtle border border-outline-variant px-2 py-0.5 rounded font-label-code text-label-code text-on-surface font-semibold">
              CODE: {stop.code}
            </span>
            <span className="text-body-sm font-body-sm text-slate-text-muted flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[16px]" data-icon="directions_walk">
                directions_walk
              </span>
              {stop.distanceMetersFromUser || 140}m away • {stop.walkingMinutes || 2} min walk
            </span>
          </div>

          <h2 className="text-headline-md font-headline-md text-on-surface font-bold flex flex-wrap items-center gap-2">
            <span>{stop.name}</span>
            {stop.mrtLines && stop.mrtLines.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-route-mrt-purple text-on-primary">
                {stop.mrtLines.join(' • ')}
              </span>
            )}
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-0.5">
            {stop.roadName}
          </p>
        </div>

        {/* Quick Action Utility Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={onOpenWalkGuide}
            className="h-10 px-3.5 rounded-lg border border-primary-container text-primary-container font-title-sm font-title-sm font-semibold hover:bg-surface-container flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="turn_right">
              turn_right
            </span>
            <span>Walk Guide</span>
          </button>

          <button
            onClick={onToggleSaveStop}
            className={`h-10 px-3.5 rounded-lg border font-title-sm font-title-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98 ${
              isSaved
                ? 'bg-primary-container/10 border-primary-container text-primary-container font-semibold'
                : 'border-outline-variant text-on-surface hover:bg-surface-subtle'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isSaved ? 'text-primary-container' : 'text-route-bus-orange'
              }`}
              data-icon="bookmark"
            >
              bookmark
            </span>
            <span>{isSaved ? 'Saved' : 'Save Stop'}</span>
          </button>

          <button
            onClick={onOpenRemind}
            className="h-10 px-3.5 rounded-lg bg-surface-subtle hover:bg-surface-container-high text-on-surface font-title-sm font-title-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="alarm">
              alarm
            </span>
            <span>Remind</span>
          </button>
        </div>
      </div>

      {/* Live Countdown Cards for this bus service at this stop */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-7 px-2.5 rounded bg-primary-container text-on-primary font-headline-md text-sm font-bold flex items-center">
              {serviceNumber}
            </span>
            <span className="text-title-sm font-title-sm font-semibold text-on-surface">
              Upcoming Arrivals at this Stop
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="text-body-sm font-body-sm text-slate-text-muted hover:text-on-surface flex items-center gap-1 cursor-pointer transition-colors"
            title="Refresh arrival countdowns"
          >
            <span
              className="material-symbols-outlined text-[16px] text-status-normal animate-spin"
              data-icon="refresh"
              style={{ animationDuration: '4s' }}
            >
              refresh
            </span>
            Updated {secondsSinceUpdate}s ago
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Bus 1 (Arriving Now / Next Service) */}
          {predictions[0] && (
            <div className="rounded-xl border-2 border-status-normal/40 bg-status-normal/5 p-4 relative overflow-hidden transition-all hover:shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-badge font-label-badge text-status-normal font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-status-normal animate-ping"></span>
                  NEXT SERVICE
                </span>
                <span className="inline-flex items-center gap-1 text-label-code font-label-code text-xs bg-surface-canvas border border-outline-variant/60 px-1.5 py-0.5 rounded text-on-surface">
                  <span className="material-symbols-outlined text-[14px]" data-icon="directions_bus">
                    directions_bus
                  </span>
                  {predictions[0].deckType}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                {predictions[0].etaMinutes === 0 ? (
                  <span className="font-metric-time text-headline-lg font-bold text-status-normal tracking-tight">
                    ARRIVING
                  </span>
                ) : (
                  <span className="font-metric-time text-headline-lg font-bold text-status-normal tracking-tight">
                    {predictions[0].etaMinutes}{' '}
                    <span className="text-title-lg font-title-lg font-normal text-slate-text-muted">
                      min
                    </span>
                  </span>
                )}
                <span className="text-body-sm font-body-sm text-slate-text-muted font-medium">
                  Plate: {predictions[0].plateNumber}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-status-normal/20">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ring-2 ${
                      predictions[0].crowdLevel === 'seats-available'
                        ? 'bg-status-normal ring-status-normal/20'
                        : predictions[0].crowdLevel === 'standing-available'
                        ? 'bg-status-moderate ring-status-moderate/20'
                        : 'bg-status-disrupted ring-status-disrupted/20'
                    }`}
                  ></span>
                  <span
                    className={`text-body-sm font-body-sm font-semibold ${
                      predictions[0].crowdLevel === 'seats-available'
                        ? 'text-status-normal'
                        : 'text-status-moderate'
                    }`}
                  >
                    {predictions[0].crowdLevel === 'seats-available'
                      ? 'Seats Available'
                      : 'Standing Available'}
                  </span>
                </div>
                {predictions[0].wheelchairAccessible && (
                  <span
                    className="material-symbols-outlined text-[18px] text-status-normal"
                    data-icon="accessible"
                    title="Wheelchair Accessible"
                  >
                    accessible
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bus 2 (2nd Bus) */}
          {predictions[1] && (
            <div className="rounded-xl border border-outline-variant/60 bg-surface-canvas p-4 relative transition-all hover:border-status-moderate/40 hover:shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-badge font-label-badge text-on-surface-variant font-bold">
                  2ND BUS
                </span>
                <span className="inline-flex items-center gap-1 text-label-code font-label-code text-xs bg-surface-subtle px-1.5 py-0.5 rounded text-slate-text-muted">
                  <span className="material-symbols-outlined text-[14px]" data-icon="directions_bus">
                    directions_bus
                  </span>
                  {predictions[1].deckType}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-metric-time text-headline-lg font-bold text-on-surface tracking-tight">
                  {predictions[1].etaMinutes}{' '}
                  <span className="text-title-lg font-title-lg font-normal text-slate-text-muted">
                    min
                  </span>
                </span>
                <span className="text-body-sm font-body-sm text-slate-text-muted font-medium">
                  Plate: {predictions[1].plateNumber}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ring-2 ${
                      predictions[1].crowdLevel === 'seats-available'
                        ? 'bg-status-normal ring-status-normal/20'
                        : 'bg-status-moderate ring-status-moderate/20'
                    }`}
                  ></span>
                  <span
                    className={`text-body-sm font-body-sm font-semibold ${
                      predictions[1].crowdLevel === 'seats-available'
                        ? 'text-status-normal'
                        : 'text-status-moderate'
                    }`}
                  >
                    {predictions[1].crowdLevel === 'seats-available'
                      ? 'Seats Available'
                      : 'Standing Available'}
                  </span>
                </div>
                {predictions[1].wheelchairAccessible && (
                  <span
                    className="material-symbols-outlined text-[18px] text-on-surface-variant"
                    data-icon="accessible"
                    title="Wheelchair Accessible"
                  >
                    accessible
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bus 3 (3rd Bus) */}
          {predictions[2] && (
            <div className="rounded-xl border border-outline-variant/60 bg-surface-canvas p-4 relative transition-all hover:border-outline hover:shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-badge font-label-badge text-on-surface-variant font-bold">
                  3RD BUS
                </span>
                <span className="inline-flex items-center gap-1 text-label-code font-label-code text-xs bg-surface-subtle px-1.5 py-0.5 rounded text-slate-text-muted">
                  <span className="material-symbols-outlined text-[14px]" data-icon="directions_bus">
                    directions_bus
                  </span>
                  {predictions[2].deckType}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-metric-time text-headline-lg font-bold text-on-surface tracking-tight">
                  {predictions[2].etaMinutes}{' '}
                  <span className="text-title-lg font-title-lg font-normal text-slate-text-muted">
                    min
                  </span>
                </span>
                <span className="text-body-sm font-body-sm text-slate-text-muted font-medium">
                  Plate: {predictions[2].plateNumber}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-normal ring-2 ring-status-normal/20"></span>
                  <span className="text-body-sm font-body-sm font-semibold text-status-normal">
                    {predictions[2].crowdLevel === 'seats-available'
                      ? 'Seats Available'
                      : 'Standing Available'}
                  </span>
                </div>
                {predictions[2].wheelchairAccessible && (
                  <span
                    className="material-symbols-outlined text-[18px] text-on-surface-variant"
                    data-icon="accessible"
                    title="Wheelchair Accessible"
                  >
                    accessible
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
