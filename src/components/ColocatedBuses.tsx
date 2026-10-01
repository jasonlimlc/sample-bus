import React from 'react';
import { ColocatedBus } from '../types/transit';

interface ColocatedBusesProps {
  stopCode: string;
  buses: ColocatedBus[];
  onSelectService: (serviceNumber: string) => void;
}

export const ColocatedBuses: React.FC<ColocatedBusesProps> = ({
  stopCode,
  buses,
  onSelectService,
}) => {
  return (
    <div className="bg-surface-canvas rounded-xl border border-outline-variant/40 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-title-sm font-title-sm font-bold text-on-surface">
          Other Buses Calling at Stop {stopCode}
        </h4>
        <span className="text-body-sm font-body-sm text-slate-text-muted">
          {buses.length} services
        </span>
      </div>

      <div className="divide-y divide-outline-variant/30">
        {buses.map((bus) => (
          <div
            key={bus.serviceNumber}
            onClick={() => onSelectService(bus.serviceNumber)}
            className="py-2.5 flex items-center justify-between hover:bg-surface-subtle/50 px-1 rounded-md transition-colors cursor-pointer group"
            title={`Switch view to Bus ${bus.serviceNumber}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-10 h-7 rounded ${bus.badgeColorClass} text-on-primary font-headline-md text-xs font-bold flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
              >
                {bus.serviceNumber}
              </span>
              <div>
                <div className="text-title-sm font-title-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors">
                  {bus.destination}
                </div>
                <div className="text-body-sm font-body-sm text-slate-text-muted">
                  {bus.via}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <div
                className={`font-metric-time text-title-sm font-bold ${
                  bus.etaMinutes <= 3 ? 'text-status-normal' : 'text-on-surface'
                }`}
              >
                {bus.etaMinutes} min
              </div>
              <div
                className={`text-[11px] font-medium ${
                  bus.crowdLevel === 'seats-available'
                    ? 'text-slate-text-muted'
                    : 'text-status-moderate'
                }`}
              >
                {bus.crowdLevel === 'seats-available' ? 'Seats avail' : 'Standing'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
