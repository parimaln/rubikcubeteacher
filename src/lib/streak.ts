/** Local-timezone YYYY-MM-DD key for a given date (defaults to now). */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDays(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d + delta);
  return dateKey(date);
}

/**
 * Consecutive-day streak of concept activity, counted back from today.
 * The streak is still "alive" if today has no activity yet but yesterday
 * does — the kid just hasn't done today's concept yet.
 */
export function currentStreak(activity: Record<string, number>): number {
  const today = dateKey();
  let cursor = activity[today] ? today : shiftDays(today, -1);
  let streak = 0;
  while (activity[cursor]) {
    streak += 1;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

/** Longest streak ever recorded in the activity log. */
export function bestStreak(activity: Record<string, number>): number {
  let best = 0;
  for (const key of Object.keys(activity)) {
    // Only count runs from their starting day to avoid re-walking runs.
    if (activity[shiftDays(key, -1)]) continue;
    let len = 0;
    let cursor = key;
    while (activity[cursor]) {
      len += 1;
      cursor = shiftDays(cursor, 1);
    }
    best = Math.max(best, len);
  }
  return best;
}

/** How many concepts were completed today. */
export function conceptsToday(activity: Record<string, number>): number {
  return activity[dateKey()] ?? 0;
}

/** The last 7 days (oldest first) with whether each had activity. */
export function lastWeek(
  activity: Record<string, number>,
): { key: string; label: string; done: boolean; isToday: boolean }[] {
  const today = dateKey();
  const days: { key: string; label: string; done: boolean; isToday: boolean }[] =
    [];
  for (let i = 6; i >= 0; i--) {
    const key = shiftDays(today, -i);
    const [y, m, d] = key.split("-").map(Number);
    const label = "SMTWTFS"[new Date(y, m - 1, d).getDay()];
    days.push({ key, label, done: !!activity[key], isToday: i === 0 });
  }
  return days;
}
