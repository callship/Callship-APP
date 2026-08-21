export type RelationshipType =
  | 'Family'
  | 'Best Friend'
  | 'Close Friend'
  | 'Friend'
  | 'Colleague'
  | 'Mentor'
  | 'Network'
  | 'Acquaintance'
  | 'Other';

export type VibeCategory = 'low_energy' | 'warm' | 'high_stakes' | 'deep_roots';

export type OrbitTier = 'inner_circle' | 'warm_orbit' | 'seasonal' | 'annual' | 'quiet';

export type SocialBatteryLevel = 'low' | 'balanced' | 'high';

export interface InteractionLog {
  id: string;
  date: string; // ISO string
  type: 'call' | 'text' | 'facetime' | 'meet' | 'reset' | 'note';
  note?: string;
  durationMinutes?: number;
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  avatarColor?: string;
  phone?: string;
  email?: string;
  relationship: RelationshipType;
  vibeCategory: VibeCategory;
  orbitTier: OrbitTier;
  frequencyDays: number;
  lastContactDate: string; // ISO string
  snoozedUntil?: string | null; // ISO string or null
  notes: string;
  tags?: string[];
  isQuiet: boolean;
  streak: number;
  interactionHistory: InteractionLog[];
  favoriteMedium?: 'call' | 'text' | 'whatsapp' | 'facetime';
}

export interface AIScript {
  title: string;
  text: string;
  tag: string;
}

export interface UserStats {
  userName?: string;
  userBio?: string;
  totalCallsLogged: number;
  currentStreakDays: number;
  lastActiveDate: string;
  guiltResetsCount: number;
  todayCompletedCount: number;
  isPro?: boolean;
}
