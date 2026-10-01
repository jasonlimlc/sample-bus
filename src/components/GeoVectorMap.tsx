import React, { useState } from 'react';
import { BusStop, TransponderVehicle } from '../types/transit';

interface GeoVectorMapProps {
  activeStop: BusStop;
  transponders: TransponderVehicle[];
  onOpenFullscreen: () => void;
  serviceNumber: string;
}

export const GeoVectorMap: React.FC<GeoVectorMapProps> = ({
  activeStop,
  transponders,
  onOpenFullscreen,
  serviceNumber,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    setCenterOffset({ x: 0, y: 0 });
  };

  return (
    <div className="bg-surface-canvas rounded-xl border border-outline-variant/40 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-canvas">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary-container text-[20px]"
            data-icon="map"
          >
            map
          </span>
          <span className="text-title-sm font-title-sm font-bold text-on-surface">
            Active Geo-Vector Map
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-status-normal animate-ping"></span>
          <span className="text-label-code font-label-code text-xs text-status-normal font-semibold">
            GPS SYNCED
          </span>
        </div>
      </div>

      {/* Stylized Transit Map Canvas Simulation */}
      <div className="relative h-64 bg-surface-subtle overflow-hidden select-none">
        {/* Simulated Vector Roads & Topo Grids */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:28px_28px]"></div>

        {/* Scalable Container with Zoom & Pan */}
        <div
          className="w-full h-full relative transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel}) translate(${centerOffset.x}px, ${centerOffset.y}px)`,
            transformOrigin: '160px 140px',
          }}
        >
          {/* Stylized Metro / Transit Path Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Road Corridor */}
            <path
              d="M 10 230 Q 80 200, 160 140 T 260 110 T 370 30"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Route 147 Primary Transit Path */}
            <path
              d="M 20 220 Q 90 190, 160 140 T 260 110 T 360 40"
              fill="none"
              stroke="#7B1B6D"
              strokeLinecap="round"
              strokeWidth="5"
            />
            {/* White Dashed Track Overlay */}
            <path
              d="M 20 220 Q 90 190, 160 140 T 260 110 T 360 40"
              fill="none"
              stroke="#FFFFFF"
              strokeDasharray="4 6"
              strokeLinecap="round"
              strokeWidth="2"
            />
            {/* Cross Street Bras Basah Corridor */}
            <path
              d="M 60 20 L 320 240"
              fill="none"
              stroke="#94A3B8"
              strokeDasharray="2 4"
              strokeWidth="2"
            />
            {/* Secondary Transit Connection */}
            <path
              d="M 160 140 L 290 230"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="3"
            />
          </svg>

          {/* Map Stop Marker 1: Upstream (Somerset) */}
          <div className="absolute left-[70px] top-[175px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-surface-canvas shadow-xs"></span>
            <span className="text-[10px] font-bold font-label-code bg-surface-canvas/90 px-1 py-0.2 rounded shadow-xs text-slate-text-muted mt-1 whitespace-nowrap">
              Somerset
            </span>
          </div>

          {/* Map Stop Marker 2: User Stop (Dhoby Ghaut / Active Stop) */}
          <div className="absolute left-[160px] top-[140px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
            <span className="absolute w-8 h-8 rounded-full bg-route-express-pink/30 animate-pulse-ring"></span>
            <span className="w-4 h-4 rounded-full bg-route-express-pink border-2 border-surface-canvas shadow-md"></span>
            <div className="bg-primary-container text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mt-1.5 whitespace-nowrap flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]" data-icon="person_pin_circle">
                person_pin_circle
              </span>
              <span>You ({activeStop.code})</span>
            </div>
          </div>

          {/* Map Stop Marker 3: Bras Basah */}
          <div className="absolute left-[260px] top-[110px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-surface-canvas shadow-xs"></span>
            <span className="text-[10px] font-bold font-label-code bg-surface-canvas/90 px-1 py-0.2 rounded shadow-xs text-slate-text-muted mt-1 whitespace-nowrap">
              Bras Basah
            </span>
          </div>

          {/* Map Bus 1 Transponder Icon (Arriving) */}
          <div
            className="absolute left-[125px] top-[155px] -translate-x-1/2 -translate-y-1/2 z-10"
            title="Bus 147 (SBS3482D) - Arriving in 1 min"
          >
            <div className="w-7 h-7 rounded-full bg-status-normal text-on-primary flex items-center justify-center shadow-lg border-2 border-surface-canvas animate-bounce">
              <span className="material-symbols-outlined text-[15px]" data-icon="directions_bus">
                directions_bus
              </span>
            </div>
          </div>

          {/* Map Bus 2 Transponder Icon (7 min away) */}
          <div
            className="absolute left-[40px] top-[205px] -translate-x-1/2 -translate-y-1/2 z-10"
            title="Bus 147 (SBS7721X) - 7 min away"
          >
            <div className="w-6 h-6 rounded-full bg-status-moderate text-on-primary flex items-center justify-center shadow-md border-2 border-surface-canvas">
              <span className="material-symbols-outlined text-[13px]" data-icon="directions_bus">
                directions_bus
              </span>
            </div>
          </div>
        </div>

        {/* Map Floating Action Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-30">
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Re-center on stop"
            title="Re-center on Stop"
            className="w-9 h-9 rounded-lg bg-surface-canvas text-on-surface shadow-md border border-outline-variant/40 flex items-center justify-center hover:bg-surface-subtle active:scale-95 transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[20px] text-primary-container"
              data-icon="filter_center_focus"
            >
              filter_center_focus
            </span>
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom In"
            className="w-9 h-9 rounded-lg bg-surface-canvas text-on-surface shadow-md border border-outline-variant/40 flex items-center justify-center hover:bg-surface-subtle active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="add">
              add
            </span>
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom Out"
            className="w-9 h-9 rounded-lg bg-surface-canvas text-on-surface shadow-md border border-outline-variant/40 flex items-center justify-center hover:bg-surface-subtle active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="remove">
              remove
            </span>
          </button>
        </div>
      </div>

      {/* Footer info & Fullscreen trigger */}
      <div className="p-3 bg-surface-subtle/50 flex items-center justify-between text-body-sm font-body-sm text-slate-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]" data-icon="layers">
            layers
          </span>
          High-frequency trunk line corridor
        </span>
        <button
          type="button"
          onClick={onOpenFullscreen}
          className="text-primary-container font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Fullscreen Map</span>
          <span className="material-symbols-outlined text-[14px]" data-icon="open_in_new">
            open_in_new
          </span>
        </button>
      </div>
    </div>
  );
};
