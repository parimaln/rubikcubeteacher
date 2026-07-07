export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

/** One animated cube demo. Text in captions/paragraphs may wrap moves in backticks, e.g. "do `R U R'`". */
export interface StepCube {
  /** Moves to animate. Omit for a static solved cube. */
  alg?: string;
  /** State before the alg plays: a move sequence, or "inverse" to auto-derive from `alg`. */
  setup?: string | "inverse";
  /** Whole-cube rotation applied before the setup, e.g. "z2" to show yellow on top. */
  frame?: string;
  /** cubing.js stickering name to dim irrelevant pieces: "Cross", "F2L", "OLL", "PLL", ... */
  stickering?: string;
  /** Custom per-piece stickering mask (overrides stickering), see curriculum/masks.ts. */
  mask?: string;
  backView?: boolean;
  caption?: string;
}

export interface LessonStep {
  id: string;
  title: string;
  /** Paragraphs of kid-friendly text. Backtick-wrapped tokens render as move chips. */
  paragraphs: string[];
  /** Primary demo cube. */
  cube?: StepCube;
  /** Extra demo cases shown as a labelled row under the text. */
  moreCubes?: StepCube[];
  tips?: string[];
  /** "notation" renders the tap-a-move playground instead of a plain cube. */
  interactive?: "notation";
  quiz?: QuizQuestion[];
}

export interface Lesson {
  /** Globally unique slug used in URLs and progress keys. */
  id: string;
  emoji: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export interface Level {
  id: number;
  emoji: string;
  title: string;
  tagline: string;
  /** Tailwind gradient classes for the level card accent. */
  gradient: string;
  lessons: Lesson[];
}
