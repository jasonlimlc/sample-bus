import React from 'react';
import { BusStop } from '../types/transit';

interface WalkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: BusStop;
}

export const WalkGuideModal: React.FC<WalkGuideModalProps> = ({
  isOpen,
  onClose,
  stop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-canvas rounded-2xl max-w-lg w-full overflow-hidden border border-outline-variant/40 shadow-2xl space-y-0">
        {/* Header */}
        <div className="bg-primary-container text-on-primary p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]" data-icon="directions_walk">
                directions_walk
              </span>
            </div>
            <div>
              <h3 className="text-title-lg font-title-lg font-bold leading-tight">
                Pedestrian Walk Guide
              </h3>
              <p className="text-xs text-white/80">
                To {stop.name} (Stop {stop.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="close">
              close
            </span>
          </button>
        </div>

        {/* Walk Summary Bar */}
        <div className="bg-surface-subtle p-4 border-b border-outline-variant/30 flex items-center justify-around text-center">
          <div>
            <div className="text-body-sm font-body-sm text-slate-text-muted">Total Distance</div>
            <div className="font-metric-time text-title-lg font-bold text-on-surface">
              {stop.distanceMetersFromUser || 140} meters
            </div>
          </div>
          <div className="w-px h-8 bg-outline-variant/40"></div>
          <div>
            <div className="text-body-sm font-body-sm text-slate-text-muted">Walking Time</div>
            <div className="font-metric-time text-title-lg font-bold text-status-normal">
              ~{stop.walkingMinutes || 2} mins
            </div>
          </div>
          <div className="w-px h-8 bg-outline-variant/40"></div>
          <div>
            <div className="text-body-sm font-body-sm text-slate-text-muted">Path Type</div>
            <div className="text-title-sm font-bold text-primary-container flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]" data-icon="umbrella">
                umbrella
              </span>
              Sheltered
            </div>
          </div>
        </div>

        {/* Step-by-Step Directions */}
        <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <div className="text-title-sm font-semibold text-on-surface">
                Depart Current Position towards Orchard Road
              </div>
              <p className="text-body-sm text-slate-text-muted mt-0.5">
                Head northeast toward Handy Road pedestrian concourse. Follow covered linkway.
              </p>
              <span className="text-[11px] font-label-code text-slate-text-muted bg-surface-subtle px-1.5 py-0.5 rounded mt-1 inline-block">
                60 meters • 1 min
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <div className="text-title-sm font-semibold text-on-surface">
                Pass Dhoby Ghaut MRT Exit B Underpass Ramp
              </div>
              <p className="text-body-sm text-slate-text-muted mt-0.5">
                Keep left along Plaza Singapura atrium entrance. Barrier-free tactile paving available.
              </p>
              <span className="text-[11px] font-label-code text-slate-text-muted bg-surface-subtle px-1.5 py-0.5 rounded mt-1 inline-block">
                40 meters • 30 sec
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-status-normal text-on-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <div className="text-title-sm font-semibold text-on-surface">
                Arrive at Bus Stop 08031 (Dhoby Ghaut Stn Exit B)
              </div>
              <p className="text-body-sm text-slate-text-muted mt-0.5">
                Boarding berth is directly adjacent to pillar B2 with real-time arrival LED display.
              </p>
              <span className="text-[11px] font-label-code text-status-normal bg-status-normal/10 px-1.5 py-0.5 rounded mt-1 inline-block font-semibold">
                Destination Berth reached
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-subtle border-t border-outline-variant/30 flex items-center justify-between">
          <span className="text-body-sm font-body-sm text-slate-text-muted flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-status-normal" data-icon="accessible">
              accessible
            </span>
            Fully barrier-free / wheelchair friendly
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-container text-on-primary font-semibold text-sm rounded-lg hover:bg-primary transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
