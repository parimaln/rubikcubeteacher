const FACES = ["U", "D", "L", "R", "F", "B"] as const;
const AXIS: Record<string, number> = { U: 0, D: 0, L: 1, R: 1, F: 2, B: 2 };
const SUFFIXES = ["", "'", "2"] as const;

/**
 * Random-move scramble: 20 moves, never the same face twice in a row, never
 * three moves on the same axis in a row. Plenty random for practice timing.
 */
export function generateScramble(length = 20): string {
  const moves: string[] = [];
  let prevFace = "";
  let prevPrevFace = "";
  while (moves.length < length) {
    const face = FACES[Math.floor(Math.random() * FACES.length)];
    if (face === prevFace) continue;
    if (
      prevPrevFace &&
      AXIS[face] === AXIS[prevFace] &&
      AXIS[face] === AXIS[prevPrevFace]
    ) {
      continue;
    }
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    moves.push(face + suffix);
    prevPrevFace = prevFace;
    prevFace = face;
  }
  return moves.join(" ");
}
