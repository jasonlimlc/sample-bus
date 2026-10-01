import React, { useState } from 'react';
import { TRANSIT_ALERTS } from '../data/transitData';
import { TransitAlert } from '../types/transit';

export const AlertsView: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAlerts = TRANSIT_ALERTS.filter((alert) => {
    if (filterType === 'all') return true;
    return alert.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-surface-canvas border border-outline-variant/40 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-status-moderate/10 text-status-moderate flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]" data-icon="warning">
                warning
              </span>
            </div>
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">
                Transit Advisories &amp; Live Alerts
              </h2>
              <p className="text-body-sm text-slate-text-muted">
                Official SBS Transit &amp; LTA Network Operations Feed
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'advisory', 'delay', 'weather'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterType === tab
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'bg-surface-subtle hover:bg-surface-container text-slate-text-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert: TransitAlert) => {
          const isNormal = alert.severity === 'normal';
          const isModerate = alert.severity === 'moderate';

          return (
            <div
              key={alert.id}
              className={`bg-surface-canvas rounded-xl border p-5 shadow-sm transition-all ${
                isNormal
                  ? 'border-status-normal/40 hover:border-status-normal'
                  : isModerate
                  ? 'border-status-moderate/40 hover:border-status-moderate'
                  : 'border-status-disrupted/40 hover:border-status-disrupted'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      isNormal
                        ? 'bg-status-normal/10 text-status-normal'
                        : isModerate
                        ? 'bg-status-moderate/10 text-status-moderate'
                        : 'bg-status-disrupted/10 text-status-disrupted'
                    }`}
                  >
                    {alert.serviceOrLine}
                  </span>
                  <span className="text-xs font-semibold uppercase text-slate-text-muted">
                    • {alert.type}
                  </span>
                </div>
                <span className="text-body-sm font-label-code text-slate-text-muted">
                  {alert.timestamp}
                </span>
              </div>

              <h3 className="text-title-lg font-bold text-on-surface mb-1">
                {alert.title}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {alert.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
