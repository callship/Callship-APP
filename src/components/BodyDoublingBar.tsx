import React, { useState, useEffect } from 'react';
import { Users, Volume2, VolumeX, Sparkles, Flame, Clock, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  completedToday: number;
  level?: number;
  streakDays?: number;
}

export const BodyDoublingBar: React.FC<Props> = ({ completedToday, level = 1, streakDays }) => {
  const [activeDoublers, setActiveDoublers] = useState<number>(47);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    // Subtle gentle fluctuation to make it feel delightfully alive
    const interval = setInterval(() => {
      setActiveDoublers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(32, Math.min(88, prev + delta));
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setSoundEnabled(next);
    if (next) sound.playPop();
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:px-5 sm:py-3.5 shadow-xl flex items-center justify-between gap-3 flex-wrap">
      {/* Live ADHD Body Doubling Status */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute opacity-75 shadow-[0_0_10px_#34d399]" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative shadow-[0_0_8px_#34d399]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>ADHD Body Double Active</span>
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400">
            • <strong className="text-emerald-400 font-mono font-bold">{activeDoublers}</strong> people in orbit right now
          </span>
        </div>
      </div>

      {/* Level / Daily Wins / Sound Toggle */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-xl border border-indigo-500/30">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Lvl {level}</span>
        </div>

        <div className="text-xs text-slate-300 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
          Today: <strong className="text-white font-bold">{completedToday}</strong> done
        </div>

        <button
          onClick={toggleSound}
          title={soundOn ? 'Mute micro-chimes' : 'Enable micro-chimes'}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>
    </div>
  );
};
