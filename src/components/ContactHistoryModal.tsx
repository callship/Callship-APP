import React, { useState, useEffect } from 'react';
import { Contact, InteractionLog } from '../types';
import {
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Plus,
  StickyNote,
  Heart,
  Flame,
  User,
  WifiOff,
  Video,
} from 'lucide-react';
import { calculateDaysSince, getShameFreeStatus } from '../utils/storage';
import { sound } from '../utils/audio';

interface Props {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (contactId: string, log: Omit<InteractionLog, 'id'>) => void;
  onOpenCallTimer: (contact: Contact) => void;
  onOpenIcebreaker: (contact: Contact) => void;
}

export const ContactHistoryModal: React.FC<Props> = ({
  contact,
  isOpen,
  onClose,
  onAddLog,
  onOpenCallTimer,
  onOpenIcebreaker,
}) => {
  const [isAddingCustomLog, setIsAddingCustomLog] = useState(false);
  const [logType, setLogType] = useState<'call' | 'text' | 'facetime' | 'meet' | 'note'>('call');
  const [logDuration, setLogDuration] = useState<number>(5);
  const [logNote, setLogNote] = useState('');

  // Lock background scroll when modal is open
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

  const status = getShameFreeStatus(contact);
  const history = contact.interactionHistory || [];

  const totalSprintMinutes = history.reduce(
    (sum, h) => sum + (h.durationMinutes || (h.type === 'call' ? 5 : 0)),
    0
  );

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logNote.trim()) return;

    sound.playSuccessChime();
    onAddLog(contact.id, {
      date: new Date().toISOString(),
      type: logType,
      note: logNote.trim(),
      durationMinutes: ['call', 'facetime', 'meet'].includes(logType) ? logDuration : undefined,
    });

    setLogNote('');
    setIsAddingCustomLog(false);
  };

  const getLogIcon = (type: InteractionLog['type']) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'text':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'facetime':
        return <Video className="w-3.5 h-3.5 text-purple-400" />;
      case 'reset':
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />;
      case 'note':
      default:
        return <StickyNote className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0C]/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="bg-[#0A0A0C] border border-white/10 rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain flex flex-col text-slate-100 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-2xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center justify-center">
                  {contact.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {contact.name}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {contact.relationship}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Phone Log & Memory Timeline
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

        {/* Quick Relationship Stats Pill Strip */}
        <div className="grid grid-cols-3 gap-2.5 py-3.5 border-b border-white/5 text-center shrink-0">
          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Streak
            </div>
            <div className="text-base font-mono font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{contact.streak}</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Phone Sprint Time
            </div>
            <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
              {totalSprintMinutes}m
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-2.5 border border-white/5">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Orbit Cadence
            </div>
            <div className="text-base font-mono font-bold text-indigo-300 mt-0.5">
              {contact.frequencyDays}d
            </div>
          </div>
        </div>

        {/* Action Fast-Track Bar */}
        <div className="flex items-center justify-between gap-2 py-3 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCallTimer(contact);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Sprint</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenIcebreaker(contact);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Icebreakers</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddingCustomLog(!isAddingCustomLog)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Log</span>
          </button>
        </div>

        {/* Add Custom Log Sub-Form */}
        {isAddingCustomLog && (
          <form onSubmit={handleSaveLog} className="p-3.5 bg-white/5 rounded-2xl border border-indigo-500/30 my-2 space-y-3 shrink-0 animate-in fade-in duration-100">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-indigo-300">Log Past Call or Text</span>
              <div className="flex items-center gap-1">
                {(['call', 'text', 'note'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setLogType(t)}
                    className={`text-[10px] px-2 py-1 rounded-lg uppercase font-bold border transition-all cursor-pointer ${
                      logType === t
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {logType === 'call' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Duration:</span>
                {[3, 5, 10, 15, 30].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLogDuration(m)}
                    className={`text-xs px-2 py-0.5 rounded-md border cursor-pointer ${
                      logDuration === m
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-white/5 text-slate-400 border-white/5'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              value={logNote}
              onChange={(e) => setLogNote(e.target.value)}
              placeholder="What did you discuss? (e.g. coffee catchup, job promotion...)"
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCustomLog(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Save to Log
              </button>
            </div>
          </form>
        )}

        {/* Chronological Timeline Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
          {history.length > 0 ? (
            history.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-3.5 text-xs transition-all relative pl-10"
              >
                {/* Left Timeline Node */}
                <div className="absolute left-3 top-3.5 w-6 h-6 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  {getLogIcon(item.type)}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                      {item.type}
                    </span>
                    {item.durationMinutes && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-bold">
                        {item.durationMinutes} min
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {item.note && (
                  <p className="text-slate-300 italic leading-relaxed">
                    "{item.note}"
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-xs text-slate-400">
              No previous phone logs recorded for {contact.name} yet. Complete a call sprint or add an entry above to start!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>{history.length} total entries recorded</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
