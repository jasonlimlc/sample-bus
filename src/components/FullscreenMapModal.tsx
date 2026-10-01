import React, { useState } from 'react';
import { BusStop, TransponderVehicle } from '../types/transit';

interface FullscreenMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceNumber: string;
  stops: BusStop[];
  activeStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  transponders: TransponderVehicle[];
}

export const FullscreenMapModal: React.FC<FullscreenMapModalProps> = ({
  isOpen,
  onClose,
  serviceNumber,
  stops,
  activeStop,
  onSelectStop,
  transponders,
}) => {
  const [showStops, setShowStops] = useState(true);
  const [showTransponders, setShowTransponders] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-subtle">
      {/* Top Controls Bar */}
      <div className="bg-surface-canvas border-b border-outline-variant/40 px-4 py-3 flex items-center justify-between shadow-xs z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold">
            {serviceNumber}
          </div>
          <div>
            <h3 className="text-title-sm font-bold text-on-surface">
              Line {serviceNumber} Full Transit Corridor Map
            </h3>
            <p className="text-xs text-slate-text-muted">
              Vector Telemetry • {stops.length} Stops Monitored
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setShowStops(!showStops)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              showStops
                ? 'bg-primary-container/10 border-primary-container text-primary-container'
                : 'border-outline-variant text-slate-text-muted hover:bg-surface-subtle'
            }`}
          >
            All Stops ({stops.length})
          </button>
          <button
            onClick={() => setShowTransponders(!showTransponders)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              showTransponders
                ? 'bg-status-normal/10 border-status-normal text-status-normal'
                : 'border-outline-variant text-slate-text-muted hover:bg-surface-subtle'
            }`}
          >
            Transponders ({transponders.length})
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-surface-subtle hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="close">
            close
          </span>
        </button>
      </div>

      {/* Map Body Canvas */}
      <div className="relative flex-1 overflow-hidden bg-[#f1f3f7]">
        {/* Vector Grid Background */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        {/* Interactive Map View */}
        <div
          className="w-full h-full relative"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: '50% 50%',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Main Road Corridor */}
            <path
              d="M 50 650 Q 250 500, 480 400 T 800 280 T 1100 120"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Route 147 Polyline */}
            <path
              d="M 50 650 Q 250 500, 480 400 T 800 280 T 1100 120"
              fill="none"
              stroke="#7B1B6D"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 50 650 Q 250 500, 480 400 T 800 280 T 1100 120"
              fill="none"
              stroke="#FFFFFF"
              strokeDasharray="6 8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Render Stops along map */}
          {showStops &&
            stops.slice(0, 10).map((stop, i) => {
              const xPos = 80 + i * 110;
              const yPos = 620 - i * 50;
              const isSelected = stop.code === activeStop.code;

              return (
                <div
                  key={stop.code}
                  onClick={() => onSelectStop(stop)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
                  style={{ left: `${xPos}px`, top: `${yPos}px` }}
                >
                  {isSelected && (
                    <span className="absolute w-10 h-10 rounded-full bg-route-express-pink/30 animate-pulse-ring"></span>
                  )}
                  <span
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-125 ${
                      isSelected
                        ? 'bg-route-express-pink scale-110'
                        : stop.isInterchange
                        ? 'bg-route-mrt-purple rotate-45'
                        : 'bg-slate-500'
                    }`}
                  ></span>
                  <div
                    className={`mt-1.5 px-2 py-0.5 rounded shadow-sm text-[11px] font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-primary-container text-white'
                        : 'bg-surface-canvas/90 text-on-surface group-hover:bg-primary-container group-hover:text-white'
                    }`}
                  >
                    {stop.name} ({stop.code})
                  </div>
                </div>
              );
            })}

          {/* Transponder Vehicles */}
          {showTransponders && (
            <>
              {/* Transponder 1 */}
              <div
                className="absolute z-20"
                style={{ left: '160px', top: '585px' }}
                title="Bus 147 (SBS3482D)"
              >
                <div className="flex items-center gap-1.5 bg-status-normal text-white px-2 py-1 rounded-full shadow-lg border-2 border-white">
                  <span className="material-symbols-outlined text-[16px]" data-icon="directions_bus">
                    directions_bus
                  </span>
                  <span className="text-xs font-bold font-label-code">SBS3482D • 32km/h</span>
                </div>
              </div>

              {/* Transponder 2 */}
              <div
                className="absolute z-20"
                style={{ left: '420px', top: '430px' }}
                title="Bus 147 (SBS7721X)"
              >
                <div className="flex items-center gap-1.5 bg-status-moderate text-white px-2 py-1 rounded-full shadow-lg border-2 border-white">
                  <span className="material-symbols-outlined text-[16px]" data-icon="directions_bus">
                    directions_bus
                  </span>
                  <span className="text-xs font-bold font-label-code">SBS7721X • 28km/h</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Map Floating Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
            className="w-10 h-10 rounded-xl bg-surface-canvas text-on-surface shadow-lg border border-outline-variant/40 flex items-center justify-center hover:bg-surface-subtle cursor-pointer active:scale-95"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[22px]" data-icon="add">
              add
            </span>
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.7))}
            className="w-10 h-10 rounded-xl bg-surface-canvas text-on-surface shadow-lg border border-outline-variant/40 flex items-center justify-center hover:bg-surface-subtle cursor-pointer active:scale-95"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[22px]" data-icon="remove">
              remove
            </span>
          </button>
        </div>

        {/* Selected Stop Panel Overlay */}
        <div className="absolute bottom-6 left-6 right-16 sm:right-auto sm:max-w-md bg-surface-canvas/95 backdrop-blur-sm p-4 rounded-xl border border-outline-variant/40 shadow-xl z-30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-container uppercase tracking-wider">
              Selected Stop
            </span>
            <span className="text-xs font-label-code bg-surface-subtle px-1.5 py-0.5 rounded text-slate-text-muted">
              CODE: {activeStop.code}
            </span>
          </div>
          <div className="text-title-sm font-bold text-on-surface mt-1">
            {activeStop.name}
          </div>
          <p className="text-body-sm text-slate-text-muted mt-0.5">
            {activeStop.roadName}
          </p>
        </div>
      </div>
    </div>
  );
};
