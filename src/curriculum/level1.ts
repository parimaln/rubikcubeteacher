import type { Level } from "./types";
import {
  MASK_DAISY,
  MASK_CROSS,
  MASK_WHITE_CORNERS,
  MASK_MIDDLE,
  MASK_YELLOW_CROSS,
  MASK_LL_EDGES,
  MASK_LL_CORNERS_POS,
  MASK_LL_CORNERS_ORI,
} from "./masks";

// All Level 1 demos use the teaching frame z2: YELLOW center up, white down.
// Gray pieces in the demos are pieces we don't care about yet.
const F = "z2";

const SEXY = "R U R' U'";
const SUNE = "R U R' U R U2 R'";
const CORNER_CYCLE = "U R U' L' U R' U' L";
const CROSS_ALG = "F R U R' U' F'";
const RIGHTY = "R' D' R D";

const level1: Level = {
  id: 1,
  emoji: "🎂",
  title: "Solve the Cube",
  tagline: "The beginner method: build the cube layer by layer, like a cake.",
  gradient: "from-green-500 to-emerald-400",
  lessons: [
    {
      id: "daisy",
      emoji: "🌼",
      title: "The Daisy",
      description: "Four white petals around the yellow center.",
      steps: [
        {
          id: "goal",
          title: "Your first mission: grow a daisy",
          paragraphs: [
            "Hold your cube with the YELLOW center on top. Keep it that way for the whole solve — yellow stays up, white stays down. That's the golden rule of this method.",
            "Mission: bring the four white EDGE pieces (2 stickers each — ignore corners!) up to the top, around the yellow center, with their white stickers pointing UP. It looks like a flower: yellow middle, four white petals. That's the daisy!",
            "It doesn't matter yet which petal goes where. Just get all four up there.",
          ],
          cube: {
            frame: F,
            setup: "F2 B2 R2 L2",
            mask: MASK_DAISY,
            caption:
              "The daisy: yellow center up, four white petals around it. (Gray = ignore for now.)",
          },
          tips: [
            "Edges have 2 stickers, corners have 3. The daisy only uses EDGES.",
          ],
        },
        {
          id: "petal-from-bottom",
          title: "Petal hunt: white edge at the bottom",
          paragraphs: [
            "Spin the bottom layer until your white edge sits below an EMPTY petal spot. If its white sticker points straight DOWN, just turn that face TWICE — the petal pops up to the top.",
            "Watch the demo: three petals are already home, and the last white edge is at the bottom, pointing down. One double turn finishes the daisy.",
          ],
          cube: {
            frame: F,
            setup: "B2 R2 L2",
            alg: "F2",
            mask: MASK_DAISY,
            caption: "White edge pointing down → turn that face twice: `F2`.",
          },
        },
        {
          id: "petal-from-side",
          title: "Petal hunt: white edge in the middle",
          paragraphs: [
            "If a white edge is in the middle layer (its white sticker points sideways), turn that side so the white sticker travels UP to the top.",
            "One thing to watch: don't knock an existing petal off! If the spot where your petal will land is already taken, first spin the TOP layer to park an empty spot there.",
            "In this demo, the white edge hides in the middle layer on the right side of the front. One turn lifts it into the last empty petal spot.",
          ],
          cube: {
            frame: F,
            setup: "B2 R2 L2 F'",
            alg: "F'",
            mask: MASK_DAISY,
            caption: "White edge in the middle → turn it up to an empty spot.",
          },
          tips: [
            "White edge on TOP but with white pointing sideways? Push it down into the middle layer with one turn, then bring it up the right way.",
            "There are exactly 4 white edges. Count your petals: got 4? Daisy done!",
          ],
          quiz: [
            {
              question: "Where does the daisy get built?",
              options: [
                "Around the yellow center (top)",
                "Around the white center",
                "On the front side",
                "Anywhere",
              ],
              answerIndex: 0,
              explanation:
                "Petals go around the YELLOW center — that way each one is a half-turn away from home.",
            },
            {
              question: "Which pieces make the daisy petals?",
              options: [
                "White corners",
                "White edges",
                "Yellow edges",
                "Any white pieces",
              ],
              answerIndex: 1,
              explanation: "Only the four white EDGES (2-sticker pieces).",
            },
          ],
        },
      ],
    },
    {
      id: "white-cross",
      emoji: "➕",
      title: "The White Cross",
      description: "Send each petal down to make a perfect white cross.",
      steps: [
        {
          id: "match-and-drop",
          title: "Match, then drop!",
          paragraphs: [
            "Every petal has a second sticker on its side. Here's the move: spin the TOP layer until one petal's side sticker matches the center right below it — green on green, red on red...",
            "When it matches, turn that face TWICE. The petal dives down to the bottom, landing exactly in its home. That's one arm of your white cross!",
            "Repeat for all four petals: match, drop. Match, drop.",
          ],
          cube: {
            frame: F,
            setup: "F2 B2 R2 L2 U",
            alg: "U' F2 R2 B2 L2",
            mask: MASK_CROSS,
            caption:
              "Spin the top to match a petal's side color with its center — then a double turn drops it home.",
          },
        },
        {
          id: "check-cross",
          title: "Check your cross",
          paragraphs: [
            "Flip your cube over for a second and look at the white side. You should see a white plus sign — AND each cross piece's side color should match the center next to it, all the way around.",
            "If a side color doesn't match its center, that petal went down in the wrong spot. No problem: turn that face twice to send it back up, match it properly, and drop it again.",
            "Then flip back: yellow up, white down. Onward!",
          ],
          cube: {
            frame: F,
            setup: "",
            mask: MASK_CROSS,
            caption:
              "A REAL cross: white plus on the bottom, side colors matching their centers.",
          },
          quiz: [
            {
              question:
                "A petal's side sticker is green. Where should you drop it?",
              options: [
                "Above the green center",
                "Above any center",
                "Above the blue center",
                "It doesn't matter",
              ],
              answerIndex: 0,
              explanation:
                "Match the side color to its center first — THEN turn twice to drop it.",
            },
          ],
        },
      ],
    },
    {
      id: "white-corners",
      emoji: "🧱",
      title: "White Corners",
      description: "Finish the whole bottom layer with one repeated trick.",
      steps: [
        {
          id: "find-home",
          title: "Every corner has exactly one home",
          paragraphs: [
            "Time to add the four white CORNERS to the bottom layer. A corner has 3 stickers — say white, green and orange. Its home is exactly where those three colors meet: between the green center, the orange center, and the white bottom.",
            "Find a white corner in the TOP layer. Look at its two non-white colors. Now spin the TOP layer to carry it right ABOVE its home, then hold the cube so that corner is at the FRONT-RIGHT.",
          ],
          cube: {
            frame: F,
            setup: "R U R' U' R U R' U' R U R' U'",
            mask: MASK_WHITE_CORNERS,
            caption:
              "This white corner is parked at the top front-right, directly above its home.",
          },
        },
        {
          id: "sexy-insert",
          title: "The magic trick: repeat `R U R' U'`",
          paragraphs: [
            "Remember the sexy move from Level 0? `R U R' U'` — right up, top left, right down, top right. Here's the magic: with the corner parked above its home at the front-right, just REPEAT the sexy move until the corner drops in with white facing DOWN.",
            "Sometimes it takes 1 round. Sometimes 3. Sometimes 5. Keep going — it always works, and it never breaks your white cross.",
            "Watch this corner need three rounds:",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: `${SEXY} ${SEXY} ${SEXY}`,
            mask: MASK_WHITE_CORNERS,
            caption: "`R U R' U'` three times — the corner clicks into place.",
          },
          moreCubes: [
            {
              frame: F,
              setup: "inverse",
              alg: SEXY,
              mask: MASK_WHITE_CORNERS,
              caption: "This one only needs ONE round. Lucky!",
            },
            {
              frame: F,
              setup: "inverse",
              alg: `${SEXY} ${SEXY} ${SEXY} ${SEXY} ${SEXY}`,
              mask: MASK_WHITE_CORNERS,
              caption: "And this stubborn one needs five. Just keep going!",
            },
          ],
          tips: [
            "White corner already at the bottom but in the WRONG spot or twisted? Hold it at the front-right and do ONE sexy move — it pops up to the top. Then park it properly and insert it again.",
            "Do all 4 corners. When you're done, the whole bottom layer is solid white with matching sides!",
          ],
          quiz: [
            {
              question:
                "Where do you park a white corner before repeating `R U R' U'`?",
              options: [
                "In the top layer, directly above its home, at the front-right",
                "Anywhere in the top layer",
                "In the bottom layer",
                "At the back-left",
              ],
              answerIndex: 0,
              explanation:
                "Above its home, held at the front-right — then repeat the trick until it drops in.",
            },
            {
              question: "The sexy move trick stops when...",
              options: [
                "You've done it exactly twice",
                "The corner is in its home with white facing down",
                "The top layer is all yellow",
                "Your fingers hurt",
              ],
              answerIndex: 1,
              explanation:
                "Repeat until the corner sits in its home, white side down. 1, 3, or 5 rounds — it varies.",
            },
          ],
        },
      ],
    },
    {
      id: "middle-layer",
      emoji: "🥪",
      title: "The Middle Layer",
      description: "Two mirror recipes finish two thirds of the cube.",
      steps: [
        {
          id: "find-edge",
          title: "Find a yellow-free edge on top",
          paragraphs: [
            "The bottom layer is done — now the middle. The middle layer needs 4 edges, and none of them contain yellow. So look at the TOP layer and find an edge with NO yellow sticker on it.",
            "Spin the TOP until that edge's side sticker matches the center it's touching — you'll see a little upside-down T of matching color. Hold the cube so that matching side faces YOU.",
            "Now peek at the edge's TOP sticker. Does it match the center on your RIGHT, or on your LEFT? That decides the recipe.",
          ],
          cube: {
            frame: F,
            setup: "F' U' F U R U R' U'",
            mask: MASK_MIDDLE,
            caption:
              "This edge's front sticker matches the front center. Its top sticker points to a side — right or left?",
          },
        },
        {
          id: "insert-right",
          title: "Recipe 1: send it RIGHT",
          paragraphs: [
            "Top sticker matches the RIGHT center? Use: `U R U' R' U' F' U F`.",
            "Think of it as two halves: `U R U' R'` nudges the edge away and unhooks the corner, then `U' F' U F` tucks them both back in — with the edge sliding into the right-hand slot.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "U R U' R' U' F' U F",
            mask: MASK_MIDDLE,
            caption: "`U R U' R' U' F' U F` — edge slides into the right slot.",
          },
        },
        {
          id: "insert-left",
          title: "Recipe 2: send it LEFT",
          paragraphs: [
            "Top sticker matches the LEFT center? Use the mirror recipe: `U' L' U L U F U' F'`.",
            "It's the same dance with the left hand: away, unhook, tuck back in.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "U' L' U L U F U' F'",
            mask: MASK_MIDDLE,
            caption: "`U' L' U L U F U' F'` — edge slides into the left slot.",
          },
          tips: [
            "No yellow-free edges on top, but a middle edge sits in the wrong slot (or flipped)? Insert ANY top edge into that slot — the stuck one pops out. Then place it properly.",
            "Do all 4 middle edges. Two layers down, one to go!",
          ],
          quiz: [
            {
              question:
                "Which top-layer edges belong in the middle layer?",
              options: [
                "Edges with a yellow sticker",
                "Edges with NO yellow sticker",
                "All of them",
                "Edges with white stickers",
              ],
              answerIndex: 1,
              explanation:
                "The middle layer has no yellow — so yellow-free edges are the ones you need.",
            },
            {
              question:
                "The edge's top sticker matches the RIGHT center. Which recipe?",
              options: [
                "`U R U' R' U' F' U F`",
                "`U' L' U L U F U' F'`",
                "`R U R' U'` six times",
                "`F2`",
              ],
              answerIndex: 0,
              explanation: "Top sticker points right → send it right.",
            },
          ],
        },
      ],
    },
    {
      id: "yellow-cross",
      emoji: "✳️",
      title: "The Yellow Cross",
      description: "One recipe, repeated smartly: dot → L → line → cross.",
      steps: [
        {
          id: "read-the-top",
          title: "Read the top of your cube",
          paragraphs: [
            "Look at the top face and only count the yellow EDGES pointing up (ignore corners!). You'll see one of four pictures: a lonely DOT, an L-shape, a straight LINE, or the full CROSS.",
            "One recipe handles them all: `F R U R' U' F'`. The only skill is HOLDING the cube right before each go.",
            "LINE: hold it flat (left-to-right), do the recipe once → cross done!",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: CROSS_ALG,
            mask: MASK_YELLOW_CROSS,
            caption: "LINE (flat) → `F R U R' U' F'` → yellow cross!",
          },
        },
        {
          id: "l-shape",
          title: "The L-shape",
          paragraphs: [
            "Got an L? Spin the top until the two yellow edges point to the BACK and to the LEFT (the L hugs the top-left corner). Now do the recipe TWICE in a row — done.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: `${CROSS_ALG} ${CROSS_ALG}`,
            mask: MASK_YELLOW_CROSS,
            caption: "L pointing back-left → recipe twice → cross!",
          },
        },
        {
          id: "dot",
          title: "The dot",
          paragraphs: [
            "Only the yellow center showing? That's the dot — the longest road, but easy: do the recipe once, and an L or line appears. Hold it correctly (L to the back-left, or line flat) and keep going.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: `${CROSS_ALG} U2 ${CROSS_ALG} ${CROSS_ALG}`,
            mask: MASK_YELLOW_CROSS,
            caption: "Dot → recipe → hold right → recipe again... → cross!",
          },
          quiz: [
            {
              question: "You see an L-shape on top. Before the recipe, you...",
              options: [
                "Spin the top so the L points back-and-left",
                "Flip the cube over",
                "Point the L at yourself",
                "Do nothing special",
              ],
              answerIndex: 0,
              explanation:
                "L hugs the top-LEFT (petals to the back and left) — then recipe twice.",
            },
          ],
        },
      ],
    },
    {
      id: "yellow-edges",
      emoji: "🧭",
      title: "Match the Yellow Edges",
      description: "Slide the cross edges around until every side matches.",
      steps: [
        {
          id: "match-one",
          title: "Match one edge, then Sune!",
          paragraphs: [
            "Your yellow cross is up — but the cross edges' SIDE colors probably don't match their centers yet. Let's fix that with a famous recipe called the SUNE: `R U R' U R U2 R'`.",
            "Step 1: spin the TOP layer until at least one cross edge's side color matches its center. Hold the cube so a matched edge faces YOU.",
            "Step 2: do the Sune. Check all four sides. Not done? Sune again. Still not? Spin the top to match a different edge in front and repeat. The front edge stays put while the other three dance around.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: SUNE,
            mask: MASK_LL_EDGES,
            caption:
              "Matched edge at the front → `R U R' U R U2 R'` cycles the other three home.",
          },
          moreCubes: [
            {
              frame: F,
              setup: "inverse",
              alg: `${SUNE} ${SUNE}`,
              mask: MASK_LL_EDGES,
              caption: "Sometimes they circle the wrong way — Sune twice fixes it.",
            },
          ],
          tips: [
            "The corners will look scrambled during this — that's normal, they're next!",
          ],
          quiz: [
            {
              question: "During the Sune, which edge stays in place?",
              options: [
                "The one at the back",
                "The one facing you (front)",
                "The one on the right",
                "None of them",
              ],
              answerIndex: 1,
              explanation:
                "The front edge holds still — so put an already-matched edge there.",
            },
          ],
        },
      ],
    },
    {
      id: "yellow-corners",
      emoji: "📦",
      title: "Corners to Their Spots",
      description: "Move the last four corners into position (twisting allowed!).",
      steps: [
        {
          id: "find-placed",
          title: "Find a corner that's already home",
          paragraphs: [
            "Look at the four top corners. A corner is 'home' if its three sticker colors match the three sides it touches — even if it's twisted! (A yellow-green-orange corner between the yellow top, green side and orange side is home, no matter which way it's turned.)",
            "Found one? Hold the cube so that corner is at the FRONT-RIGHT. Then do: `U R U' L' U R' U' L`. It spins the other three corners around while the front-right one stays put.",
            "Check again — all corners home? If not, do it once more (same corner at front-right).",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: CORNER_CYCLE,
            mask: MASK_LL_CORNERS_POS,
            caption:
              "Front-right corner stays; the other three rotate into their homes.",
          },
          moreCubes: [
            {
              frame: F,
              setup: "inverse",
              alg: `${CORNER_CYCLE} ${CORNER_CYCLE}`,
              mask: MASK_LL_CORNERS_POS,
              caption: "Circling the other way? Do the recipe twice.",
            },
          ],
          tips: [
            "NO corner is home yet? Do the recipe once from any angle — then one will be.",
            "Twisted corners are FINE here. Placing them is this step; straightening them is the grand finale.",
          ],
          quiz: [
            {
              question: "A corner counts as 'home' when...",
              options: [
                "Its yellow sticker points up",
                "Its 3 colors match the 3 sides it touches, twisted or not",
                "It's at the front-right",
                "It looks shiny",
              ],
              answerIndex: 1,
              explanation:
                "Position first, twisting later — home means the right colors in the right spot.",
            },
          ],
        },
      ],
    },
    {
      id: "final-twist",
      emoji: "🏁",
      title: "The Grand Finale",
      description: "Twist the last corners straight — and solve the cube!",
      steps: [
        {
          id: "righty-twist",
          title: "Twist with the righty trick",
          paragraphs: [
            "Last step! Hold the cube so a corner whose yellow is NOT pointing up sits at the FRONT-RIGHT. Now do the righty trick `R' D' R D` — 2 times or 4 times — until that corner's yellow points UP.",
            "⚠️ WARNING: the rest of the cube will look like you BROKE it. You didn't. Do not fix it. Do not rotate the whole cube. Trust the process!",
            "When the corner's yellow points up, turn ONLY the top layer (`U`) to bring the next crooked corner to the front-right. Twist it the same way. Keep going until every yellow points up — and watch the cube heal itself like magic.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: `${RIGHTY} ${RIGHTY} U ${RIGHTY} ${RIGHTY} ${RIGHTY} ${RIGHTY} U'`,
            mask: MASK_LL_CORNERS_ORI,
            caption:
              "Two crooked corners get twisted straight — messy in the middle, perfect at the end.",
          },
          tips: [
            "Always twist at the SAME front-right spot. Only the TOP layer turns between corners.",
            "After the last corner, spin the top until all the sides line up. That's it!",
          ],
        },
        {
          id: "solved",
          title: "YOU SOLVED THE RUBIK'S CUBE! 🎉🎉🎉",
          paragraphs: [
            "Take a good look at what you just did. A scrambled cube has 43 QUINTILLION possible positions — that's 43 followed by 18 zeros — and you just navigated one of them home. Seriously: go show someone!",
            "You now know the full beginner method: Daisy → White Cross → White Corners → Middle Layer → Yellow Cross → Match Edges → Place Corners → Twist Corners.",
            "Scramble your cube and solve it again. And again. When you can do it without peeking at the lessons, you're ready for Level 2 — where we make you FAST.",
          ],
          cube: {
            caption: "One cube, solved. Millions more scrambles await!",
          },
          quiz: [
            {
              question: "What comes right after the yellow cross?",
              options: [
                "Twist the corners",
                "Match the yellow edges to their centers",
                "The daisy",
                "Scramble and restart",
              ],
              answerIndex: 1,
              explanation:
                "Cross → match edges → place corners → twist corners. That's the home stretch!",
            },
            {
              question:
                "Mid-way through twisting corners the cube looks broken. What do you do?",
              options: [
                "Start over — something went wrong",
                "Keep going — it heals itself when all corners are twisted",
                "Rotate the whole cube and try elsewhere",
                "Cry",
              ],
              answerIndex: 1,
              explanation:
                "The righty trick borrows pieces and returns them at the end. Trust the process!",
            },
          ],
        },
      ],
    },
  ],
};

export default level1;
