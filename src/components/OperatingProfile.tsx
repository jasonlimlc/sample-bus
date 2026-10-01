import React from 'react';
import { BusService } from '../types/transit';

interface OperatingProfileProps {
  service: BusService;
}

export const OperatingProfile: React.FC<OperatingProfileProps> = ({ service }) => {
  return (
    <div className="bg-surface-canvas rounded-xl border border-outline-variant/40 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-title-sm font-title-sm font-bold text-on-surface flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary-container text-[18px]"
            data-icon="info"
          >
            info
          </span>
          <span>Service {service.number} Operating Profile</span>
        </h4>
        <span className="text-label-badge font-label-badge text-status-normal bg-status-normal/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {service.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-surface-subtle border border-outline-variant/30">
          <div className="text-body-sm font-body-sm text-slate-text-muted mb-0.5">
            Peak Frequency
          </div>
          <div className="font-metric-time text-title-lg font-bold text-on-surface">
            {service.peakFrequency}
          </div>
          <div className="text-[11px] text-slate-text-muted">
            Off-peak: {service.offPeakFrequency}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle border border-outline-variant/30">
          <div className="text-body-sm font-body-sm text-slate-text-muted mb-0.5">
            Route Length
          </div>
          <div className="font-metric-time text-title-lg font-bold text-on-surface">
            {service.routeLengthKm} km
          </div>
          <div className="text-[11px] text-slate-text-muted">
            Travel time ∼ {service.travelTimeMinutes} mins
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle border border-outline-variant/30">
          <div className="text-body-sm font-body-sm text-slate-text-muted mb-0.5">
            First Bus (Dir 1)
          </div>
          <div className="font-metric-time text-title-lg font-bold text-on-surface">
            {service.firstBus}
          </div>
          <div className="text-[11px] text-slate-text-muted truncate">
            {service.origin}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle border border-outline-variant/30">
          <div className="text-body-sm font-body-sm text-slate-text-muted mb-0.5">
            Last Bus (Dir 1)
          </div>
          <div className="font-metric-time text-title-lg font-bold text-on-surface">
            {service.lastBus}
          </div>
          <div className="text-[11px] text-slate-text-muted">
            Daily departures
          </div>
        </div>
      </div>
    </div>
  );
};
