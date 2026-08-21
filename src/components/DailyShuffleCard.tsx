import React, { useState } from 'react';
import { Contact, OrbitTier } from '../types';
import {
  Phone,
  MessageSquare,
  Sparkles,
  Clock,
  Heart,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Tag,
  StickyNote,
  Compass,
  Dices,
  WifiOff,
} from 'lucide-react';
import { getShameFreeStatus } from '../utils/storage';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  contact: Contact;
  deck: Contact[];
  isPro?: boolean;
  onOpenProModal?: () => void;
  onLogDone: (contactId: string, note?: string) => void;
  onSnooze: (contactId: string, hours: number) => void;
  onQuiet: (contactId: string) => void;
  onOpenIcebreaker: (contact: Contact) => void;
  onOpenCallTimer: (contact: Contact) => void;
  onOpenGuiltReset: (contact: Contact) => void;
  onOpenHistory: (contact: Contact) => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onSelectIndex: (index: number) => void;
  onRandomCard: () => void;
  totalPending: number;
  currentIndex: number;
}

export const DailyShuffleCard: React.FC<Props> = ({
  contact,
  deck,
  isPro = false,
  onOpenProModal,
  onLogDone,
  onSnooze,
  onQuiet,
  onOpenIcebreaker,
  onOpenCallTimer,
  onOpenGuiltReset,
  onOpenHistory,
  onNextCard,
  onPrevCard,
  onSelectIndex,
  onRandomCard,
  totalPending,
  currentIndex,
}) => {
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const status = getShameFreeStatus(contact);

  const handleInstantDone = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.6 },
    });
    onLogDone(contact.id, quickNote);
    setQuickNote('');
    setIsAddingNote(false);
  };

  const handleDirectText = () => {
    sound.playPop();
    if (contact.phone) {
      const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
      window.location.href = `sms:${cleanPhone}`;
    } else {
      onOpenIcebreaker(contact);
    }
  };

  const orbitTierNames: Record<OrbitTier, string> = {
    inner_circle: 'Inner Circle • Weekly',
    warm_orbit: 'Warm Orbit • Monthly',
    seasonal: 'Seasonal • Quarterly',
    annual: 'Annual Orbit • Yearly',
    quiet: 'Quiet Orbit • Parked',
  };

  const vibeLabels: Record<string, { label: string; badge: string; desc: string }> = {
    low_energy: {
      label: 'Low Stakes & Safe',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      desc: 'Zero-pressure connection. A quick text or meme is 100% appreciated.',
    },
    warm: {
      label: 'Warm Friendship',
      badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      desc: 'They know you care. Just a quick "thinking of you" brings instant warmth.',
    },
    high_stakes: {
      label: 'High Growth & Mentor',
      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      desc: 'Meaningful catch-up. Keep it focused and share an update on your projects.',
    },
    deep_roots: {
      label: 'Deep Roots & Lifelong',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      desc: 'Lifelong bond. No time gap can ever weaken this connection.',
    },
  };

  const currentVibe = vibeLabels[contact.vibeCategory] || vibeLabels.warm;

  return (
    <div
      className={`relative bg-slate-900/40 backdrop-blur-xl border rounded-[36px] sm:rounded-[40px] p-6 sm:p-9 shadow-2xl transition-all overflow-hidden group ${
        isPro
          ? 'border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/20'
          : 'border-white/10'
      }`}
    >
      {/* Subtle Background Accent Glow */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isPro ? 'bg-amber-500/10' : 'bg-indigo-500/5'
        }`}
      />

      {/* Shuffle Navigation Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 text-xs text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-semibold tracking-wide uppercase text-[11px]">
            Spotlight Deck
          </span>
          <span className="bg-white/10 text-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/10">
            {currentIndex + 1} / {Math.max(1, totalPending)}
          </span>

          {isPro ? (
            <span className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              👑 Lifetime VIP
            </span>
          ) : (
            onOpenProModal && (
              <button
                onClick={onOpenProModal}
                className="hidden sm:inline-block text-[10px] text-amber-400 hover:text-amber-300 font-semibold hover:underline cursor-pointer"
              >
                ⭐ Supporter Pass
              </button>
            )
          )}
        </div>

        {/* Shuffle Buttons Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrevCard}
            title="Previous contact (Left arrow)"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">Prev</span>
          </button>

          <button
            onClick={onRandomCard}
            title="Random shuffle (Dice roll)"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.15)] cursor-pointer"
          >
            <Dices className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline text-xs font-semibold">Dice Roll</span>
          </button>

          <button
            onClick={onNextCard}
            title="Next contact (Right arrow)"
            className="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold transition-all flex items-center gap-1 shadow-md cursor-pointer"
          >
            <span className="hidden sm:inline text-xs">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Deck Quick Switcher Strip */}
      {deck.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">
            Deck:
          </span>
          {deck.map((c, idx) => {
            const isSelected = idx === currentIndex;
            const cStatus = getShameFreeStatus(c);
            return (
              <button
                key={c.id}
                onClick={() => onSelectIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-950 font-bold border-white shadow-lg scale-105'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    cStatus.isDue ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <span>{c.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Hero Contact Profile */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 mb-6">
        {/* Avatar */}
        <div className="relative">
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#0A0A0C] bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl ring-2 ring-indigo-500/40"
            />
          ) : (
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white text-3xl font-light border-4 border-[#0A0A0C] bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl ring-2 ring-indigo-500/40`}
            >
              {contact.name.charAt(0)}
            </div>
          )}
          {contact.streak > 1 && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 border-2 border-[#0A0A0C]">
              🔥 {contact.streak}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap mb-1">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
              {contact.name}
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
              {contact.relationship}
            </span>
            {contact.phone && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                {contact.phone}
              </span>
            )}
          </div>

          <p className="text-indigo-400 text-sm font-medium tracking-wide mb-3">
            {orbitTierNames[contact.orbitTier]}
          </p>

          {/* Shame-Free Status Message - Responsive Wrap & Clear Interactive Action */}
          <div
            className={`text-xs p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              status.badgeStyle === 'fresh'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                : status.badgeStyle === 'due'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
              <span className="font-medium text-slate-200 leading-snug">{status.statusMessage}</span>
            </div>

            {/* Clickable Action Pill with clear text */}
            <button
              onClick={() => onOpenIcebreaker(contact)}
              className="self-start sm:self-auto shrink-0 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>{status.statusBadge}</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Context Scratchpad & Vibe Duo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
        {/* Context Notes */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase text-slate-500 tracking-widest font-bold mb-1.5 flex items-center justify-between">
              <span>Last Interaction Context</span>
              <button
                onClick={() => onOpenHistory(contact)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Clock className="w-3 h-3" />
                <span>Phone Log ({contact.interactionHistory?.length || 0})</span>
              </button>
            </p>
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "{contact.notes || 'No previous notes saved. Add one after your conversation!'}"
            </p>
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-white/5">
              {contact.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-lg border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Vibe / Energy Guide */}
        <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase text-indigo-400 tracking-widest font-bold mb-1.5">
              The Vibe • {currentVibe.label}
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {currentVibe.desc}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-indigo-500/10 flex items-center justify-between text-xs text-indigo-300/80 flex-wrap gap-1">
            <span>Cycle target: every {contact.frequencyDays} days</span>
            <button
              onClick={() => onOpenIcebreaker(contact)}
              className="font-bold underline hover:text-white cursor-pointer"
            >
              Open Scripts →
            </button>
          </div>
        </div>
      </div>

      {/* Optional quick note before completing */}
      {isAddingNote && (
        <div className="mb-4 animate-in fade-in duration-100">
          <input
            type="text"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="What did you talk about? (e.g. puppy update, job promotion...)"
            className="w-full text-xs px-4 py-3 rounded-2xl bg-white/5 border border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder:text-slate-500"
            autoFocus
          />
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="space-y-3">
        {/* Prominent, Unmissable Phone Call Sprint Action */}
        <button
          onClick={() => onOpenCallTimer(contact)}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-[1.01] active:scale-98 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all cursor-pointer border border-emerald-400"
        >
          <Phone className="w-5 h-5 text-slate-950" />
          <span>📞 CALL NOW • Start 5-Min Sprint</span>
          {contact.phone && (
            <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-950/20 text-slate-950 font-mono font-semibold">
              Dial {contact.phone}
            </span>
          )}
        </button>

        {/* Secondary Micro-Communication Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Text / SMS Message */}
          <button
            onClick={handleDirectText}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 text-white font-bold text-xs border border-white/10 hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Send Direct SMS / Text</span>
          </button>

          {/* Offline Shame-Free Scripts (Spintax) */}
          <button
            onClick={() => onOpenIcebreaker(contact)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-500/20 text-indigo-200 font-bold text-xs border border-indigo-500/30 hover:bg-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.15)] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Shame-Free Openers (Spintax)</span>
          </button>
        </div>

        {/* "I Did It" Log Done Button */}
        <button
          onClick={handleInstantDone}
          className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>Already Connected? (Log Check-In & Reset Clock)</span>
        </button>

        {/* Secondary ADHD Helper Bar */}
        <div className="flex items-center justify-between gap-3 pt-2 text-xs border-t border-white/5 flex-wrap">
          {/* Quick Note Toggle */}
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="text-slate-400 hover:text-white py-1 font-medium transition-colors cursor-pointer"
          >
            {isAddingNote ? '✕ Cancel Note' : '+ Add Scratchpad Memory'}
          </button>

          <div className="flex items-center gap-3">
            {/* Shame-Free Reset */}
            <button
              onClick={() => onOpenGuiltReset(contact)}
              className="text-indigo-400 hover:text-indigo-300 py-1 px-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 font-medium transition-colors border border-indigo-500/20 cursor-pointer"
            >
              🌿 Shame-Free Reset
            </button>

            {/* Snooze Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white py-1 px-2.5 rounded-xl hover:bg-white/5 font-medium transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Snooze</span>
              </button>

              {/* Snooze dropdown */}
              {showSnoozeOptions && (
                <div className="absolute right-0 bottom-full mb-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 w-52 z-30 space-y-1 backdrop-blur-xl">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                    Snooze Reminder
                  </div>
                  {[
                    { hours: 4, label: 'Later Today (In 4h)' },
                    { hours: 24, label: 'Tomorrow' },
                    { hours: 72, label: 'In 3 Days' },
                    { hours: 168, label: 'Next Week' },
                  ].map((opt) => (
                    <button
                      key={opt.hours}
                      onClick={() => {
                        onSnooze(contact.id, opt.hours);
                        setShowSnoozeOptions(false);
                      }}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => {
                      onQuiet(contact.id);
                      setShowSnoozeOptions(false);
                    }}
                    className="w-full text-left text-xs px-3 py-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-slate-200 cursor-pointer"
                  >
                    Park in Quiet Orbit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
