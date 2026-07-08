import { levels } from "../curriculum";
import type { Lesson, Level } from "../curriculum/types";
import type { Solve } from "./progress";

export interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

interface BadgeInputs {
  isLessonComplete: (lesson: Lesson) => boolean;
  isLevelComplete: (level: Level) => boolean;
  isLevelMastered: (level: Level) => boolean;
  solves: Solve[];
  xp: number;
  bestStreak: number;
  completedChallengeCount: number;
  reviewCount: number;
}

interface BadgeWithCheck extends BadgeDef {
  earned: (inputs: BadgeInputs) => boolean;
}

function lessonById(id: string): Lesson | undefined {
  for (const level of levels) {
    const lesson = level.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

function lessonDone(inputs: BadgeInputs, id: string) {
  const lesson = lessonById(id);
  return !!lesson && inputs.isLessonComplete(lesson);
}

function levelDone(inputs: BadgeInputs, id: number) {
  const level = levels.find((l) => l.id === id);
  return !!level && inputs.isLevelComplete(level);
}

function bestMs(solves: Solve[]): number | null {
  if (solves.length === 0) return null;
  return Math.min(...solves.map((s) => s.ms));
}

const BADGES: BadgeWithCheck[] = [
  {
    id: "first-lesson",
    emoji: "🌱",
    name: "First Steps",
    description: "Finish your very first lesson.",
    earned: (i) =>
      levels.some((level) => level.lessons.some((l) => i.isLessonComplete(l))),
  },
  {
    id: "notation-ninja",
    emoji: "🥷",
    name: "Notation Ninja",
    description: "Complete Level 0 — you can read the cube's secret code!",
    earned: (i) => levelDone(i, 0),
  },
  {
    id: "daisy-gardener",
    emoji: "🌼",
    name: "Daisy Gardener",
    description: "Learn to make the daisy.",
    earned: (i) => lessonDone(i, "daisy"),
  },
  {
    id: "first-cross",
    emoji: "➕",
    name: "First Cross",
    description: "Learn the white cross.",
    earned: (i) => lessonDone(i, "white-cross"),
  },
  {
    id: "white-layer-hero",
    emoji: "🦸",
    name: "White Layer Hero",
    description: "Finish the white corners lesson — one whole layer done!",
    earned: (i) => lessonDone(i, "white-corners"),
  },
  {
    id: "middle-manager",
    emoji: "🥪",
    name: "Middle Manager",
    description: "Learn to solve the middle layer.",
    earned: (i) => lessonDone(i, "middle-layer"),
  },
  {
    id: "cube-solver",
    emoji: "🏆",
    name: "Cube Solver",
    description: "Complete Level 1 — you can solve the whole cube!",
    earned: (i) => levelDone(i, 1),
  },
  {
    id: "quick-fingers",
    emoji: "🫰",
    name: "Quick Fingers",
    description: "Complete Level 2 — finger tricks unlocked.",
    earned: (i) => levelDone(i, 2),
  },
  {
    id: "f2l-apprentice",
    emoji: "🧙",
    name: "F2L Apprentice",
    description: "Complete Level 3 — welcome to CFOP.",
    earned: (i) => levelDone(i, 3),
  },
  {
    id: "algorithm-collector",
    emoji: "📚",
    name: "Algorithm Collector",
    description: "Complete Level 4 — the full algorithm arsenal.",
    earned: (i) => levelDone(i, 4),
  },
  {
    id: "cube-academy-graduate",
    emoji: "🎓",
    name: "Cube Academy Graduate",
    description: "Complete every level. You're a speedcuber now!",
    earned: (i) => levels.every((level) => i.isLevelComplete(level)),
  },
  {
    id: "first-timed-solve",
    emoji: "⏱️",
    name: "On the Clock",
    description: "Record your first timed solve.",
    earned: (i) => i.solves.length >= 1,
  },
  {
    id: "ten-solves",
    emoji: "🔟",
    name: "Ten Timer",
    description: "Record 10 timed solves.",
    earned: (i) => i.solves.length >= 10,
  },
  {
    id: "fifty-solves",
    emoji: "💪",
    name: "Practice Machine",
    description: "Record 50 timed solves.",
    earned: (i) => i.solves.length >= 50,
  },
  {
    id: "sub-3",
    emoji: "🐢",
    name: "Under 3 Minutes",
    description: "Solve the cube in under 3 minutes.",
    earned: (i) => {
      const b = bestMs(i.solves);
      return b !== null && b < 180_000;
    },
  },
  {
    id: "sub-2",
    emoji: "🚴",
    name: "Under 2 Minutes",
    description: "Solve the cube in under 2 minutes.",
    earned: (i) => {
      const b = bestMs(i.solves);
      return b !== null && b < 120_000;
    },
  },
  {
    id: "sub-1",
    emoji: "🚀",
    name: "Under 1 Minute",
    description: "Solve the cube in under 60 seconds. Amazing!",
    earned: (i) => {
      const b = bestMs(i.solves);
      return b !== null && b < 60_000;
    },
  },
  {
    id: "sub-30",
    emoji: "⚡",
    name: "Under 30 Seconds",
    description: "Solve the cube in under 30 seconds. Speedcuber!",
    earned: (i) => {
      const b = bestMs(i.solves);
      return b !== null && b < 30_000;
    },
  },
  // --- Streaks: one concept a day keeps the streak alive ---
  {
    id: "streak-3",
    emoji: "🔥",
    name: "On Fire",
    description: "Learn something 3 days in a row.",
    earned: (i) => i.bestStreak >= 3,
  },
  {
    id: "streak-7",
    emoji: "🗓️",
    name: "Week Warrior",
    description: "Keep a 7-day learning streak.",
    earned: (i) => i.bestStreak >= 7,
  },
  {
    id: "streak-14",
    emoji: "🌋",
    name: "Unstoppable",
    description: "Keep a 14-day learning streak.",
    earned: (i) => i.bestStreak >= 14,
  },
  {
    id: "streak-30",
    emoji: "🌟",
    name: "Habit Hero",
    description: "Keep a 30-day learning streak. One concept a day — every day!",
    earned: (i) => i.bestStreak >= 30,
  },
  // --- Challenges ---
  {
    id: "first-challenge",
    emoji: "🎯",
    name: "Challenge Accepted",
    description: "Complete your first practice challenge.",
    earned: (i) => i.completedChallengeCount >= 1,
  },
  {
    id: "five-challenges",
    emoji: "🏹",
    name: "Challenge Hunter",
    description: "Complete 5 practice challenges.",
    earned: (i) => i.completedChallengeCount >= 5,
  },
  {
    id: "fifteen-challenges",
    emoji: "🏆",
    name: "Challenge Champion",
    description: "Complete 15 practice challenges.",
    earned: (i) => i.completedChallengeCount >= 15,
  },
  ...levels.map(
    (level): BadgeWithCheck => ({
      id: `master-level-${level.id}`,
      emoji: "💎",
      name: `Level ${level.id} Master`,
      description: `Finish every lesson AND every challenge in Level ${level.id}: ${level.title}.`,
      earned: (i) => i.isLevelMastered(level),
    }),
  ),
  // --- Revision: keep old concepts fresh ---
  {
    id: "first-review",
    emoji: "🔁",
    name: "Memory Refresher",
    description: "Revise a lesson you finished earlier.",
    earned: (i) => i.reviewCount >= 1,
  },
  {
    id: "ten-reviews",
    emoji: "🧠",
    name: "Brain Booster",
    description: "Do 10 revisions. Old concepts stay sharp!",
    earned: (i) => i.reviewCount >= 10,
  },
  {
    id: "twentyfive-reviews",
    emoji: "🐘",
    name: "Elephant Memory",
    description: "Do 25 revisions. You never forget!",
    earned: (i) => i.reviewCount >= 25,
  },
  // --- XP milestones ---
  {
    id: "xp-100",
    emoji: "✨",
    name: "Rising Star",
    description: "Earn 100 XP.",
    earned: (i) => i.xp >= 100,
  },
  {
    id: "xp-500",
    emoji: "🌠",
    name: "Shooting Star",
    description: "Earn 500 XP.",
    earned: (i) => i.xp >= 500,
  },
  {
    id: "xp-1500",
    emoji: "💫",
    name: "Supernova",
    description: "Earn 1500 XP.",
    earned: (i) => i.xp >= 1500,
  },
];

export function allBadges(): BadgeDef[] {
  return BADGES;
}

export function earnedBadgeIds(inputs: BadgeInputs): Set<string> {
  return new Set(BADGES.filter((b) => b.earned(inputs)).map((b) => b.id));
}
