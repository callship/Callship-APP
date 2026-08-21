import React, { useEffect } from 'react';
import {
  Sparkles,
  Check,
  Crown,
  Clock,
  ShieldCheck,
  X,
  Infinity as InfinityIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onTogglePro: (pro: boolean) => void;
}

export const ProUpgradeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isPro,
  onTogglePro,
}) => {
  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActivate = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onTogglePro(!isPro);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0C]/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        className="bg-[#0A0A0C] border border-amber-500/30 rounded-[32px] sm:rounded-[36px] max-w-lg w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col text-slate-100 relative my-auto"
      >
        {/* Subtle Ambient Golden Radial Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Callship Supporter
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Lifetime Pass
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zero subscriptions. Zero sneaky recurring fees.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Value Proposition */}
        <div className="py-5 space-y-4 relative z-10">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-300 uppercase tracking-widest font-bold block">
                Pay Once, Keep Forever
              </span>
              <div className="text-2xl font-bold text-white font-mono mt-0.5">
                $4.99 <span className="text-xs font-sans text-slate-400 font-normal">one-time lifetime</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              <p className="font-semibold text-amber-200">No monthly charge</p>
              <p className="text-slate-400">ADHD-anxiety-free</p>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <InfinityIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Unlimited Circle Capacity</div>
                <div className="text-slate-400 text-[11px]">
                  Free tier supports up to 6 core contacts. Pro lets you organize unlimited friends, extended family, and colleagues.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Custom Reminder Cadences</div>
                <div className="text-slate-400 text-[11px]">
                  Set tailored cadences (e.g. every 3 days, 14 days, or exact day counts) to fit unique relationship rhythms.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">VIP Vault Badges & Galaxy Themes</div>
                <div className="text-slate-400 text-[11px]">
                  Unlock exclusive Supporter badge in the Dopamine Vault and deep space orbital styling.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">100% Offline & Private Phone Data</div>
                <div className="text-slate-400 text-[11px]">
                  Your private call logs, notes, and numbers stay 100% on your device with zero tracking.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Toggle / Unlock Button */}
        <div className="pt-3 border-t border-white/10 space-y-3 relative z-10">
          <button
            onClick={handleActivate}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
              isPro
                ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-[1.01] active:scale-98'
            }`}
          >
            {isPro ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Lifetime Supporter Active • Click to Toggle Free</span>
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 text-slate-950" />
                <span>Unlock Lifetime Supporter ($4.99)</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              ← Back to App
            </button>
            <span className="text-[11px] text-slate-500">
              {isPro ? '✨ Pro Features Unlocked' : 'Instant offline activation'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
