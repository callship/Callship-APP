import React, { useEffect } from 'react';
import { Contact } from '../types';
import { Sparkles, RefreshCw, Heart, ShieldCheck, X } from 'lucide-react';
import { calculateDaysSince } from '../utils/storage';
import { sound } from '../utils/audio';

interface Props {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (contactId: string, withMessage: boolean) => void;
  onOpenIcebreaker: () => void;
}

export const GuiltResetModal: React.FC<Props> = ({
  contact,
  isOpen,
  onClose,
  onConfirmReset,
  onOpenIcebreaker,
}) => {
  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !contact) return null;

  const daysSince = calculateDaysSince(contact.lastContactDate);

  const handleQuietReset = () => {
    sound.playResetCalm();
    onConfirmReset(contact.id, false);
    onClose();
  };

  const handleResetAndMessage = () => {
    sound.playResetCalm();
    onConfirmReset(contact.id, true);
    onClose();
    onOpenIcebreaker();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0C]/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="bg-[#0A0A0C] border border-white/10 rounded-[32px] max-w-md w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col text-center text-slate-100 relative my-auto">
        {/* Top-right close button */}
        <div className="flex justify-end mb-1">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calming icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <Heart className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
          The Shame-Free Reset
        </h3>
        <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mb-4">
          ADHD Object-Permanence Protection
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed mb-6 text-left space-y-2.5">
          <p className="flex items-start gap-2 text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              It's been <strong className="text-indigo-300">{daysSince} days</strong> since you last connected with <strong className="text-white">{contact.name}</strong>.
            </span>
          </p>
          <p className="text-slate-400">
            Time blindness is a neurological trait, not a moral failure. Your bond didn't disappear just because you were hyper-focused or overwhelmed.
          </p>
          <p className="font-medium text-slate-200">
            Wiping the slate clean lets you start fresh today with a completely clear conscience.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleResetAndMessage}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Reset Clock & Pick an Icebreaker Script</span>
          </button>

          <button
            onClick={handleQuietReset}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-colors border border-white/10 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Clock Quietly (No Script Needed)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full text-xs text-slate-400 hover:text-white py-1.5 transition-colors cursor-pointer"
          >
            Keep current status & cancel
          </button>
        </div>
      </div>
    </div>
  );
};
