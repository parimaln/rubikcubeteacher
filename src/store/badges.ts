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
  solves: Solve[];
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
];

export function allBadges(): BadgeDef[] {
  return BADGES;
}

export function earnedBadgeIds(inputs: BadgeInputs): Set<string> {
  return new Set(BADGES.filter((b) => b.earned(inputs)).map((b) => b.id));
}
