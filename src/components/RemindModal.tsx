import React, { useState } from 'react';
import { BusStop } from '../types/transit';

interface RemindModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceNumber: string;
  stop: BusStop;
  onSetReminder: (thresholdMinutes: number) => void;
}

export const RemindModal: React.FC<RemindModalProps> = ({
  isOpen,
  onClose,
  serviceNumber,
  stop,
  onSetReminder,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(3);
  const [vibrateAlert, setVibrateAlert] = useState<boolean>(true);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSetReminder(selectedMinutes);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-canvas rounded-2xl max-w-md w-full overflow-hidden border border-outline-variant/40 shadow-2xl">
        {/* Header */}
        <div className="bg-primary-container text-on-primary p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]" data-icon="alarm">
                alarm
              </span>
            </div>
            <div>
              <h3 className="text-title-lg font-title-lg font-bold">
                Set Arrival Reminder
              </h3>
              <p className="text-xs text-white/80">
                Bus {serviceNumber} at {stop.name}
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

        {confirmed ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-status-normal/10 text-status-normal flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]" data-icon="check_circle">
                check_circle
              </span>
            </div>
            <h4 className="text-title-lg font-bold text-on-surface">
              Reminder Active!
            </h4>
            <p className="text-body-sm text-slate-text-muted">
              We will alert you {selectedMinutes === 0 ? 'when Bus arrives' : `${selectedMinutes} minutes before Bus ${serviceNumber} arrives`} at {stop.name}.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div>
              <label className="text-title-sm font-semibold text-on-surface block mb-2">
                Notify me when Bus {serviceNumber} is:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: 'Arriving', value: 0, desc: 'At berth' },
                  { label: '3 Mins', value: 3, desc: '1 stop away' },
                  { label: '5 Mins', value: 5, desc: '2 stops away' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedMinutes(opt.value)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedMinutes === opt.value
                        ? 'bg-primary-container/10 border-primary-container ring-2 ring-primary-container/30 text-primary-container font-bold'
                        : 'border-outline-variant/60 hover:bg-surface-subtle text-on-surface font-medium'
                    }`}
                  >
                    <div className="text-title-sm">{opt.label}</div>
                    <div className="text-[11px] text-slate-text-muted mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-slate-text-muted" data-icon="vibration">
                  vibration
                </span>
                <span className="text-body-md text-on-surface font-medium">
                  Sound &amp; Haptic Alarm
                </span>
              </div>
              <input
                type="checkbox"
                checked={vibrateAlert}
                onChange={(e) => setVibrateAlert(e.target.checked)}
                className="w-5 h-5 text-primary-container rounded cursor-pointer accent-primary-container"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-text-muted hover:text-on-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary font-semibold text-sm rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Activate Reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
