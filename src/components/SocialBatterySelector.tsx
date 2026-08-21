import React from 'react';
import { SocialBatteryLevel } from '../types';
import { BatteryCharging, BatteryLow, BatteryMedium, BatteryFull, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  battery: SocialBatteryLevel;
  onChange: (level: SocialBatteryLevel) => void;
}

export const SocialBatterySelector: React.FC<Props> = ({ battery, onChange }) => {
  const handleSelect = (level: SocialBatteryLevel) => {
    sound.playPop();
    onChange(level);
  };

  return (
    <div id="social-battery-card" className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 transition-all shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <BatteryCharging className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Social Battery Check-In
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {battery === 'low' && 'Filtered to zero-pressure, safe contacts who understand quick memes & low-stakes check-ins.'}
              {battery === 'balanced' && 'Standard rotation across inner circle and warm friends.'}
              {battery === 'high' && 'Full capacity! Ready for deeper catch-ups, mentors, and voice calls.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <button
          id="btn-battery-low"
          onClick={() => handleSelect('low')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
            battery === 'low'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50 scale-[1.02]'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          <BatteryLow className="w-4 h-4" />
          <span>Low Energy (Safe)</span>
        </button>

        <button
          id="btn-battery-balanced"
          onClick={() => handleSelect('balanced')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
            battery === 'balanced'
              ? 'bg-white text-slate-950 shadow-lg shadow-white/10 ring-2 ring-indigo-400/40 scale-[1.02]'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          <BatteryMedium className="w-4 h-4" />
          <span>Balanced (Standard)</span>
        </button>

        <button
          id="btn-battery-high"
          onClick={() => handleSelect('high')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
            battery === 'high'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/50 scale-[1.02]'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white'
          }`}
        >
          <BatteryFull className="w-4 h-4" />
          <span>High Energy (Deep)</span>
        </button>
      </div>
    </div>
  );
};
