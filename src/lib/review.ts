import { levels } from "../curriculum";
import type { Lesson } from "../curriculum/types";

export interface ReviewState {
  /** How many times this lesson has been revised. */
  count: number;
  /** ISO date of the last revision (or of lesson completion, before any). */
  last: string;
}

/**
 * Days to wait before a completed lesson comes up for revision again.
 * Grows with each revision — classic spaced repetition, kid-sized.
 */
const INTERVALS = [3, 7, 14, 30];

export function reviewIntervalDays(count: number): number {
  return INTERVALS[Math.min(count, INTERVALS.length - 1)];
}

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

export interface DueReview {
  lesson: Lesson;
  levelId: number;
  timesReviewed: number;
}

/**
 * Lessons that are complete and due for a quick revision. Older concepts
 * resurface as the kid progresses; freshly finished lessons wait a few days.
 */
export function dueReviews(
  isLessonComplete: (lesson: Lesson) => boolean,
  lessonCompletedAt: Record<string, string>,
  reviews: Record<string, ReviewState>,
): DueReview[] {
  const due: DueReview[] = [];
  for (const level of levels) {
    for (const lesson of level.lessons) {
      if (!isLessonComplete(lesson)) continue;
      const state = reviews[lesson.id];
      const anchor = state?.last ?? lessonCompletedAt[lesson.id];
      if (!anchor) continue; // completed before tracking existed — skip
      const count = state?.count ?? 0;
      if (daysSince(anchor) >= reviewIntervalDays(count)) {
        due.push({ lesson, levelId: level.id, timesReviewed: count });
      }
    }
  }
  // Longest-unreviewed first — oldest memories need the most love.
  due.sort(
    (a, b) =>
      new Date(reviews[a.lesson.id]?.last ?? lessonCompletedAt[a.lesson.id]).getTime() -
      new Date(reviews[b.lesson.id]?.last ?? lessonCompletedAt[b.lesson.id]).getTime(),
  );
  return due;
}
