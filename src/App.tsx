import React, { useState, useEffect, useCallback } from 'react';
import {
  Contact,
  SocialBatteryLevel,
  UserStats,
  OrbitTier,
  InteractionLog,
} from './types';
import {
  loadContacts,
  saveContacts,
  loadStats,
  saveStats,
  loadBattery,
  saveBattery,
  loadProStatus,
  saveProStatus,
  INITIAL_CONTACTS,
  INITIAL_STATS,
  isContactSnoozed,
  getShameFreeStatus,
  FREE_TIER_LIMIT,
} from './utils/storage';
import { sound } from './utils/audio';
import { SocialBatterySelector } from './components/SocialBatterySelector';
import { BodyDoublingBar } from './components/BodyDoublingBar';
import { DailyShuffleCard } from './components/DailyShuffleCard';
import { OrbitConstellation } from './components/OrbitConstellation';
import { ContactDirectory } from './components/ContactDirectory';
import { AchievementsDashboard } from './components/AchievementsDashboard';
import { IcebreakerModal } from './components/IcebreakerModal';
import { CallTimerModal } from './components/CallTimerModal';
import { GuiltResetModal } from './components/GuiltResetModal';
import { ContactHistoryModal } from './components/ContactHistoryModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { calculateTotalXP, calculateLevelInfo } from './utils/levelCalculator';
import {
  Sparkles,
  Compass,
  Layers,
  Users,
  CheckCircle,
  Heart,
  Plus,
  RefreshCw,
  Award,
  Flame,
  PhoneCall,
  CalendarCheck,
  Shield,
  Smile,
  Trophy,
  WifiOff,
  Crown,
  History,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [battery, setBattery] = useState<SocialBatteryLevel>('balanced');
  const [activeTab, setActiveTab] = useState<'focus' | 'orbit' | 'directory' | 'achievements'>('focus');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPro, setIsPro] = useState<boolean>(false);

  // Modals state
  const [activeIcebreakerContact, setActiveIcebreakerContact] = useState<Contact | null>(null);
  const [activeCallContact, setActiveCallContact] = useState<Contact | null>(null);
  const [activeGuiltResetContact, setActiveGuiltResetContact] = useState<Contact | null>(null);
  const [activeHistoryContact, setActiveHistoryContact] = useState<Contact | null>(null);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  // Load persisted state on mount
  useEffect(() => {
    const loadedC = loadContacts();
    const loadedS = loadStats();
    const loadedB = loadBattery();
    const loadedPro = loadProStatus();
    setContacts(loadedC);
    setStats(loadedS);
    setBattery(loadedB);
    setIsPro(loadedPro);
  }, []);

  // Sync back to storage when contacts/stats change
  const updateContactsState = (newContacts: Contact[]) => {
    setContacts(newContacts);
    saveContacts(newContacts);
  };

  const updateStatsState = (newStats: UserStats) => {
    setStats(newStats);
    saveStats(newStats);
  };

  const handleTogglePro = (pro: boolean) => {
    setIsPro(pro);
    saveProStatus(pro);
  };

  const handleBatteryChange = (level: SocialBatteryLevel) => {
    setBattery(level);
    saveBattery(level);
    setCurrentIndex(0);
  };

  // Filter contacts based on Social Battery & Snooze state
  const getDeckContacts = useCallback((): Contact[] => {
    return contacts
      .filter((c) => !c.isQuiet)
      .filter((c) => !isContactSnoozed(c))
      .filter((c) => {
        if (battery === 'low') {
          return c.vibeCategory === 'low_energy';
        }
        if (battery === 'high') {
          return true;
        }
        // Balanced: prefer inner circle, warm, or low energy
        return c.vibeCategory !== 'high_stakes' || getShameFreeStatus(c).isDue;
      })
      .sort((a, b) => {
        // Prioritize due items first, then longest gap
        const statA = getShameFreeStatus(a);
        const statB = getShameFreeStatus(b);
        if (statA.isDue && !statB.isDue) return -1;
        if (!statA.isDue && statB.isDue) return 1;
        return statB.daysSince - statA.daysSince;
      });
  }, [contacts, battery]);

  const deck = getDeckContacts();
  const currentCard = deck.length > 0 ? deck[currentIndex % deck.length] : null;

  // Actions
  const handleLogDone = (contactId: string, note?: string) => {
    const updated = contacts.map((c) => {
      if (c.id === contactId) {
        const newHistory: InteractionLog[] = [
          {
            id: `log-${Date.now()}`,
            date: new Date().toISOString(),
            type: 'call',
            note: note || 'Checked in & stayed in touch',
          },
          ...(c.interactionHistory || []),
        ];
        return {
          ...c,
          lastContactDate: new Date().toISOString(),
          snoozedUntil: null,
          streak: c.streak + 1,
          interactionHistory: newHistory,
          notes: note ? `${note} (Logged: ${new Date().toLocaleDateString()})` : c.notes,
        };
      }
      return c;
    });

    updateContactsState(updated);
    updateStatsState({
      ...stats,
      totalCallsLogged: stats.totalCallsLogged + 1,
      todayCompletedCount: stats.todayCompletedCount + 1,
      lastActiveDate: new Date().toISOString(),
    });
  };

  const handleAddManualLog = (contactId: string, logData: Omit<InteractionLog, 'id'>) => {
    const updated = contacts.map((c) => {
      if (c.id === contactId) {
        const newHistory: InteractionLog[] = [
          {
            id: `log-${Date.now()}`,
            ...logData,
          },
          ...(c.interactionHistory || []),
        ];
        return {
          ...c,
          lastContactDate: logData.date,
          snoozedUntil: null,
          interactionHistory: newHistory,
          notes: logData.note ? `${logData.note} (Logged: ${new Date().toLocaleDateString()})` : c.notes,
        };
      }
      return c;
    });

    updateContactsState(updated);
    updateStatsState({
      ...stats,
      totalCallsLogged: stats.totalCallsLogged + 1,
      lastActiveDate: new Date().toISOString(),
    });

    // Update activeHistoryContact if open
    const found = updated.find((c) => c.id === contactId);
    if (found) setActiveHistoryContact(found);
  };

  const handleSnooze = (contactId: string, hours: number) => {
    sound.playPop();
    const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    const updated = contacts.map((c) => {
      if (c.id === contactId) {
        return { ...c, snoozedUntil: until };
      }
      return c;
    });
    updateContactsState(updated);
    // Advance to next card
    if (currentIndex >= deck.length - 1) {
      setCurrentIndex(0);
    }
  };

  const handleQuiet = (contactId: string) => {
    sound.playPop();
    const updated = contacts.map((c) => {
      if (c.id === contactId) {
        return { ...c, isQuiet: true };
      }
      return c;
    });
    updateContactsState(updated);
  };

  const handleConfirmGuiltReset = (contactId: string, withMessage: boolean) => {
    const updated = contacts.map((c) => {
      if (c.id === contactId) {
        return {
          ...c,
          lastContactDate: new Date().toISOString(),
          snoozedUntil: null,
          interactionHistory: [
            {
              id: `reset-${Date.now()}`,
              date: new Date().toISOString(),
              type: 'reset' as const,
              note: 'Shame-free guilt reset performed',
            },
            ...(c.interactionHistory || []),
          ],
        };
      }
      return c;
    });

    updateContactsState(updated);
    updateStatsState({
      ...stats,
      guiltResetsCount: stats.guiltResetsCount + 1,
    });
  };

  const handleAddContact = (newC: Omit<Contact, 'id' | 'interactionHistory' | 'streak'>) => {
    const fresh: Contact = {
      ...newC,
      id: `c-${Date.now()}`,
      interactionHistory: [],
      streak: 1,
      avatarColor: 'bg-amber-600',
    };
    updateContactsState([fresh, ...contacts]);
  };

  const handleUpdateContact = (updatedC: Contact) => {
    const updated = contacts.map((c) => (c.id === updatedC.id ? updatedC : c));
    updateContactsState(updated);
    if (activeHistoryContact?.id === updatedC.id) {
      setActiveHistoryContact(updatedC);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    sound.playPop();
    const updated = contacts.filter((c) => c.id !== contactId);
    updateContactsState(updated);
    if (activeHistoryContact?.id === contactId) {
      setActiveHistoryContact(null);
    }
  };

  const handleRestoreDefaults = () => {
    sound.playResetCalm();
    updateContactsState(INITIAL_CONTACTS);
    updateStatsState(INITIAL_STATS);
  };

  // Shuffle Controls
  const handleNextCard = useCallback(() => {
    sound.playPop();
    if (deck.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }
  }, [deck.length]);

  const handlePrevCard = useCallback(() => {
    sound.playPop();
    if (deck.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    }
  }, [deck.length]);

  const handleRandomCard = useCallback(() => {
    sound.playPop();
    if (deck.length > 1) {
      let nextIdx = Math.floor(Math.random() * deck.length);
      if (nextIdx === currentIndex) {
        nextIdx = (nextIdx + 1) % deck.length;
      }
      setCurrentIndex(nextIdx);
    }
  }, [deck.length, currentIndex]);

  const handleSelectIndex = (idx: number) => {
    sound.playPop();
    setCurrentIndex(idx);
  };

  // Global Keyboard shortcuts when not typing in inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (activeIcebreakerContact || activeCallContact || activeGuiltResetContact || activeHistoryContact || isProModalOpen) {
        if (e.key === 'Escape') {
          setActiveIcebreakerContact(null);
          setActiveCallContact(null);
          setActiveGuiltResetContact(null);
          setActiveHistoryContact(null);
          setIsProModalOpen(false);
        }
        return;
      }

      if (activeTab === 'focus') {
        if (e.key === 'ArrowRight' || e.key === 'n') {
          handleNextCard();
        } else if (e.key === 'ArrowLeft' || e.key === 'p') {
          handlePrevCard();
        } else if (e.key === 'r' || e.key === 'd') {
          handleRandomCard();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    activeIcebreakerContact,
    activeCallContact,
    activeGuiltResetContact,
    activeHistoryContact,
    isProModalOpen,
    handleNextCard,
    handlePrevCard,
    handleRandomCard,
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white font-sans">
      {/* Immersive Atmospheric Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,#1E1B4B_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#312E81_0%,transparent_50%)] opacity-45" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-48 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Navigation Header - Perfectly Aligned & Responsive */}
      <header className="sticky top-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_18px_rgba(99,102,241,0.4)] border border-white/15 shrink-0">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase tracking-wider truncate">
                  Callship
                </h1>
                <span className="hidden sm:flex text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  <WifiOff className="w-3 h-3" />
                  Offline Ready
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block truncate">
                Zero-guilt ADHD micro-connections
              </span>
            </div>
          </div>

          {/* Navigation Tabs Bar - Visible from tablet up (sm/md/lg) */}
          <nav className="hidden sm:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              id="tab-focus"
              onClick={() => {
                setActiveTab('focus');
                sound.playPop();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'focus'
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'focus' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Daily Focus</span>
            </button>

            <button
              id="tab-orbit"
              onClick={() => {
                setActiveTab('orbit');
                sound.playPop();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'orbit'
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'orbit' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Orbit Map</span>
            </button>

            <button
              id="tab-directory"
              onClick={() => {
                setActiveTab('directory');
                sound.playPop();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${activeTab === 'directory' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Circle ({contacts.length})</span>
            </button>

            <button
              id="tab-achievements"
              onClick={() => {
                setActiveTab('achievements');
                sound.playPop();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'achievements'
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 ${activeTab === 'achievements' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Vault</span>
            </button>
          </nav>

          {/* Right Header Badges: Pro Status + Daily Streak Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsProModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isPro
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${isPro ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isPro ? 'Supporter Pro' : 'Free Tier'}</span>
              <span className="sm:hidden">{isPro ? 'Pro' : 'Tier'}</span>
            </button>

            <div
              title="Daily Active Streak: Continuous connection momentum"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.18)] cursor-pointer hover:bg-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all"
              onClick={() => setActiveTab('achievements')}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{stats.currentStreakDays}d Streak</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Generous bottom padding for mobile bar */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-8 relative z-10 space-y-6">
        {/* Social Battery Dial (Shown in Focus view) */}
        {activeTab === 'focus' && (
          <SocialBatterySelector battery={battery} onChange={handleBatteryChange} />
        )}

        {/* Live ADHD Body Doubling Bar */}
        <BodyDoublingBar
          completedToday={stats.todayCompletedCount}
          level={calculateLevelInfo(calculateTotalXP(stats, contacts)).level}
          streakDays={stats.currentStreakDays}
        />

        {/* View Switcher Content */}
        {activeTab === 'focus' && (
          <div>
            {currentCard ? (
              <DailyShuffleCard
                contact={currentCard}
                deck={deck}
                isPro={isPro}
                onOpenProModal={() => setIsProModalOpen(true)}
                onLogDone={handleLogDone}
                onSnooze={handleSnooze}
                onQuiet={handleQuiet}
                onOpenIcebreaker={(c) => setActiveIcebreakerContact(c)}
                onOpenCallTimer={(c) => setActiveCallContact(c)}
                onOpenGuiltReset={(c) => setActiveGuiltResetContact(c)}
                onOpenHistory={(c) => setActiveHistoryContact(c)}
                onNextCard={handleNextCard}
                onPrevCard={handlePrevCard}
                onSelectIndex={handleSelectIndex}
                onRandomCard={handleRandomCard}
                totalPending={deck.length}
                currentIndex={currentIndex % Math.max(1, deck.length)}
              />
            ) : (
              /* All Caught Up Celebration Deck */
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[36px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none opacity-50" />
                <div className="w-18 h-18 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-2">
                  You're All Caught Up For Today!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
                  You conquered executive friction and nurtured your social circle. Your connections are resting warm in their orbit. Go enjoy your day guilt-free!
                </p>

                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => setActiveTab('orbit')}
                    className="py-3 px-6 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Explore Orbit Map
                  </button>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all"
                  >
                    View Social Circle
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orbit' && (
          <OrbitConstellation
            contacts={contacts}
            onSelectContact={(c) => {
              const deckIdx = deck.findIndex((d) => d.id === c.id);
              if (deckIdx >= 0) {
                setCurrentIndex(deckIdx);
              }
              setActiveTab('focus');
            }}
            onOpenIcebreaker={(c) => setActiveIcebreakerContact(c)}
            onOpenCallTimer={(c) => setActiveCallContact(c)}
            onLogDone={handleLogDone}
          />
        )}

        {activeTab === 'directory' && (
          <ContactDirectory
            contacts={contacts}
            isPro={isPro}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
            onSelectForSpotlight={(c) => {
              const deckIdx = deck.findIndex((d) => d.id === c.id);
              if (deckIdx >= 0) setCurrentIndex(deckIdx);
              setActiveTab('focus');
            }}
            onOpenIcebreaker={(c) => setActiveIcebreakerContact(c)}
            onOpenCallTimer={(c) => setActiveCallContact(c)}
            onOpenHistory={(c) => setActiveHistoryContact(c)}
            onOpenProModal={() => setIsProModalOpen(true)}
            onRestoreDefaults={handleRestoreDefaults}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsDashboard
            stats={stats}
            contacts={contacts}
            isPro={isPro}
            onOpenProModal={() => setIsProModalOpen(true)}
            onUpdateStats={updateStatsState}
          />
        )}

        {/* Ambient Quick Icebreaker Footer Card */}
        <footer className="mt-8 pt-4">
          <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  ADHD Icebreaker Philosophy
                </span>
                <p className="text-xs sm:text-sm text-slate-300">
                  "Hey! My ADHD brain put you in a drawer for a bit, but I'm pulling you back out!"
                </p>
              </div>
            </div>
            {currentCard && (
              <button
                onClick={() => setActiveIcebreakerContact(currentCard)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs border border-white/10 hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                Offline Scripts for {currentCard.name.split(' ')[0]}
              </button>
            )}
          </div>

          <div className="py-6 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-400 tracking-wide uppercase text-[11px]">
              Callship • 100% Offline ADHD Connection Companion
            </p>
            <p className="text-[11px] text-slate-500">
              Zero API costs • Zero shame metrics • Low-friction memory scaffolding • Deep orbital permanence
            </p>
          </div>
        </footer>
      </main>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR - Generous tap targets & clear prominent icons */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 safe-area-pb">
        <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveTab('focus');
              sound.playPop();
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              activeTab === 'focus'
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className={`w-5 h-5 mb-0.5 ${activeTab === 'focus' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span className="text-[11px] font-semibold tracking-tight">Focus</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('orbit');
              sound.playPop();
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              activeTab === 'orbit'
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className={`w-5 h-5 mb-0.5 ${activeTab === 'orbit' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span className="text-[11px] font-semibold tracking-tight">Orbit</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('directory');
              sound.playPop();
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              activeTab === 'directory'
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className={`w-5 h-5 mb-0.5 ${activeTab === 'directory' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span className="text-[11px] font-semibold tracking-tight">Circle</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('achievements');
              sound.playPop();
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
              activeTab === 'achievements'
                ? 'bg-white/15 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className={`w-5 h-5 mb-0.5 ${activeTab === 'achievements' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-[11px] font-semibold tracking-tight">Vault</span>
          </button>
        </div>
      </div>

      {/* Shared Modals */}
      <IcebreakerModal
        contact={activeIcebreakerContact}
        isOpen={!!activeIcebreakerContact}
        onClose={() => setActiveIcebreakerContact(null)}
      />

      <CallTimerModal
        contact={activeCallContact}
        isOpen={!!activeCallContact}
        onClose={() => setActiveCallContact(null)}
        onLogCall={(cId, duration, note) => {
          handleLogDone(cId, note);
        }}
      />

      <GuiltResetModal
        contact={activeGuiltResetContact}
        isOpen={!!activeGuiltResetContact}
        onClose={() => setActiveGuiltResetContact(null)}
        onConfirmReset={handleConfirmGuiltReset}
        onOpenIcebreaker={() => {
          if (activeGuiltResetContact) {
            setActiveIcebreakerContact(activeGuiltResetContact);
          }
        }}
      />

      {/* Contact History & Memory Timeline Modal */}
      <ContactHistoryModal
        contact={activeHistoryContact}
        isOpen={!!activeHistoryContact}
        onClose={() => setActiveHistoryContact(null)}
        onAddLog={handleAddManualLog}
        onOpenCallTimer={(c) => setActiveCallContact(c)}
        onOpenIcebreaker={(c) => setActiveIcebreakerContact(c)}
      />

      {/* Supporter Pro Lifetime Upgrade Modal */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isPro={isPro}
        onTogglePro={handleTogglePro}
      />
    </div>
  );
}
