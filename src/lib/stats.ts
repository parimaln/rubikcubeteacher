import type { Solve } from "../store/progress";

export function bestMs(solves: Solve[]): number | null {
  if (solves.length === 0) return null;
  return Math.min(...solves.map((s) => s.ms));
}

/**
 * WCA-style average of the last N solves: drop the single best and worst,
 * average the rest. Returns null until there are N solves.
 */
export function averageOfN(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null;
  const window = solves.slice(-n).map((s) => s.ms);
  window.sort((a, b) => a - b);
  const middle = window.slice(1, -1);
  return middle.reduce((a, b) => a + b, 0) / middle.length;
}

export function meanMs(solves: Solve[]): number | null {
  if (solves.length === 0) return null;
  return solves.reduce((a, s) => a + s.ms, 0) / solves.length;
}
