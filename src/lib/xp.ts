/** XP awarded for each kind of learning action. */
export const XP = {
  step: 10,
  challengeRep: 10,
  challengeComplete: 25,
  review: 15,
  solve: 5,
} as const;

export interface Rank {
  xp: number;
  name: string;
  emoji: string;
}

/** Fun kid-facing ranks, unlocked by total XP. */
export const RANKS: Rank[] = [
  { xp: 0, name: "Cubie Rookie", emoji: "🐣" },
  { xp: 50, name: "Sticker Scout", emoji: "🔍" },
  { xp: 150, name: "Layer Learner", emoji: "🧱" },
  { xp: 300, name: "Cross Crafter", emoji: "➕" },
  { xp: 500, name: "Corner Captain", emoji: "🧭" },
  { xp: 800, name: "Algorithm Ace", emoji: "🃏" },
  { xp: 1200, name: "Speed Star", emoji: "⭐" },
  { xp: 1700, name: "Cube Wizard", emoji: "🧙" },
  { xp: 2400, name: "Cube Legend", emoji: "👑" },
];

export function rankForXp(xp: number): {
  rank: Rank;
  next: Rank | null;
  /** 0..1 progress from current rank to the next one. */
  progress: number;
} {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) index = i;
  }
  const rank = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const progress = next
    ? Math.min(1, (xp - rank.xp) / (next.xp - rank.xp))
    : 1;
  return { rank, next, progress };
}
