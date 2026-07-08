/**
 * Real-cube practice challenges for each level. Kids do these away from the
 * screen with a physical cube and tap "I did it!" for every repetition —
 * the goal is confident, repeated practice of one skill at a time.
 */
export interface Challenge {
  /** Globally unique id used as the progress key. */
  id: string;
  levelId: number;
  emoji: string;
  title: string;
  /** Kid-friendly task. Backtick-wrapped tokens render as move chips. */
  description: string;
  /** How many repetitions it takes to complete the challenge. */
  reps: number;
}

export const challenges: Challenge[] = [
  // Level 0 — Meet Your Cube
  {
    id: "piece-detective",
    levelId: 0,
    emoji: "🕵️",
    title: "Piece Detective",
    description:
      "On your real cube, point to every center, then find 3 edges and 3 corners. Say which is which out loud!",
    reps: 2,
  },
  {
    id: "sexy-circle",
    levelId: 0,
    emoji: "🔄",
    title: "The Magic Circle",
    description:
      "Start from a solved cube and do `R U R' U'` six times in a row. Magic — it comes back solved! Try the whole circle.",
    reps: 3,
  },
  {
    id: "notation-reader",
    levelId: 0,
    emoji: "📜",
    title: "Notation Reader",
    description:
      "Have someone write down 5 random moves (like `F2 U' L R' D`). Do them on your cube without any hints.",
    reps: 3,
  },
  {
    id: "teach-a-friend",
    levelId: 0,
    emoji: "🗣️",
    title: "Little Professor",
    description:
      "Teach someone at home why the centers never move and how to read `R'` vs `R`. Teaching = mastering!",
    reps: 1,
  },

  // Level 1 — Solve the Cube
  {
    id: "daisy-gardener-x3",
    levelId: 1,
    emoji: "🌼",
    title: "Daisy Sprint",
    description:
      "Scramble your cube and make the daisy all by yourself. No peeking at the lesson!",
    reps: 3,
  },
  {
    id: "cross-builder-x3",
    levelId: 1,
    emoji: "➕",
    title: "Cross Builder",
    description:
      "Scramble, make the daisy, then turn it into a perfect white cross with matching side colors.",
    reps: 3,
  },
  {
    id: "white-layer-x3",
    levelId: 1,
    emoji: "🧱",
    title: "First Layer Finisher",
    description:
      "Solve the whole white layer — cross AND all four corners — from a fresh scramble.",
    reps: 3,
  },
  {
    id: "two-layers-x3",
    levelId: 1,
    emoji: "🥪",
    title: "Two-Layer Titan",
    description:
      "Solve the first two layers from a scramble. The bottom two-thirds of the cube, done!",
    reps: 3,
  },
  {
    id: "full-solve-x1",
    levelId: 1,
    emoji: "🏆",
    title: "The Big One",
    description:
      "Solve the ENTIRE cube from a scramble, all by yourself. You're officially a cube solver!",
    reps: 1,
  },
  {
    id: "full-solve-x5",
    levelId: 1,
    emoji: "🖐️",
    title: "High Five",
    description:
      "Solve the whole cube 5 times. Each solve makes your hands remember the moves better.",
    reps: 5,
  },

  // Level 2 — Getting Faster
  {
    id: "sexy-speed",
    levelId: 2,
    emoji: "🫰",
    title: "Finger Trick Drill",
    description:
      "Do `R U R' U'` six times fast using finger tricks — no re-gripping the cube. Smooth like butter!",
    reps: 3,
  },
  {
    id: "direct-cross",
    levelId: 2,
    emoji: "🎯",
    title: "No-Daisy Cross",
    description:
      "Make the white cross directly on the bottom — skip the daisy completely.",
    reps: 5,
  },
  {
    id: "cross-sprint",
    levelId: 2,
    emoji: "⏱️",
    title: "25-Second Cross",
    description:
      "Use the Timer page: scramble and make the cross in under 25 seconds.",
    reps: 3,
  },
  {
    id: "no-pause-solve",
    levelId: 2,
    emoji: "🌊",
    title: "Flow Solve",
    description:
      "Do a full solve where you never stop turning for more than 3 seconds. Keep your eyes one step ahead!",
    reps: 2,
  },

  // Level 3 — CFOP Foundations
  {
    id: "f2l-pairs-5",
    levelId: 3,
    emoji: "👫",
    title: "Pair Maker",
    description:
      "Solve 5 F2L pairs the CFOP way — pair the corner and edge up top, then insert them together.",
    reps: 5,
  },
  {
    id: "two-look-oll-drill",
    levelId: 3,
    emoji: "💛",
    title: "Yellow Face Fixer",
    description:
      "Finish a solve using 2-look OLL: yellow cross first, then Sune or Anti-Sune to finish the yellow face.",
    reps: 3,
  },
  {
    id: "two-look-pll-drill",
    levelId: 3,
    emoji: "🔀",
    title: "Last Layer Shuffler",
    description:
      "Finish a solve using 2-look PLL: corners first, then edges. No beginner method allowed!",
    reps: 3,
  },
  {
    id: "full-cfop-solve",
    levelId: 3,
    emoji: "🧙",
    title: "Full CFOP Solve",
    description:
      "Do one complete solve with CFOP: Cross → F2L pairs → 2-look OLL → 2-look PLL.",
    reps: 2,
  },

  // Level 4 — Full CFOP
  {
    id: "pll-from-memory",
    levelId: 4,
    emoji: "🧠",
    title: "Memory Master",
    description:
      "Perform the T-perm, Ua-perm and Y-perm from memory — no looking at the algorithm library.",
    reps: 3,
  },
  {
    id: "oll-shape-spotter",
    levelId: 4,
    emoji: "👀",
    title: "Shape Spotter",
    description:
      "After finishing F2L, name the OLL shape on top (fish? lightning? T?) in under 3 seconds, then solve it.",
    reps: 5,
  },
  {
    id: "no-rotation-f2l",
    levelId: 4,
    emoji: "🧊",
    title: "Steady Cube",
    description:
      "Solve all four F2L pairs without rotating the whole cube — use front and back tricks instead.",
    reps: 2,
  },
  {
    id: "flashcard-session",
    levelId: 4,
    emoji: "🃏",
    title: "Flashcard Champion",
    description:
      "Do a round in the Algorithms flashcard trainer and get every card right.",
    reps: 3,
  },

  // Level 5 — Speed Training
  {
    id: "ao5-session",
    levelId: 5,
    emoji: "📊",
    title: "Average Hunter",
    description:
      "Do 5 timed solves in a row on the Timer page to earn an ao5. Consistency beats one lucky solve!",
    reps: 3,
  },
  {
    id: "inspection-pro",
    levelId: 5,
    emoji: "🔬",
    title: "Inspection Pro",
    description:
      "Turn on 15s inspection, plan your whole cross before starting, then solve the cross with no pauses.",
    reps: 3,
  },
  {
    id: "mock-competition",
    levelId: 5,
    emoji: "🏟️",
    title: "Mock Competition",
    description:
      "Hold your own competition: 5 timed solves with inspection, WCA style. Drop the best and worst — that's your official average!",
    reps: 2,
  },
  {
    id: "new-pb",
    levelId: 5,
    emoji: "🚀",
    title: "Record Breaker",
    description: "Beat your personal best time on the Timer page.",
    reps: 1,
  },
];

export function challengesForLevel(levelId: number): Challenge[] {
  return challenges.filter((c) => c.levelId === levelId);
}
