import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import {
  Phone,
  PhoneOff,
  Clock,
  Sparkles,
  CheckCircle2,
  StickyNote,
  X,
  WifiOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { getOfflinePrepPointsForContact } from '../utils/offlineScripts';

interface Props {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onLogCall: (
    contactId: string,
    durationMinutes: number,
    note: string,
    type: 'call' | 'text' | 'facetime'
  ) => void;
}

export const CallTimerModal: React.FC<Props> = ({
  contact,
  isOpen,
  onClose,
  onLogCall,
}) => {
  const [targetMinutes, setTargetMinutes] = useState<number>(5);
  const [secondsLeft, setSecondsLeft] = useState<number>(5 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [prepPoints, setPrepPoints] = useState<string[]>([]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contact) {
      setSecondsLeft(targetMinutes * 60);
      setIsActive(false);
      setNote('');
      const points = getOfflinePrepPointsForContact(contact);
      setPrepPoints(points);
    }
  }, [isOpen, contact, targetMinutes]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      sound.playSuccessChime();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  if (!isOpen || !contact) return null;

  const startSprintAndDial = () => {
    setIsActive(true);
    sound.playPop();
    // Launch phone dialer
    if (contact.phone) {
      const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  const handleFinishAndSave = () => {
    const elapsedMinutes = Math.max(1, Math.ceil((targetMinutes * 60 - secondsLeft) / 60));
    onLogCall(contact.id, elapsedMinutes, note, 'call');
    sound.playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
    });
    onClose();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0C]/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="bg-[#0A0A0C] border border-emerald-500/30 rounded-[32px] max-w-md w-full p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.15)] max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col text-slate-100 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Phone Call Sprint
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Local Log
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Calling <span className="font-semibold text-slate-200">{contact.name}</span>
                {contact.phone && ` (${contact.phone})`}
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

        {/* Timer Display */}
        <div className="py-5 text-center flex flex-col items-center justify-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Goal: {targetMinutes} Min Micro-Call</span>
          </div>

          <div className="text-5xl sm:text-6xl font-mono font-bold text-white tracking-tight my-1 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {formatTime(secondsLeft)}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {isActive
              ? '🎙️ Call active! Keep it short & sweet without burning executive energy.'
              : 'Short calls preserve relationships without feeling trapped.'}
          </p>

          {/* Target duration selector */}
          {!isActive && (
            <div className="flex gap-2 mt-4">
              {[2, 5, 10, 15].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setTargetMinutes(m);
                    setSecondsLeft(m * 60);
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    targetMinutes === m
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {m} mins
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Talking Points Cheat Sheet */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-3.5 mb-3.5 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pre-Call Memory Prep</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-200">
            {prepPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Post-Call Scratchpad Note */}
        <div className="mb-4 shrink-0">
          <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <StickyNote className="w-3.5 h-3.5 text-slate-400" />
            <span>Memory Scratchpad (Kept 100% on device):</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Discussed upcoming birthday, new job project..."
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-white/10 shrink-0">
          {!isActive ? (
            <button
              onClick={startSprintAndDial}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Phone className="w-5 h-5 text-slate-950" />
              <span>📞 CALL NOW (Launch Dial & Start Timer)</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setIsActive(false)}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-colors border border-white/10 cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Pause Timer</span>
              </button>
              <button
                onClick={handleFinishAndSave}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log & Save Call</span>
              </button>
            </div>
          )}

          {!isActive && (
            <button
              onClick={handleFinishAndSave}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Already finished call? Log check-in directly</span>
            </button>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
