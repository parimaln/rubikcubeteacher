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
import type { Lesson, Level } from "../curriculum/types";

export interface Solve {
  id: string;
  ms: number;
  scramble: string;
  date: string; // ISO
}

interface StoredProgress {
  completedSteps: Record<string, true>;
  solves: Solve[];
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
  resetAll: () => void;
}

const STORAGE_KEY = "cube-academy-progress-v1";

function load(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredProgress;
      return {
        completedSteps: parsed.completedSteps ?? {},
        solves: parsed.solves ?? [],
      };
    }
  } catch {
    // corrupted storage — start fresh
  }
  return { completedSteps: {}, solves: [] };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function stepKey(lessonId: string, stepId: string) {
  return `${lessonId}/${stepId}`;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredProgress>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const isStepComplete = useCallback(
    (lessonId: string, stepId: string) =>
      !!state.completedSteps[stepKey(lessonId, stepId)],
    [state.completedSteps],
  );

  const markStepComplete = useCallback((lessonId: string, stepId: string) => {
    setState((s) => ({
      ...s,
      completedSteps: { ...s.completedSteps, [stepKey(lessonId, stepId)]: true },
    }));
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
      ...s,
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

  const resetAll = useCallback(() => {
    setState({ completedSteps: {}, solves: [] });
  }, []);

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
      addSolve,
      deleteSolve,
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
