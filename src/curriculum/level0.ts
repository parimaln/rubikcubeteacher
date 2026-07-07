import type { Level } from "./types";

const level0: Level = {
  id: 0,
  emoji: "🧊",
  title: "Meet Your Cube",
  tagline: "Learn the cube's parts and its secret move language.",
  gradient: "from-sky-500 to-cyan-400",
  lessons: [
    {
      id: "cube-anatomy",
      emoji: "🔍",
      title: "Cube Anatomy",
      description: "Centers, edges, and corners — what the cube is made of.",
      steps: [
        {
          id: "welcome",
          title: "Welcome to Cube Academy! 🎉",
          paragraphs: [
            "You're about to learn a real superpower: solving the Rubik's Cube. Thousands of kids your age can do it — and by the end of these lessons, you will too.",
            "Here's the secret nobody tells you: you don't solve the cube color by color. You solve it layer by layer, using a few move recipes called algorithms. Learn the recipes, and the cube obeys you every single time.",
            "Grab your cube and let's start by getting to know it. You can spin the 3D cube on this screen with your mouse or finger — try it!",
          ],
          cube: {
            caption: "Drag me around to look at all my sides!",
          },
        },
        {
          id: "centers",
          title: "Centers never move",
          paragraphs: [
            "Look at the middle sticker of each side. That's a center. Here's the most important fact about the whole cube: centers NEVER move away from each other. White is always opposite yellow, blue opposite green, and red opposite orange.",
            "That means the center tells you what color that whole side must become. If the center is green, that side will be the green side when the cube is solved. Always.",
            "Watch the cube scramble itself — and keep your eye on the six centers. They spin in place, but they never trade spots!",
          ],
          cube: {
            alg: "R U F2 L' D B R2 U2 F D' L U",
            caption: "Press play and watch: the centers stay home!",
          },
          tips: [
            "When you're lost, find a center. It tells you which side you're looking at.",
          ],
        },
        {
          id: "edges-corners",
          title: "Edges and corners",
          paragraphs: [
            "Besides the 6 centers, the cube has two kinds of pieces. Edges have exactly 2 stickers — there are 12 of them. Corners have exactly 3 stickers — there are 8 of them.",
            "This changes how you should see the cube: don't think 'I need to move this sticker.' Think 'I need to move this PIECE.' A piece's stickers always stay glued together — the white-and-red edge is always white-and-red, no matter where it travels.",
            "There is exactly one piece for every color combination. One white-red edge. One white-red-blue corner. Detective tip: if you know the colors you need, you can always hunt down the exact piece!",
          ],
          cube: {
            alg: "R U R' U'",
            caption:
              "Watch the corner and edge pieces travel — stickers stay glued together.",
          },
          quiz: [
            {
              question: "How many stickers does a corner piece have?",
              options: ["1", "2", "3", "4"],
              answerIndex: 2,
              explanation: "Corners live where 3 sides meet, so they show 3 stickers.",
            },
            {
              question: "Which piece can NEVER move to a different spot?",
              options: ["Edges", "Centers", "Corners", "They all move"],
              answerIndex: 1,
              explanation: "Centers only spin in place — they are the cube's skeleton.",
            },
          ],
        },
        {
          id: "solved-goal",
          title: "What 'solved' really means",
          paragraphs: [
            "A solved cube isn't just 'each side is one color.' It means every single piece is back in its home spot: every edge sits between its two matching centers, and every corner sits between its three matching centers.",
            "We'll rebuild the cube in layers, like a cake: first the bottom layer, then the middle layer, then the top layer. That's the plan for Level 1!",
          ],
          cube: {
            caption: "Home sweet home: every piece between its matching centers.",
          },
          quiz: [
            {
              question:
                "The white-blue edge piece belongs between which two centers?",
              options: [
                "The white and blue centers",
                "Any two centers",
                "The yellow and green centers",
                "Wherever there is space",
              ],
              answerIndex: 0,
              explanation:
                "Every piece has exactly one home: between the centers that match its stickers.",
            },
          ],
        },
      ],
    },
    {
      id: "notation",
      emoji: "🥷",
      title: "The Secret Code",
      description: "Read and speak cube notation: R, U, F and friends.",
      steps: [
        {
          id: "why-notation",
          title: "Why cubers use a secret code",
          paragraphs: [
            "To share move recipes, cubers invented a code. Each letter names one side of the cube: `R` is the Right side, `L` is Left, `U` is Up (the top), `D` is Down (the bottom), `F` is Front (facing you), and `B` is Back.",
            "A letter by itself means: turn that side clockwise — as if you were looking straight at that side. So `R` means 'turn the right side up-and-away from you.'",
            "Watch the cube do each basic move.",
          ],
          cube: {
            alg: "R L U D F B",
            caption: "One turn of each side: R, L, U, D, F, B.",
          },
        },
        {
          id: "primes-doubles",
          title: "Primes and doubles",
          paragraphs: [
            "Two little marks finish the code. An apostrophe like `R'` (say 'R prime') means turn that side COUNTER-clockwise — the opposite way. A 2 like `R2` means turn that side twice (a half turn — either direction, it lands the same).",
            "So `R U R' U'` reads: right up, top left, right down, top right. That little dance is so famous it has a nickname — the 'sexy move.' You'll use it a LOT in Level 1.",
          ],
          cube: {
            alg: "R R' R2 U U' U2",
            caption: "R, then R', then R2 — then the same for U.",
          },
          tips: [
            "Clockwise means: imagine turning that face like a clock WHILE LOOKING AT IT. For the back or bottom, that can feel backwards — trust the rule!",
          ],
        },
        {
          id: "playground",
          title: "Try the code yourself!",
          paragraphs: [
            "Time to practice! Tap the buttons and watch the cube obey. Pick 'Prime ↺' or 'Double ×2' to change the turn type.",
            "Challenge: can you do the sexy move? Press `R`, `U`, then switch to Prime and press `R'`, `U'`. Do it 6 times in a row and the cube returns exactly to where it started — magic!",
          ],
          interactive: "notation",
        },
        {
          id: "notation-quiz",
          title: "Code check! 🕵️",
          paragraphs: [
            "Before Level 1 unlocks, show the code who's boss. You can go back to the playground anytime to double-check.",
          ],
          quiz: [
            {
              question: "What does `U'` mean?",
              options: [
                "Turn the top clockwise",
                "Turn the top counter-clockwise",
                "Turn the bottom twice",
                "Turn the right side up",
              ],
              answerIndex: 1,
              explanation: "The prime mark ' always means counter-clockwise.",
            },
            {
              question: "What does `F2` mean?",
              options: [
                "Turn the front twice (half turn)",
                "Turn the front gently",
                "Turn two different faces",
                "Turn the front counter-clockwise",
              ],
              answerIndex: 0,
              explanation: "A 2 means a half turn — two quarter turns of that face.",
            },
            {
              question: "Which side does `D` name?",
              options: ["The dark side", "The down (bottom) side", "The diagonal", "The front"],
              answerIndex: 1,
              explanation: "D is Down — the bottom of the cube.",
            },
          ],
        },
      ],
    },
  ],
};

export default level0;
