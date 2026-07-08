import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { levels } from "../curriculum";
import { challengesForLevel, type Challenge } from "../curriculum/challenges";
import type { Lesson, Level } from "../curriculum/types";
import type { ReviewState } from "../lib/review";
import { dateKey } from "../lib/streak";
import { XP } from "../lib/xp";

export interface Solve {
  id: string;
  ms: number;
  scramble: string;
  date: string; // ISO
}

interface StoredProgress {
  completedSteps: Record<string, true>;
  solves: Solve[];
  /** Total XP earned by this profile. */
  xp: number;
  /** challengeId → repetitions done so far. */
  challengeReps: Record<string, number>;
  /** lessonId → ISO date the lesson was first completed. */
  lessonCompletedAt: Record<string, string>;
  /** lessonId → spaced-revision state. */
  reviews: Record<string, ReviewState>;
  /** YYYY-MM-DD → learning actions that day (drives the streak). */
  activity: Record<string, number>;
}

interface ProgressContextValue {
  isStepComplete: (lessonId: string, stepId: string) => boolean;
  markStepComplete: (lessonId: string, stepId: string) => void;
  lessonProgress: (lesson: Lesson) => { done: number; total: number };
  isLessonComplete: (lesson: Lesson) => boolean;
  levelProgress: (level: Level) => { done: number; total: number };
  isLevelComplete: (level: Level) => boolean;
  isLevelUnlocked: (level: Level) => boolean;
  solves: Solve[];
  addSolve: (ms: number, scramble: string) => void;
  deleteSolve: (id: string) => void;
  xp: number;
  challengeReps: (challengeId: string) => number;
  isChallengeComplete: (challenge: Challenge) => boolean;
  completedChallengeCount: number;
  addChallengeRep: (challenge: Challenge) => void;
  isLevelMastered: (level: Level) => boolean;
  masteredLevelCount: number;
  reviews: Record<string, ReviewState>;
  lessonCompletedAt: Record<string, string>;
  markReviewed: (lessonId: string) => void;
  reviewCount: number;
  activity: Record<string, number>;
  resetAll: () => void;
}

function emptyProgress(): StoredProgress {
  return {
    completedSteps: {},
    solves: [],
    xp: 0,
    challengeReps: {},
    lessonCompletedAt: {},
    reviews: {},
    activity: {},
  };
}

function load(storageKey: string): StoredProgress {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredProgress>;
      return {
        completedSteps: parsed.completedSteps ?? {},
        solves: parsed.solves ?? [],
        xp: parsed.xp ?? 0,
        challengeReps: parsed.challengeReps ?? {},
        lessonCompletedAt: parsed.lessonCompletedAt ?? {},
        reviews: parsed.reviews ?? {},
        activity: parsed.activity ?? {},
      };
    }
  } catch {
    // corrupted storage — start fresh
  }
  return emptyProgress();
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function stepKey(lessonId: string, stepId: string) {
  return `${lessonId}/${stepId}`;
}

