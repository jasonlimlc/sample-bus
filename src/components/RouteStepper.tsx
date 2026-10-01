import React, { useState } from 'react';
import { BusStop, TransponderVehicle } from '../types/transit';

interface RouteStepperProps {
  serviceNumber: string;
  stops: BusStop[];
  activeStopCode: string;
  onSelectStop: (stop: BusStop) => void;
  transponders: TransponderVehicle[];
  totalStopsCount: number;
}

export const RouteStepper: React.FC<RouteStepperProps> = ({
  serviceNumber,
  stops,
  activeStopCode,
  onSelectStop,
  transponders,
  totalStopsCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // By default, display the 5 key focus stops as shown in the screenshot, or full list when expanded
  const displayStops = isExpanded ? stops : stops.slice(0, 5);

  return (
    <section className="bg-surface-canvas rounded-xl border border-outline-variant/40 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
        <div>
          <h3 className="text-title-lg font-title-lg font-bold text-on-surface flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-container text-[22px]"
              data-icon="linear_scale"
            >
              linear_scale
            </span>
            <span>Sequential Route Stepper: Line {serviceNumber}</span>
          </h3>
          <p className="text-body-sm font-body-sm text-slate-text-muted">
            Live telemetry &amp; vehicle transponder positions
          </p>
        </div>
        <span className="px-2.5 py-1 rounded bg-surface-subtle font-label-code text-label-code text-on-surface-variant font-medium">
          {totalStopsCount} Total Stops
        </span>
      </div>

      {/* Vertical Stop Timeline */}
      <div className="mt-6 relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-[3px] before:bg-slate-300">
        {displayStops.map((stop, index) => {
          const isCurrentStop = stop.code === activeStopCode;
          const isPassed = index === 0 && !isCurrentStop; // Upstream passed
          const isInterchange = stop.isInterchange;

          // Check if there is a transponder located right after this stop or approaching
          const transponderAfterThis = transponders.find(
            (t) => t.currentStopSequence === stop.sequence
          );

          return (
            <React.Fragment key={stop.code}>
              {/* Stop Row */}
              <div
                onClick={() => onSelectStop(stop)}
                className={`relative flex items-start gap-4 transition-all cursor-pointer ${
                  isPassed ? 'opacity-75' : ''
                }`}
              >
                {/* Timeline Node Glyph */}
                {isCurrentStop ? (
                  <div className="absolute -left-[29px] top-2 flex items-center justify-center">
                    <span className="absolute w-6 h-6 rounded-full bg-route-express-pink/30 animate-pulse-ring"></span>
                    <span className="relative w-4 h-4 rounded-full bg-route-express-pink ring-4 ring-surface-canvas"></span>
                  </div>
                ) : isInterchange ? (
                  <div className="absolute -left-[25px] top-1.5 w-3.5 h-3.5 rotate-45 bg-route-mrt-purple ring-4 ring-surface-canvas"></div>
                ) : (
                  <div
                    className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full ring-4 ring-surface-canvas ${
                      isPassed ? 'bg-slate-400' : 'bg-slate-400'
                    }`}
                  ></div>
                )}

                {/* Stop Card Details */}
                <div
                  className={`flex-1 rounded-xl p-3 sm:p-4 transition-all ${
                    isCurrentStop
                      ? 'bg-primary-container/5 border-2 border-primary-container/30 shadow-sm'
                      : isPassed
                      ? 'bg-surface-subtle/60 rounded-lg p-3 border border-outline-variant/30 hover:border-outline'
                      : 'bg-surface-canvas rounded-lg p-3 border border-outline-variant/40 hover:border-outline shadow-xs'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-headline-md font-bold ${
                          isCurrentStop
                            ? 'text-primary-container text-base'
                            : 'text-on-surface text-sm'
                        }`}
                      >
                        {stop.name}
                      </span>

                      {isCurrentStop && (
                        <span className="bg-route-express-pink text-on-primary text-label-badge font-label-badge px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                          YOU ARE HERE
                        </span>
                      )}

                      {/* MRT Badges if any */}
                      {stop.mrtLines &&
                        !isCurrentStop &&
                        stop.mrtLines.map((line) => {
                          const badgeColor = line.includes('EW')
                            ? 'bg-status-normal'
                            : line.includes('DT')
                            ? 'bg-route-bus-orange'
                            : line.includes('NE') || line.includes('CC')
                            ? 'bg-route-mrt-purple'
                            : 'bg-route-mrt-purple';
                          return (
                            <span
                              key={line}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-on-primary ${badgeColor}`}
                            >
                              {line}
                            </span>
                          );
                        })}
                    </div>

                    <span
                      className={`font-label-code text-label-code ${
                        isCurrentStop
                          ? 'font-bold text-primary-container bg-surface-canvas px-2 py-0.5 rounded border border-primary-container/20'
                          : 'text-slate-text-muted'
                      }`}
                    >
                      {stop.code}
                    </span>
                  </div>

                  <div className="text-body-sm font-body-sm text-on-surface-variant flex flex-wrap items-center gap-2 mt-1">
                    {isCurrentStop ? (
                      <>
                        <span className="font-semibold text-status-normal flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-status-normal"></span>
                          Bus arriving now
                        </span>
                        <span>•</span>
                        <span>Connecting to North South, North East, Circle Lines</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {stop.estMinutesFromPrevious
                            ? `Est. ${stop.estMinutesFromPrevious * index} mins`
                            : isPassed
                            ? 'Departed 3 mins ago'
                            : 'On Schedule'}
                        </span>
                        <span>•</span>
                        <span className="text-slate-text-muted">{stop.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Transponder Vehicle in Transit Marker between stops */}
              {transponderAfterThis && (
                <div className="relative flex items-center pl-2 my-1 animate-pulse-gentle">
                  <div
                    className={`absolute -left-[27px] z-10 w-6 h-6 rounded-full text-on-primary flex items-center justify-center shadow-md ring-2 ring-surface-canvas ${
                      transponderAfterThis.statusType === 'approaching'
                        ? 'bg-primary-container'
                        : 'bg-status-moderate'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[14px]"
                      data-icon="directions_bus"
                    >
                      directions_bus
                    </span>
                  </div>

                  {transponderAfterThis.statusType === 'approaching' ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30 text-primary-container text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                      <span>{transponderAfterThis.statusText}</span>
                    </div>
                  ) : (
                    <span className="text-label-code font-label-code text-xs text-status-moderate font-semibold bg-status-moderate/10 px-2.5 py-0.5 rounded">
                      {transponderAfterThis.statusText}
                    </span>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-6 py-2.5 rounded-lg border border-outline-variant text-primary-container font-title-sm font-title-sm font-semibold hover:bg-surface-subtle transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>
          {isExpanded
            ? 'Collapse to Main Transfer Corridor'
            : `View All ${totalStopsCount} Scheduled Stops`}
        </span>
        <span
          className={`material-symbols-outlined text-[18px] transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          data-icon="expand_more"
        >
          expand_more
        </span>
      </button>
    </section>
  );
};
