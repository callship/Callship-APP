import { Contact, UserStats } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  totalXP: number;
  currentLevelXP: number;
  xpNeededForNext: number;
  progressPct: number;
  xpFloor: number;
  xpCeiling: number;
}

/**
 * Escalating XP Threshold calculation:
 * Level 1: 0 - 100 XP (100 delta)
 * Level 2: 100 - 300 XP (200 delta)
 * Level 3: 300 - 700 XP (400 delta)
 * Level 4: 700 - 1,500 XP (800 delta)
 * Level 5+: Scales smoothly with progressive 1,000 XP blocks up to Level 100+
 */
export function getXPForLevel(lvl: number): number {
  if (lvl <= 1) return 0;
  if (lvl === 2) return 100;
  if (lvl === 3) return 300;
  if (lvl === 4) return 700;
  if (lvl === 5) return 1500;
  // For lvl >= 6: 1500 + (lvl - 5) * 1000
  return 1500 + (lvl - 5) * 1000;
}

export function calculateTotalXP(stats: UserStats, contacts: Contact[]): number {
  const contactsWithNotes = contacts.filter((c) => c.notes && c.notes.trim().length > 0).length;
  
  const totalSprintMinutes = contacts.reduce((acc, c) => {
    return (
      acc +
      (c.interactionHistory || []).reduce(
        (sum, log) => sum + (log.durationMinutes || (log.type === 'call' ? 5 : 0)),
        0
      )
    );
  }, 0);

  return (
    stats.totalCallsLogged * 50 +
    stats.currentStreakDays * 30 +
    contactsWithNotes * 25 +
    stats.guiltResetsCount * 20 +
    totalSprintMinutes * 5
  );
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Orbit Novice',
  2: 'Cosmic Explorer',
  3: 'Signal Finder',
  4: 'Starlight Weaver',
  5: 'Constellation Keeper',
  6: 'Galaxy Ambassador',
  7: 'Deep Orbit Master',
  8: 'Harmonic Resonance',
  9: 'Solar Champion',
  10: 'Supernova Spark',
  15: 'Nebula Pathfinder',
  20: 'Quasar Navigator',
  25: 'Pulsar Harmonizer',
  30: 'Celestial Vanguard',
  40: 'Astral Wayfarer',
  50: 'Interstellar Luminary',
  60: 'Dimensional Anchor',
  75: 'Cosmic Zenith',
  85: 'Eternal Orbit Sovereign',
  95: 'Universal Empathy Titan',
  100: 'Galactic Connector',
};

export function getTitleForLevel(level: number): string {
  if (level >= 100) return 'Galactic Connector 🌌';
  
  const milestones = [100, 95, 85, 75, 60, 50, 40, 30, 25, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  for (const m of milestones) {
    if (level >= m) {
      return LEVEL_TITLES[m] || `Orbit Master Lvl ${level}`;
    }
  }
  return 'Orbit Novice';
}

export function calculateLevelInfo(totalXP: number): LevelInfo {
  let level = 1;
  while (totalXP >= getXPForLevel(level + 1)) {
    level++;
  }

  const xpFloor = getXPForLevel(level);
  const xpCeiling = getXPForLevel(level + 1);
  const xpNeededForNext = xpCeiling - xpFloor;
  const currentLevelXP = totalXP - xpFloor;
  const progressPct = Math.min(100, Math.max(0, Math.round((currentLevelXP / xpNeededForNext) * 100)));
  const title = getTitleForLevel(level);

  return {
    level,
    title,
    totalXP,
    currentLevelXP,
    xpNeededForNext,
    progressPct,
    xpFloor,
    xpCeiling,
  };
}
