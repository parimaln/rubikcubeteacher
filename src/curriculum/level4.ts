import type { Level } from "./types";
import { MASK_F2L_SLOT, MASK_OLL, MASK_PLL } from "./masks";

const F = "z2";

const level4: Level = {
  id: 4,
  emoji: "📚",
  title: "Full CFOP",
  tagline: "The complete algorithm arsenal: full PLL, full OLL, pro F2L.",
  gradient: "from-rose-500 to-pink-500",
  lessons: [
    {
      id: "full-pll",
      emoji: "📗",
      title: "Full PLL: 21 Cases",
      description: "One look, one algorithm, last layer done.",
      steps: [
        {
          id: "why-full-pll",
          title: "From 2 looks to 1",
          paragraphs: [
            "With 2-look PLL you fix corners, then edges — two algorithms every solve. Full PLL solves BOTH at once: you learn to recognize all 21 possible last-layer arrangements and fire the exact algorithm for each. That saves 2–4 seconds every single solve.",
            "You already know six of them! T, Y, Ua, Ub, H and Z from Level 3. Only 15 to go — and you don't need them all at once.",
            "Head to the Algorithms page (📖 in the menu) to browse all 21 with animations.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "x R' U R' D2 R U' R' D2 R2 x'",
            mask: MASK_PLL,
            caption:
              "The Aa-perm: three corners cycle in one smooth algorithm. (`x` means tilt the whole cube.)",
          },
        },
        {
          id: "learning-order",
          title: "The smart learning order",
          paragraphs: [
            "Learn PLL in bites, mastering each before the next: 1️⃣ U-perms, H, Z (done!). 2️⃣ Ja, Jb, T, F — corner+edge swaps. 3️⃣ Aa, Ab, E — corner-only cases. 4️⃣ Ra, Rb, V, Y, Na, Nb. 5️⃣ The G-perms (Ga, Gb, Gc, Gd) — everyone saves these for last!",
            "For each new algorithm: (1) do it slowly 10 times reading the letters, (2) do it 20 times from muscle memory, (3) practice FINDING the case: scramble just the top with a different algorithm and recognize it fast.",
            "Use the flashcard Trainer on the Algorithms page to drill recognition!",
          ],
          quiz: [
            {
              question: "How many PLL cases are there in total?",
              options: ["7", "21", "57", "100"],
              answerIndex: 1,
              explanation:
                "21 ways the last layer can be arranged once it's all yellow on top — one algorithm each.",
            },
          ],
        },
      ],
    },
    {
      id: "full-oll",
      emoji: "📙",
      title: "Full OLL: 57 Shapes",
      description: "Recognize the shape, fire the algorithm.",
      steps: [
        {
          id: "shape-thinking",
          title: "Think in shapes",
          paragraphs: [
            "Full OLL has 57 cases — sounds scary, but they organize into SHAPE FAMILIES by what the yellow stickers on top look like: Cross shapes (edges done, corners left — your 7 friends from 2-look), L-shapes, Lines, and Dots.",
            "Strategy: 2-look OLL already solves EVERYTHING. Full OLL is an upgrade you install case by case: each new algorithm you learn replaces a two-step solution with a one-step one. Learn the cases you see most often first — the Cross family, then T-shapes and Lines.",
            "The Algorithms page has all 57, grouped by shape, each with an animation.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "R U R' U' R' F R F'",
            mask: MASK_OLL,
            caption:
              "A T-shape: `R U R' U' R' F R F'` orients everything at once.",
          },
          quiz: [
            {
              question: "What makes full OLL better than 2-look OLL?",
              options: [
                "It's the only way to solve the top",
                "One algorithm instead of two — a few seconds saved every solve",
                "It skips PLL",
                "It looks cooler",
              ],
              answerIndex: 1,
              explanation:
                "Same result, half the steps. And you can learn it gradually — 2-look always has your back.",
            },
          ],
        },
      ],
    },
    {
      id: "pro-f2l",
      emoji: "🧩",
      title: "Pro F2L",
      description: "Smooth pairs, no cube rotations, eyes ahead.",
      steps: [
        {
          id: "no-rotations",
          title: "Stop rotating the cube",
          paragraphs: [
            "Every time you rotate the whole cube during F2L, you lose time AND lose track of what you saw. Pros solve pairs into ALL four slots from one grip, using both hands: right-side inserts with `R U R'` family, left-side with `L' U' L` family.",
            "Learn the back-slot inserts too — inserting into the back-right with `R' U R`-style moves means never spinning the cube to bring a slot to the front.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "U R U' R'",
            mask: MASK_F2L_SLOT,
            caption: "Same insert, zero rotations — your grip never changes.",
          },
        },
        {
          id: "f2l-lookahead",
          title: "Track the next pair",
          paragraphs: [
            "The real F2L skill: while your hands insert THIS pair, your eyes lock onto the pieces of the NEXT pair. Never watch your own insert — you already know how it ends!",
            "Drill: do slow solves where your rule is 'hands never stop'. Speed comes from the absence of pauses, not from fast turning. Most cubers' times drop 30% when they stop pausing between pairs.",
            "Also: learn to use an EMPTY slot as working space — some pairs solve in 3 moves through an open slot that would take 8 moves otherwise.",
          ],
          quiz: [
            {
              question: "During an F2L insert, where should your eyes be?",
              options: [
                "On the pair you're inserting",
                "Hunting for the next pair's pieces",
                "On the timer",
                "Closed, for focus",
              ],
              answerIndex: 1,
              explanation:
                "Your hands know the insert. Your eyes belong to the future!",
            },
          ],
        },
      ],
    },
  ],
};

export default level4;