function lessonById(lessonId: string): Lesson | undefined {
  for (const level of levels) {
    const lesson = level.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

/** Bump today's activity counter and add XP — every learning action does this. */
function logAction(s: StoredProgress, xpGained: number): StoredProgress {
  const today = dateKey();
  return {
    ...s,
    xp: s.xp + xpGained,
    activity: { ...s.activity, [today]: (s.activity[today] ?? 0) + 1 },
  };
}

export function ProgressProvider({
  storageKey,
  children,
}: {
  storageKey: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<StoredProgress>(() => load(storageKey));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [storageKey, state]);

  const isStepComplete = useCallback(
    (lessonId: string, stepId: string) =>
      !!state.completedSteps[stepKey(lessonId, stepId)],
    [state.completedSteps],
  );

  const markStepComplete = useCallback((lessonId: string, stepId: string) => {
    setState((s) => {
      const key = stepKey(lessonId, stepId);
      if (s.completedSteps[key]) return s; // already done — no double XP
      let next = logAction(s, XP.step);
      next = {
        ...next,
        completedSteps: { ...next.completedSteps, [key]: true },
      };
      // Stamp the lesson-completion date the moment its last step is done —
      // this is what schedules the lesson for spaced revision later.
      const lesson = lessonById(lessonId);
      if (
        lesson &&
        !next.lessonCompletedAt[lessonId] &&
        lesson.steps.every((st) => next.completedSteps[stepKey(lessonId, st.id)])
      ) {
        next = {
          ...next,
          lessonCompletedAt: {
            ...next.lessonCompletedAt,
            [lessonId]: new Date().toISOString(),
          },
        };
      }
      return next;
    });
  }, []);

  const lessonProgress = useCallback(
    (lesson: Lesson) => {
      const done = lesson.steps.filter(
        (step) => state.completedSteps[stepKey(lesson.id, step.id)],
      ).length;
      return { done, total: lesson.steps.length };
    },
    [state.completedSteps],
  );

  const isLessonComplete = useCallback(
    (lesson: Lesson) => {
      const { done, total } = lessonProgress(lesson);
      return total > 0 && done === total;
    },
    [lessonProgress],
  );

  const levelProgress = useCallback(
    (level: Level) => {
      let done = 0;
      let total = 0;
      for (const lesson of level.lessons) {
        const p = lessonProgress(lesson);
        done += p.done;
        total += p.total;
      }
      return { done, total };
    },
    [lessonProgress],
  );

  const isLevelComplete = useCallback(
    (level: Level) => {
      const { done, total } = levelProgress(level);
      return total > 0 && done === total;
    },
    [levelProgress],
  );

  const isLevelUnlocked = useCallback(
    (level: Level) => {
      const index = levels.findIndex((l) => l.id === level.id);
      if (index <= 0) return true;
      return isLevelComplete(levels[index - 1]);
    },
    [isLevelComplete],
  );

  const addSolve = useCallback((ms: number, scramble: string) => {
    setState((s) => ({
      ...logAction(s, XP.solve),
      solves: [
        ...s.solves,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          ms,
          scramble,
          date: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const deleteSolve = useCallback((id: string) => {
    setState((s) => ({ ...s, solves: s.solves.filter((x) => x.id !== id) }));
  }, []);

  const challengeReps = useCallback(
    (challengeId: string) => state.challengeReps[challengeId] ?? 0,
    [state.challengeReps],
  );

  const isChallengeComplete = useCallback(
    (challenge: Challenge) => challengeReps(challenge.id) >= challenge.reps,
    [challengeReps],
  );

  const addChallengeRep = useCallback((challenge: Challenge) => {
    setState((s) => {
      const current = s.challengeReps[challenge.id] ?? 0;
      if (current >= challenge.reps) return s; // already mastered
      const finishing = current + 1 === challenge.reps;
      const gained = XP.challengeRep + (finishing ? XP.challengeComplete : 0);
      return {
        ...logAction(s, gained),
        challengeReps: { ...s.challengeReps, [challenge.id]: current + 1 },
      };
    });
  }, []);

  const isLevelMastered = useCallback(
    (level: Level) =>
      isLevelComplete(level) &&
      challengesForLevel(level.id).every((c) => isChallengeComplete(c)),
    [isLevelComplete, isChallengeComplete],
  );

  const markReviewed = useCallback((lessonId: string) => {
    setState((s) => {
      const prev = s.reviews[lessonId];
      return {
        ...logAction(s, XP.review),
        reviews: {
          ...s.reviews,
          [lessonId]: {
            count: (prev?.count ?? 0) + 1,
            last: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(emptyProgress());
  }, []);

  const completedChallengeCount = useMemo(
    () =>
      levels
        .flatMap((level) => challengesForLevel(level.id))
        .filter((c) => (state.challengeReps[c.id] ?? 0) >= c.reps).length,
    [state.challengeReps],
  );

  const masteredLevelCount = useMemo(
    () => levels.filter((level) => isLevelMastered(level)).length,
    [isLevelMastered],
  );

  const reviewCount = useMemo(
    () =>
      Object.values(state.reviews).reduce((sum, r) => sum + r.count, 0),
    [state.reviews],
  );

  const value = useMemo(
    () => ({
      isStepComplete,
      markStepComplete,
      lessonProgress,
      isLessonComplete,
      levelProgress,
      isLevelComplete,
      isLevelUnlocked,
      solves: state.solves,
      addSolve,
      deleteSolve,
      xp: state.xp,
      challengeReps,
      isChallengeComplete,
      completedChallengeCount,
      addChallengeRep,
      isLevelMastered,
      masteredLevelCount,
      reviews: state.reviews,
      lessonCompletedAt: state.lessonCompletedAt,
      markReviewed,
      reviewCount,
      activity: state.activity,
      resetAll,
    }),
    [
      isStepComplete,
      markStepComplete,
      lessonProgress,
      isLessonComplete,
      levelProgress,
      isLevelComplete,
      isLevelUnlocked,
      state.solves,
      state.xp,
      state.reviews,
      state.lessonCompletedAt,
      state.activity,
      addSolve,
      deleteSolve,
      challengeReps,
      isChallengeComplete,
      completedChallengeCount,
      addChallengeRep,
      isLevelMastered,
      masteredLevelCount,
      markReviewed,
      reviewCount,
      resetAll,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
