import type { Level } from "./types";
import { MASK_F2L_SLOT, MASK_OLL, MASK_PLL } from "./masks";

const F = "z2";
const SUNE = "R U R' U R U2 R'";
const ANTISUNE = "R U2 R' U' R U' R'";
const EDGE_OLL = "F R U R' U' F'";
const T_PERM = "R U R' U' R' F R2 U' R' U' R U R' F'";
const Y_PERM = "F R U' R' U' R U R' F' R U R' U' R' F R F'";
const UA_PERM = "R U' R U R U R U' R' U' R2";
const H_PERM = "M2 U M2 U2 M2 U M2";
const Z_PERM = "M' U M2 U M2 U M' U2 M2 U'";

const level3: Level = {
  id: 3,
  emoji: "🧠",
  title: "CFOP Foundations",
  tagline: "The method the world's fastest cubers use — starting now.",
  gradient: "from-violet-600 to-purple-500",
  lessons: [
    {
      id: "cfop-map",
      emoji: "🗺️",
      title: "The CFOP Map",
      description: "Four letters that take you from 2 minutes to 20 seconds.",
      steps: [
        {
          id: "what-is-cfop",
          title: "Meet CFOP",
          paragraphs: [
            "Every world-class speedcuber uses some version of CFOP (also called the Fridrich method). It stands for: Cross, F2L, OLL, PLL.",
            "CROSS you already know — the white cross, planned and solved on the bottom. F2L means 'First 2 Layers': instead of solving the bottom corners and then the middle edges separately, you pair a corner WITH its edge and insert them together — solving two layers in one step!",
            "OLL (Orient Last Layer) makes the whole top yellow in one go. PLL (Permute Last Layer) slides the top pieces to their final homes. Two steps for the last layer instead of four.",
            "Your beginner method had 8 stages. CFOP has 4. Fewer stages, fewer moves, faster solves.",
          ],
          quiz: [
            {
              question: "What does F2L solve?",
              options: [
                "Just the bottom corners",
                "The bottom AND middle layers together, in pairs",
                "The top layer",
                "Only the cross",
              ],
              answerIndex: 1,
              explanation:
                "Corner + edge = one pair. Four pairs = two layers done!",
            },
          ],
        },
      ],
    },
    {
      id: "f2l-pairs",
      emoji: "👫",
      title: "F2L: Think in Pairs",
      description: "Marry each corner to its edge, then drop them in together.",
      steps: [
        {
          id: "the-idea",
          title: "A corner and an edge, made for each other",
          paragraphs: [
            "Look at the front-right slot of your cube: it needs one white corner at the bottom and one middle edge above it — and their colors overlap. They're a COUPLE. F2L is about finding both pieces, joining them into a pair, and inserting the pair in one motion.",
            "Watch the simplest insert: the pair is already joined on top, and slides home in three moves.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "R U R'",
            mask: MASK_F2L_SLOT,
            caption:
              "A ready-made pair drops into its slot: `R U R'`. (Only the focus pair is in color.)",
          },
        },
        {
          id: "basic-insert",
          title: "The two basic inserts",
          paragraphs: [
            "Most F2L situations end in one of two ways. If the pair lines up on the RIGHT, insert with `U R U' R'`. If you've learned the middle-layer recipes from Level 1 — surprise! They were secretly F2L moves all along.",
            "Don't memorize 41 cases. Instead, PLAY: put a corner and its edge on top and experiment with how `R`, `U`, `R'` and `F'`, `U'`, `F` bring them together. Understanding beats memorizing at this stage.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "U R U' R'",
            mask: MASK_F2L_SLOT,
            caption: "Corner and edge meet at the top, then dive in: `U R U' R'`.",
          },
          moreCubes: [
            {
              frame: F,
              setup: "inverse",
              alg: "R U' R' U R U' R'",
              mask: MASK_F2L_SLOT,
              caption:
                "A split pair: first move sets them up, then the insert finishes.",
            },
          ],
          tips: [
            "Golden rule: joining a pair always happens on the TOP layer, where there's room to move.",
            "F2L feels SLOWER than your old method for the first week. Push through — it overtakes and never looks back.",
          ],
          quiz: [
            {
              question: "Where do you join a corner and edge into a pair?",
              options: [
                "In the bottom layer",
                "On the top layer, then insert together",
                "Inside the cube",
                "You don't — insert separately",
              ],
              answerIndex: 1,
              explanation:
                "The top layer is the workbench: build the pair there, then drop it in.",
            },
          ],
        },
      ],
    },
    {
      id: "two-look-oll",
      emoji: "🌕",
      title: "2-Look OLL",
      description: "Make the whole top yellow in two quick looks.",
      steps: [
        {
          id: "look-one",
          title: "Look 1: the yellow cross (you know this!)",
          paragraphs: [
            "OLL = make the entire top face yellow. We split it into two looks. Look 1 is your old friend: the yellow cross with `F R U R' U' F'` — dot, L, line, cross. Nothing new to learn!",
            "Now for Look 2: the corners. Instead of the slow righty-trick from Level 1, you'll orient ALL the corners at once with the Sune and its mirror twin.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: EDGE_OLL,
            mask: MASK_OLL,
            caption: "Look 1: yellow cross, exactly like Level 1.",
          },
        },
        {
          id: "sune-antisune",
          title: "Look 2: Sune and Antisune",
          paragraphs: [
            "Count the corners that already have yellow UP. Exactly ONE? You have a FISH. Spin the top until your cube matches one of the demos — pause each demo at the start and compare tops. Yellow corner at the FRONT-LEFT like the first demo? That's the Sune: `R U R' U R U2 R'`.",
            "Yellow corner at the BACK-RIGHT like the second demo? That's the mirror fish, the ANTISUNE: `R U2 R' U' R U' R'`. If your fish matches neither demo, spin the top a quarter turn and check again — one of them will line up.",
            "Zero or two corners up? Do a Sune from any angle — a fish appears. Every corner case falls to at most two Sunes. Seven patterns, one recipe family!",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: SUNE,
            mask: MASK_OLL,
            caption: "The Sune fish → `R U R' U R U2 R'` → all yellow!",
          },
          moreCubes: [
            {
              frame: F,
              setup: "inverse",
              alg: ANTISUNE,
              mask: MASK_OLL,
              caption:
                "Yellow corner at the back-right → Antisune: `R U2 R' U' R U' R'`.",
            },
          ],
          quiz: [
            {
              question:
                "One corner has yellow up and the rest don't. What's this called?",
              options: ["A dot", "A fish (Sune or Antisune case)", "Headlights", "A line"],
              answerIndex: 1,
              explanation:
                "One yellow corner up = fish. Aim it right and Sune (or Antisune) it!",
            },
          ],
        },
      ],
    },
    {
      id: "two-look-pll",
      emoji: "🔀",
      title: "2-Look PLL",
      description: "Corners first, then edges — and the cube is done.",
      steps: [
        {
          id: "corners-first",
          title: "Look 1: fix the corners (headlights!)",
          paragraphs: [
            "The top is all yellow — now slide pieces to their homes. Corners first. Spin the top and hunt for HEADLIGHTS: two corner stickers of the SAME color on the same side.",
            "Found headlights? Hold them on the LEFT. The two corners on the right need to swap — do the T-perm: `R U R' U' R' F R2 U' R' U' R U R' F'`.",
            "No headlights anywhere? The corners need a diagonal swap — use the Y-perm: `F R U' R' U' R U R' F' R U R' U' R' F R F'`. (All four sides will show headlights when the corners are right.)",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: T_PERM,
            mask: MASK_PLL,
            caption: "Headlights held on the LEFT → T-perm swaps the right corners.",
          },
          moreCubes: [
            {
              frame: F,
              setup: "inverse",
              alg: Y_PERM,
              mask: MASK_PLL,
              caption: "No headlights = diagonal swap → Y-perm.",
            },
          ],
        },
        {
          id: "edges-last",
          title: "Look 2: cycle the edges home",
          paragraphs: [
            "Corners done — only edges left. Find the side that's COMPLETELY solved (corner-edge-corner all matching) and hold it at the BACK.",
            "The three remaining edges need to cycle. Clockwise? `R U' R U R U R U' R' U' R2` (Ua-perm). Counter-clockwise? `R2 U R U R' U' R' U' R' U R'` (Ub-perm). Not sure which? Do one — if it's wrong, doing it once more fixes everything.",
            "No solved side at all? Two edge pairs need swapping: opposite pairs → H-perm `M2 U M2 U2 M2 U M2`; neighbor pairs → Z-perm `M' U M2 U M2 U M' U2 M2 U'`. (The `M` means the MIDDLE slice — turn it the same direction as an `L` turn.)",
            "Then spin the top into place... and the cube is SOLVED. That's a full CFOP solve!",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: UA_PERM,
            mask: MASK_PLL,
            caption: "Solved side at the back → U-perm cycles the last three edges.",
          },
          moreCubes: [
            {
              frame: F,
              setup: "inverse",
              alg: H_PERM,
              mask: MASK_PLL,
              caption: "H-perm: both opposite pairs trade places.",
            },
            {
              frame: F,
              setup: "inverse",
              alg: Z_PERM,
              mask: MASK_PLL,
              caption: "Z-perm: neighboring pairs trade places.",
            },
          ],
          quiz: [
            {
              question: "In 2-look PLL, what do you fix first?",
              options: ["Edges", "Corners", "Centers", "Whatever you like"],
              answerIndex: 1,
              explanation:
                "Corners first (T or Y perm), then cycle the edges (U, H or Z perm).",
            },
            {
              question: "You see headlights. Where do you hold them?",
              options: ["On the right", "On the left", "Facing you", "On the bottom"],
              answerIndex: 1,
              explanation:
                "Headlights on the LEFT — then the T-perm swaps the two right corners.",
            },
          ],
        },
      ],
    },
  ],
};

export default level3;
