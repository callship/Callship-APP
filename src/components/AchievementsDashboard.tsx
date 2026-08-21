import React, { useState } from 'react';
import { Contact, UserStats } from '../types';
import {
  Award,
  Flame,
  Heart,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
  Star,
  Users,
  Compass,
  Smile,
  RefreshCw,
  Trophy,
  Crown,
  Edit3,
  User,
  Check,
  X,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import {
  calculateTotalXP,
  calculateLevelInfo,
  LEVEL_TITLES,
  getXPForLevel,
} from '../utils/levelCalculator';

interface Props {
  stats: UserStats;
  contacts: Contact[];
  isPro?: boolean;
  onOpenProModal?: () => void;
  onUpdateStats?: (newStats: UserStats) => void;
}

interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  progressText: string;
  unlockedAtText?: string;
}

export const AchievementsDashboard: React.FC<Props> = ({
  stats,
  contacts,
  isPro = false,
  onOpenProModal,
  onUpdateStats,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(stats.userName || 'Orbit Traveler');
  const [editBio, setEditBio] = useState(stats.userBio || 'Nurturing real connections with ADHD-friendly cadence.');
  const [showLevelExplainer, setShowLevelExplainer] = useState(false);
  const [showMilestoneRoadmap, setShowMilestoneRoadmap] = useState(false);

  // Dynamic calculations
  const totalSprintMinutes = contacts.reduce((acc, c) => {
    return (
      acc +
      (c.interactionHistory || []).reduce(
        (sum, log) => sum + (log.durationMinutes || (log.type === 'call' ? 5 : 0)),
        0
      )
    );
  }, 0);

  const contactsWithNotes = contacts.filter((c) => c.notes && c.notes.trim().length > 0).length;
  const warmContactsCount = contacts.filter((c) => {
    const diff = Date.now() - new Date(c.lastContactDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days <= c.frequencyDays;
  }).length;

  // Escalating XP Level Calculator (100, 200, 400, 800, 1000...)
  const totalXP = calculateTotalXP(stats, contacts);
  const levelInfo = calculateLevelInfo(totalXP);
  const { level: currentLevel, title: currentTitle, currentLevelXP, xpNeededForNext, progressPct: levelProgressPct } = levelInfo;

  // Defined Badges
  const badges: Badge[] = [
    {
      id: 'first_spark',
      title: 'First Orbit Spark',
      desc: 'Logged your very first shame-free connection',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      isUnlocked: stats.totalCallsLogged >= 1,
      progressText: `${Math.min(1, stats.totalCallsLogged)}/1 logged`,
    },
    {
      id: 'guilt_slayer',
      title: 'Anti-Guilt Crusher',
      desc: 'Used a Shame-Free Reset to break out of avoidance',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      isUnlocked: stats.guiltResetsCount >= 1,
      progressText: `${Math.min(1, stats.guiltResetsCount)}/1 reset`,
    },
    {
      id: 'sprint_master',
      title: 'Sprint Pioneer',
      desc: 'Completed at least 15 minutes of low-pressure call sprints',
      icon: <Clock className="w-5 h-5 text-indigo-400" />,
      isUnlocked: totalSprintMinutes >= 15,
      progressText: `${Math.min(15, totalSprintMinutes)}/15 mins`,
    },
    {
      id: 'memory_vault',
      title: 'Memory Scaffolder',
      desc: 'Saved scratchpad context notes for 3+ contacts',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      isUnlocked: contactsWithNotes >= 3,
      progressText: `${Math.min(3, contactsWithNotes)}/3 contacts`,
    },
    {
      id: 'streak_flame',
      title: 'Orbital Consistency',
      desc: 'Maintained a 3-day active streak without friction',
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      isUnlocked: stats.currentStreakDays >= 3,
      progressText: `${Math.min(3, stats.currentStreakDays)}/3 days`,
    },
    {
      id: 'constellation_keeper',
      title: 'Constellation Guardian',
      desc: 'Kept at least 3 relationships warm in their target orbit',
      icon: <Compass className="w-5 h-5 text-teal-400" />,
      isUnlocked: warmContactsCount >= 3,
      progressText: `${Math.min(3, warmContactsCount)}/3 in orbit`,
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const triggerCelebrate = () => {
    sound.playSuccessChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    if (onUpdateStats) {
      onUpdateStats({
        ...stats,
        userName: editName.trim(),
        userBio: editBio.trim(),
      });
    }
    sound.playPop();
    setIsEditingProfile(false);
  };

  // Extract all interaction logs sorted by most recent
  const allLogs: { contactName: string; contactAvatar?: string; date: string; type: string; note?: string; duration?: number }[] = [];
  contacts.forEach((c) => {
    (c.interactionHistory || []).forEach((log) => {
      allLogs.push({
        contactName: c.name,
        contactAvatar: c.avatar,
        date: log.date,
        type: log.type,
        note: log.note,
        duration: log.durationMinutes,
      });
    });
  });
  allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Profile & Level Hero Card */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-white/20 shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  DOPAMINE VAULT & ACHIEVEMENTS
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold border border-white/10 font-mono">
                  Lvl {currentLevel}
                </span>
                {isPro ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Lifetime VIP
                  </span>
                ) : onOpenProModal && (
                  <button
                    onClick={onOpenProModal}
                    className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-amber-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Crown className="w-3 h-3 text-amber-400" /> Free Tier
                  </button>
                )}
              </div>

              {/* Profile Name & Title with Inline Edit Hook */}
              <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {stats.userName || 'Orbit Traveler'}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {currentTitle}
                </span>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  title="Edit Profile Name"
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
                {stats.userBio || 'Nurturing real connections with ADHD-friendly cadence.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={triggerCelebrate}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Spark Confetti</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Inline Form Modal */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="mb-6 p-4 sm:p-5 bg-white/5 border border-indigo-500/30 rounded-2xl space-y-3 relative z-10 animate-in fade-in duration-100"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Edit Profile Identity (Local Device Storage)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Maya, Alex, Orbit Traveler"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Personal Bio / Intention</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="e.g. Staying in touch without social burnout"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[#0A0A0C] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* Level XP Progress Bar & Mechanics Toggle */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative z-10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-1.5">
              <span>Level {currentLevel} Progression ({currentTitle})</span>
              <button
                type="button"
                onClick={() => setShowLevelExplainer(!showLevelExplainer)}
                className="text-indigo-400 hover:text-indigo-300 p-0.5 cursor-pointer"
                title="How does escalating XP leveling work?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="font-mono text-indigo-400 font-bold">
              {currentLevelXP} / {xpNeededForNext} XP ({levelProgressPct}%) • {totalXP.toLocaleString()} Total XP
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>

          {/* Transparent Level Breakdown & 100-Level Roadmap */}
          {showLevelExplainer && (
            <div className="pt-3 text-[11px] text-slate-300 bg-[#0A0A0C]/90 p-4 rounded-xl border border-white/10 space-y-3 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Escalating Level Calculator (100 $\to$ 200 $\to$ 400 $\to$ 800 $\to$ 1000):</span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowMilestoneRoadmap(!showMilestoneRoadmap)}
                  className="text-[10px] text-indigo-300 hover:text-white bg-indigo-500/20 px-2 py-0.5 rounded-lg border border-indigo-500/30 cursor-pointer flex items-center gap-1"
                >
                  <span>{showMilestoneRoadmap ? 'Hide Ranks' : 'View All 100 Ranks'}</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${showMilestoneRoadmap ? 'rotate-90' : ''}`} />
                </button>
              </div>

              <ul className="space-y-1 text-slate-400 list-disc list-inside">
                <li><strong className="text-emerald-400">+50 XP</strong> per Call Sprint completed or logged check-in</li>
                <li><strong className="text-amber-400">+30 XP</strong> per day of active streak</li>
                <li><strong className="text-rose-400">+25 XP</strong> per contact with scratchpad context notes</li>
                <li><strong className="text-indigo-400">+20 XP</strong> per Shame-Free Reset (rewarding self-compassion)</li>
                <li><strong className="text-teal-400">+5 XP</strong> per minute of low-pressure phone sprint</li>
              </ul>

              <div className="text-[10px] text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/5 font-mono space-y-1">
                <div className="text-white font-bold">Escalating Level Thresholds:</div>
                <div>• Lvl 1 $\to$ 2: 100 XP (Total 100 XP)</div>
                <div>• Lvl 2 $\to$ 3: 200 XP (Total 300 XP)</div>
                <div>• Lvl 3 $\to$ 4: 400 XP (Total 700 XP)</div>
                <div>• Lvl 4 $\to$ 5: 800 XP (Total 1,500 XP)</div>
                <div>• Lvl 5+: 1,000 XP per level all the way to Lvl 100 (Galactic Connector)</div>
              </div>

              {showMilestoneRoadmap && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>The 100-Level Cosmic Journey:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px]">
                    {Object.entries(LEVEL_TITLES).map(([lvl, title]) => {
                      const numLvl = Number(lvl);
                      const isReached = currentLevel >= numLvl;
                      return (
                        <div
                          key={lvl}
                          className={`p-2 rounded-lg border flex items-center justify-between ${
                            isReached
                              ? 'bg-indigo-500/20 border-indigo-500/30 text-white font-semibold'
                              : 'bg-white/[0.02] border-white/5 text-slate-500'
                          }`}
                        >
                          <span>Lvl {lvl}: {title}</span>
                          <span className="font-mono text-[9px] text-indigo-300">
                            {getXPForLevel(numLvl).toLocaleString()} XP
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4 Core Metric Counters (5-digit friendly) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Check-Ins Logged
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white truncate">
            {stats.totalCallsLogged.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Conquered executive hurdles</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Sprint Time
            </span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white truncate">
            {totalSprintMinutes.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400">mins</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Low-pressure time-boxed chats</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Shame Resets
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white truncate">
            {stats.guiltResetsCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1">Zero-guilt fresh starts</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Day Streak
            </span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white truncate flex items-center gap-1.5">
            <span>{stats.currentStreakDays.toLocaleString()}</span>
            <span className="text-xs font-sans font-normal text-amber-300">days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Daily social momentum</p>
        </div>
      </div>

      {/* Badges & Milestones Grid */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[36px] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Neurodiverse Milestones
              </h3>
              <p className="text-xs text-slate-400">
                {unlockedCount} of {badges.length} badges unlocked
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                b.isUnlocked
                  ? 'bg-white/5 border-white/15 text-white shadow-lg'
                  : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  b.isUnlocked
                    ? 'bg-indigo-500/20 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'bg-white/5 border-white/5 text-slate-600'
                }`}
              >
                {b.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className={`text-xs font-bold truncate ${b.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {b.title}
                  </h4>
                  {b.isUnlocked && (
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {b.desc}
                </p>
                <div className="text-[10px] font-mono font-semibold text-indigo-400">
                  {b.progressText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History / Activity Log */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[36px] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Connection Timeline
              </h3>
              <p className="text-xs text-slate-400">
                Log of calls, texts, and shame-free resets
              </p>
            </div>
          </div>
        </div>

        {allLogs.length > 0 ? (
          <div className="space-y-3">
            {allLogs.slice(0, 8).map((log, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/5 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-white shrink-0">
                    {log.contactName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{log.contactName}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-white/10 text-indigo-300">
                        {log.type}
                      </span>
                      {log.duration && (
                        <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                          {log.duration} min
                        </span>
                      )}
                    </div>
                    {log.note && (
                      <p className="text-slate-400 text-[11px] truncate italic mt-0.5">
                        "{log.note}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-slate-500 font-mono text-[10px] shrink-0">
                  {new Date(log.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-xs text-slate-400">
            No connection logs yet. Check in with someone today to start your timeline!
          </div>
        )}
      </div>
    </div>
  );
};
