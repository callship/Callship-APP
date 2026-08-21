import { Contact, UserStats, SocialBatteryLevel } from '../types';

const CONTACTS_KEY = 'callship_contacts_v1';
const STATS_KEY = 'callship_stats_v1';
const BATTERY_KEY = 'callship_battery_v1';
const SOUND_KEY = 'callship_sound_enabled';
const PRO_KEY = 'callship_pro_unlocked_v1';

export const FREE_TIER_LIMIT = 6;

// High-quality initial mock data tailored to ADHD realistic social lives
export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c-1',
    name: 'Mom & Dad',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    avatarColor: 'bg-amber-500',
    phone: '+1 (555) 234-5678',
    relationship: 'Family',
    vibeCategory: 'deep_roots',
    orbitTier: 'inner_circle',
    frequencyDays: 7,
    lastContactDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Loves hearing about weekend cooking. Dad bought a new bird feeder. Best to call around 5:30 PM on speaker.',
    tags: ['Family', 'Parents', 'Speaker call'],
    isQuiet: false,
    streak: 4,
    favoriteMedium: 'call',
    interactionHistory: [
      {
        id: 'ih-1',
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'call',
        note: 'Quick Sunday afternoon check-in about the garden.',
        durationMinutes: 14,
      },
    ],
  },
  {
    id: 'c-2',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarColor: 'bg-emerald-500',
    phone: '+1 (555) 876-5432',
    relationship: 'Best Friend',
    vibeCategory: 'low_energy',
    orbitTier: 'inner_circle',
    frequencyDays: 7,
    lastContactDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Zero judgment friend. We can talk about absurd memes or deep philosophy. Recently started bouldering.',
    tags: ['Bestie', 'Low Stakes', 'Memes'],
    isQuiet: false,
    streak: 7,
    favoriteMedium: 'text',
    interactionHistory: [
      {
        id: 'ih-2',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'text',
        note: 'Sent cat reels on Instagram and talked about weekend trip.',
      },
    ],
  },
  {
    id: 'c-3',
    name: 'Maya Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    avatarColor: 'bg-indigo-500',
    phone: '+1 (555) 345-6789',
    relationship: 'Close Friend',
    vibeCategory: 'warm',
    orbitTier: 'warm_orbit',
    frequencyDays: 30,
    lastContactDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Moved to Seattle 6 months ago. Working in UX design. Loves hearing about books and thrift store finds.',
    tags: ['Design', 'Seattle', 'Bookworm'],
    isQuiet: false,
    streak: 2,
    favoriteMedium: 'facetime',
    interactionHistory: [],
  },
  {
    id: 'c-4',
    name: 'Grandpa Joe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    avatarColor: 'bg-orange-500',
    phone: '+1 (555) 987-6543',
    relationship: 'Family',
    vibeCategory: 'deep_roots',
    orbitTier: 'warm_orbit',
    frequencyDays: 14,
    lastContactDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Speak clearly and enthusiastically! Ask about his woodworking workshop and old records.',
    tags: ['Family', 'Grandparents'],
    isQuiet: false,
    streak: 3,
    favoriteMedium: 'call',
    interactionHistory: [],
  },
  {
    id: 'c-5',
    name: 'Jordan Miller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    avatarColor: 'bg-teal-500',
    phone: '+1 (555) 456-7890',
    relationship: 'Friend',
    vibeCategory: 'low_energy',
    orbitTier: 'seasonal',
    frequencyDays: 90,
    lastContactDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'College roommate. Total safe space. He also has ADHD so neither of us ever takes delayed replies personally.',
    tags: ['College', 'ADHD Ally', 'Gaming'],
    isQuiet: false,
    streak: 1,
    favoriteMedium: 'text',
    interactionHistory: [],
  },
  {
    id: 'c-6',
    name: 'Elena Rostova (Mentor)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    avatarColor: 'bg-purple-500',
    email: 'elena.mentor@example.com',
    phone: '+1 (555) 678-9012',
    relationship: 'Mentor',
    vibeCategory: 'high_stakes',
    orbitTier: 'seasonal',
    frequencyDays: 90,
    lastContactDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Senior director at tech studio. Great advice on career growth. Keep message crisp and respectful of time.',
    tags: ['Career', 'Mentor', 'Networking'],
    isQuiet: false,
    streak: 1,
    favoriteMedium: 'text',
    interactionHistory: [],
  },
];

export const INITIAL_STATS: UserStats = {
  userName: 'Orbit Traveler',
  userBio: 'Nurturing real connections with ADHD-friendly cadence.',
  totalCallsLogged: 12,
  currentStreakDays: 3,
  lastActiveDate: new Date().toISOString(),
  guiltResetsCount: 2,
  todayCompletedCount: 0,
};

