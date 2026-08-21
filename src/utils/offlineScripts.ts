import { Contact } from '../types';

/**
 * High-flexibility ADHD Offline Spintax & Variation Generator
 * Uses dynamic slot permutations {x|y|z} to generate thousands of natural, shame-free messages offline.
 */

interface SpintaxTemplate {
  title: string;
  category: 'shame_free' | 'casual' | 'voice_note' | 'meme' | 'meaningful' | 'sprint_invite';
  tag: string;
  slots: {
    greeting: string[];
    admitting: string[];
    connection: string[];
    closing: string[];
  };
}

export const SPINTAX_TEMPLATES: SpintaxTemplate[] = [
  {
    title: 'ADHD Brain Truth (Light & Direct)',
    category: 'shame_free',
    tag: 'Shame-Free',
    slots: {
      greeting: [
        'Hey {name}!',
        'Hi {name}!',
        'Yo {name}!',
        'Hey there {name}!',
        'Quick wave to {name}!',
      ],
      admitting: [
        'My ADHD brain put you in a mental drawer for a bit, but I just pulled you back out!',
        'Time blindness struck hard and suddenly 3 weeks felt like 5 minutes in my head.',
        'I fell down a major life rabbit hole and my social battery was on 1% power.',
        'Total honesty: out of sight became out of mind for a minute, but you popped right into my head today!',
        'I went into accidental offline hermit mode for a bit.',
      ],
      connection: [
        'Saw something that made me smile and immediately thought of you.',
        'Just wanted to check in and see how your heart and brain are feeling lately.',
        'Miss having you in my regular loop and wanted to send some love.',
        'Just wanted to see what the latest highlight is in your world.',
        'Was remembering our last chat and wanted to see how you are doing.',
      ],
      closing: [
        'Zero pressure to reply or give a giant life update—just sending good vibes!',
        'No social debt or guilt attached to this text at all. Hope your week is smooth!',
        'Reply whenever you have bandwidth, even if it is next week!',
        'Sending big warm energy your way today!',
      ],
    },
  },
  {
    title: 'Time Blindness Warm Hug',
    category: 'shame_free',
    tag: 'Shame-Free',
    slots: {
      greeting: [
        'Hey {name}!',
        'Hi {name} friend!',
        'Hey dear {name}!',
      ],
      admitting: [
        'In my head we literally just talked yesterday, but my calendar is telling on me.',
        'I have zero perception of linear time, but my affection for you stays 100% constant.',
        'Popping back up like a friendly groundhog after an unintentional hiatus.',
      ],
      connection: [
        'Hope life has been treating you gently.',
        'Wanted to send a quick ping of genuine appreciation.',
        'Hope work and home are in a nice peaceful rhythm.',
      ],
      closing: [
        'No long recap needed unless you want to vent or celebrate something!',
        'Zero stress to reply—just wanted you to know I am in your corner.',
        'Take all the time you need, talk soon!',
      ],
    },
  },
  {
    title: 'Low-Stakes 2-Minute Ping',
    category: 'casual',
    tag: 'Low Pressure',
    slots: {
      greeting: [
        'Hey {name}!',
        'Hi {name}!',
        'Quick hello {name}!',
      ],
      admitting: [
        'Just taking a 60-second tea/coffee break between tasks.',
        'Stepping away from my desk for a second.',
        'Taking a quick breath before my next thing.',
      ],
      connection: [
        'Wanted to send a speedy micro-hello!',
        'Thinking of you and hoping your week is going great.',
        'Hope your day has had at least one really fun highlight.',
      ],
      closing: [
        'What is one good thing that happened for you this week?',
        'How is your day treating you so far?',
        'Hope you have a restful evening ahead!',
      ],
    },
  },
  {
    title: 'Voice Note Ask 🎙️',
    category: 'voice_note',
    tag: 'Audio First',
    slots: {
      greeting: [
        'Hey {name}!',
        'Hi {name}!',
      ],
      admitting: [
        'Typing a long wall of text feels overwhelming for my thumbs today.',
        'Going for a quick 10-minute walk outside right now.',
        'My brain is in audio-mode today.',
      ],
      connection: [
        'Mind if I drop you a 1-minute rambling voice note to say hi?',
        'Are you open to quick voice memos if I leave you a short audio hug?',
        'Would love to trade 60-second voice notes if that feels easier for you too!',
      ],
      closing: [
        'Zero pressure to listen right away, whenever you are free!',
        'No rush at all, just let me know if voice notes work for you.',
      ],
    },
  },
  {
    title: 'Playful Meme / Random Spark',
    category: 'meme',
    tag: 'Playful',
    slots: {
      greeting: [
        'Hey {name}!',
        'Yo {name}!',
        '{name}!',
      ],
      admitting: [
        'I have come across something so hyper-specific it legally belongs to you.',
        'Just had an absurd thought that only you would appreciate.',
        'A wild memory of our adventures suddenly appeared in my brain.',
      ],
      connection: [
        'Are you ready for an unhinged meme delivery?',
        'How is life in your corner of the galaxy?',
        'Tell me you are doing something fun today.',
      ],
      closing: [
        'Sending high-fives and chaotic positive energy!',
        'Hope you are smiling today!',
      ],
    },
  },
  {
    title: '5-Minute Speed Call Invite',
    category: 'sprint_invite',
    tag: 'Call Sprint',
    slots: {
      greeting: [
        'Hey {name}!',
        'Hi {name}!',
        'Hey {name} friend!',
      ],
      admitting: [
        'Would love to hear your actual voice without either of us getting trapped on a 2-hour call!',
        'I have a quick 5-minute window while making coffee.',
        'Up for a fast 5-minute phone sprint sometime this week?',
      ],
      connection: [
        'Strict 5-minute timer so neither of our brains gets exhausted.',
        'We set a 5-min timer and hang up guilt-free when the buzzer dings!',
        'Just enough time to hear your laugh and say hello.',
      ],
      closing: [
        'Let me know if you have a 5-min window today or tomorrow!',
        'No worries if you are packed with meetings!',
      ],
    },
  },
  {
    title: 'Memory Scratchpad Callback',
    category: 'meaningful',
    tag: 'Warm & Meaningful',
    slots: {
      greeting: [
        'Hey {name}!',
        'Hi {name}!',
        'Dear {name},',
      ],
      admitting: [
        'Was reminiscing about you today and wanted to reach out.',
        'You were on my mind this morning.',
        'Just reflecting on people I am truly grateful for.',
      ],
      connection: [
        'Always so glad we are in each other\'s lives.',
        'Really appreciate your humor, wisdom, and kindness.',
        'Hope you are giving yourself credit for all you do.',
      ],
      closing: [
        'Sending love and a big warm hug your way!',
        'Hope your week brings you peace and good news.',
      ],
    },
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate multi-variation scripts for a contact based on Spintax templates
 */
export function getOfflineScriptsForContact(
  contact: Contact,
  categoryFilter: string = 'all',
  daysSince: number = 0
): { title: string; text: string; tag: string }[] {
  const firstName = contact.name.split(' ')[0] || contact.name;
  let pool = SPINTAX_TEMPLATES;

  if (categoryFilter !== 'all') {
    pool = pool.filter((t) => t.category === categoryFilter);
    if (pool.length === 0) pool = SPINTAX_TEMPLATES;
  }

  // Shuffle templates
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  return selected.map((item) => {
    const greeting = pickRandom(item.slots.greeting).replace('{name}', firstName);
    const admitting = pickRandom(item.slots.admitting);
    let connection = pickRandom(item.slots.connection);
    const closing = pickRandom(item.slots.closing);

    // If context notes exist and template is meaningful, weave it in
    if (contact.notes && contact.notes.length > 5 && item.category === 'meaningful') {
      connection = `Was remembering when you mentioned "${contact.notes.slice(0, 40)}..." and wanted to see how that went!`;
    }

    const fullText = `${greeting} ${admitting} ${connection} ${closing}`;

    return {
      title: item.title,
      text: fullText,
      tag: item.tag,
    };
  });
}

/**
 * Generate 3 bullet conversation prep prompts tailored to the contact's notes & vibe
 */
export function getOfflinePrepPointsForContact(contact: Contact): string[] {
  const points: string[] = [];

  if (contact.notes && contact.notes.trim().length > 0) {
    points.push(`Context follow-up: "${contact.notes.slice(0, 50)}..."`);
  } else {
    points.push(`Ask what good things have happened in their week`);
  }

  if (contact.relationship === 'Family') {
    points.push(`Share 1 quick highlight and ask about family health`);
  } else if (contact.relationship === 'Mentor' || contact.relationship === 'Colleague') {
    points.push(`Keep it focused on 1-2 key project updates`);
  } else {
    points.push(`Zero pressure: keep it light and fun`);
  }

  points.push(`5-min sprint rule: a short call leaves both feeling energized, never trapped`);

  return points;
}
