import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import {
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  RefreshCw,
  X,
  HeartHandshake,
  Dices,
  WifiOff,
} from 'lucide-react';
import { calculateDaysSince } from '../utils/storage';
import { sound } from '../utils/audio';
import { getOfflineScriptsForContact } from '../utils/offlineScripts';

interface Props {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectScript?: (scriptText: string) => void;
}

export const IcebreakerModal: React.FC<Props> = ({
  contact,
  isOpen,
  onClose,
}) => {
  const [scripts, setScripts] = useState<{ title: string; text: string; tag: string }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('all');

  // Prevent background scroll when modal is open
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
      generateScripts(category);
    }
  }, [isOpen, contact]);

  if (!isOpen || !contact) return null;

  const daysSince = calculateDaysSince(contact.lastContactDate);

  const generateScripts = (cat: string = 'all') => {
    sound.playPop();
    const results = getOfflineScriptsForContact(contact, cat, daysSince);
    setScripts(results);
    setCopiedIdx(null);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    sound.playPop();
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const handleOpenSMS = (text: string) => {
    if (contact.phone) {
      const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
      window.location.href = `sms:${cleanPhone}?&body=${encodeURIComponent(text)}`;
    } else {
      window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
    }
  };

  const categories = [
    { id: 'all', label: 'All Smart Openers' },
    { id: 'shame_free', label: 'Late-to-Party (ADHD Truth)' },
    { id: 'casual', label: 'Zero Pressure' },
    { id: 'sprint_invite', label: '5-Min Call Invite' },
    { id: 'voice_note', label: 'Voice Note Ask 🎙️' },
    { id: 'meme', label: 'Playful & Meme' },
    { id: 'meaningful', label: 'Warm & Meaningful' },
  ];

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
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Shame-Free Openers
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Spintax Offline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailored for <span className="font-semibold text-slate-200">{contact.name}</span>
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

        {/* Category Filters */}
        <div className="py-3.5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id);
                generateScripts(c.id);
              }}
              className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                category === c.id
                  ? 'bg-white text-slate-950 border-white font-bold shadow-lg scale-105'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Script Cards List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 my-2">
          {scripts.map((script, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 sm:p-5 transition-all shadow-lg"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-indigo-400" />
                  {script.title}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {script.tag}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-4 select-all bg-[#0A0A0C]/70 p-3.5 rounded-xl border border-white/10">
                "{script.text}"
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={() => handleCopy(script.text, idx)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenSMS(script.text)}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Send SMS</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => generateScripts(category)}
            className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <Dices className="w-4 h-4 text-indigo-400" />
            <span>🎲 Re-roll Spintax (New Variation)</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