export function loadContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (!raw) {
      saveContacts(INITIAL_CONTACTS);
      return INITIAL_CONTACTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONTACTS;
  }
}

export function saveContacts(contacts: Contact[]): void {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save contacts to localStorage', e);
  }
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      saveStats(INITIAL_STATS);
      return INITIAL_STATS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATS;
  }
}

export function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function loadBattery(): SocialBatteryLevel {
  try {
    const raw = localStorage.getItem(BATTERY_KEY);
    if (raw === 'low' || raw === 'balanced' || raw === 'high') {
      return raw;
    }
    return 'balanced';
  } catch {
    return 'balanced';
  }
}

export function saveBattery(level: SocialBatteryLevel): void {
  try {
    localStorage.setItem(BATTERY_KEY, level);
  } catch {}
}

export function loadProStatus(): boolean {
  try {
    const raw = localStorage.getItem(PRO_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

export function saveProStatus(isPro: boolean): void {
  try {
    localStorage.setItem(PRO_KEY, isPro ? 'true' : 'false');
  } catch {}
}

export function calculateDaysSince(dateStr: string): number {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function isContactSnoozed(contact: Contact): boolean {
  if (!contact.snoozedUntil) return false;
  return new Date(contact.snoozedUntil).getTime() > Date.now();
}

// Shame-free score & text helpers
export interface ContactVibeStatus {
  daysSince: number;
  daysRemaining: number;
  isDue: boolean;
  isFreshStart: boolean; // Overdue without triggering shame
  statusMessage: string;
  statusBadge: string;
  badgeStyle: 'fresh' | 'due' | 'active' | 'snoozed' | 'quiet';
  healthScore: number; // 0 to 1 (1 = freshly connected, 0 = ready for fresh spark)
}

export function getShameFreeStatus(contact: Contact): ContactVibeStatus {
  if (contact.isQuiet) {
    return {
      daysSince: calculateDaysSince(contact.lastContactDate),
      daysRemaining: 999,
      isDue: false,
      isFreshStart: false,
      statusMessage: 'Parked in Quiet Orbit (no reminders)',
      statusBadge: 'Quiet Orbit',
      badgeStyle: 'quiet',
      healthScore: 0.5,
    };
  }

  if (isContactSnoozed(contact)) {
    const snoozeHours = Math.ceil(
      (new Date(contact.snoozedUntil!).getTime() - Date.now()) / (1000 * 60 * 60)
    );
    const snoozeText =
      snoozeHours > 24
        ? `Snoozed for ${Math.ceil(snoozeHours / 24)}d`
        : `Snoozed (${snoozeHours}h remaining)`;
    return {
      daysSince: calculateDaysSince(contact.lastContactDate),
      daysRemaining: 999,
      isDue: false,
      isFreshStart: false,
      statusMessage: `Resting right now • ${snoozeText}`,
      statusBadge: snoozeText,
      badgeStyle: 'snoozed',
      healthScore: 0.7,
    };
  }

  const daysSince = calculateDaysSince(contact.lastContactDate);
  const targetDays = contact.frequencyDays || 14;
  const daysRemaining = targetDays - daysSince;

  // Health score calculation (1.0 = today, decreases smoothly)
  const healthScore = Math.max(0.1, Math.min(1.0, 1 - (daysSince / (targetDays * 1.5))));

  if (daysSince > targetDays * 1.8) {
    // It's been a long while — activate ADHD shame-free fresh start
    return {
      daysSince,
      daysRemaining,
      isDue: true,
      isFreshStart: true,
      statusMessage: '✨ The stars have realigned! A perfect moment for a fresh check-in.',
      statusBadge: 'Fresh Start',
      badgeStyle: 'fresh',
      healthScore: 0.2,
    };
  } else if (daysSince >= targetDays) {
    // Due right around now
    return {
      daysSince,
      daysRemaining,
      isDue: true,
      isFreshStart: false,
      statusMessage: `🌟 Great time for a quick 2-minute hello or note`,
      statusBadge: 'Ready to Nudge',
      badgeStyle: 'due',
      healthScore: 0.45,
    };
  } else {
    // Healthy connected
    const daysLeftText = daysRemaining === 1 ? '1 day left in orbit' : `${daysRemaining} days left in orbit`;
    return {
      daysSince,
      daysRemaining,
      isDue: false,
      isFreshStart: false,
      statusMessage: `🌱 Connection warm (${daysSince}d ago) • ${daysLeftText}`,
      statusBadge: `${daysSince}d ago`,
      badgeStyle: 'active',
      healthScore,
    };
  }
}
