import type { Level } from "./types";
import { MASK_CROSS } from "./masks";

const F = "z2";
const SEXY = "R U R' U'";

const level2: Level = {
  id: 2,
  emoji: "⚡",
  title: "Getting Faster",
  tagline: "Same solve, way less time: finger tricks and smart planning.",
  gradient: "from-amber-500 to-orange-400",
  lessons: [
    {
      id: "finger-tricks",
      emoji: "🫰",
      title: "Finger Tricks",
      description: "Turn with flicks, not wrist twists.",
      steps: [
        {
          id: "grip",
          title: "Hold it like a speedcuber",
          paragraphs: [
            "Speed isn't about rushing — it's about wasting nothing. Hold the cube with your thumbs on the front and your ring/pinky fingers on the back. Your index fingers hover over the top layer like triggers.",
            "`U` turns: FLICK the top layer with your right index finger. `U'`: flick with the left index. No wrist turning, no letting go of the cube!",
            "`R` and `R'`: roll your whole right wrist while your left hand holds the cube. `L` and `L'`: mirror it with the left wrist.",
          ],
          tips: [
            "A budget speedcube (magnetic if possible) makes finger tricks about 10× easier than an old stiff cube.",
            "Slow and smooth first. Smooth becomes fast on its own.",
          ],
        },
        {
          id: "sexy-drill",
          title: "The six-pack drill",
          paragraphs: [
            "Here's your daily warm-up: the sexy move `R U R' U'` done SIX times in a row. Magic property: after 6 rounds the cube comes back to exactly how it started — so you can drill it forever without scrambling anything.",
            "Use only finger tricks: wrist-flick-wrist-flick. Time yourself: can you do all 6 rounds in under 10 seconds? Under 6?",
          ],
          cube: {
            frame: F,
            alg: `${SEXY} ${SEXY} ${SEXY} ${SEXY} ${SEXY} ${SEXY}`,
            caption: "Six sexy moves = right back where you started. Drill it!",
          },
          quiz: [
            {
              question: "How should you turn `U` for speed?",
              options: [
                "Rotate the whole cube",
                "Flick the top layer with your index finger",
                "Use both wrists",
                "Ask a friend to turn it",
              ],
              answerIndex: 1,
              explanation:
                "Index-finger flicks keep both hands on the cube — no time lost regripping.",
            },
          ],
        },
      ],
    },
    {
      id: "direct-cross",
      emoji: "🎯",
      title: "Cross Without the Daisy",
      description: "The daisy was training wheels. Time to take them off.",
      steps: [
        {
          id: "why-skip",
          title: "Why skip the daisy?",
          paragraphs: [
            "The daisy is a friendly detour: every petal goes UP to the top, then back DOWN. That's twice the travel! Speedcubers build the white cross directly on the bottom.",
            "The trick is to stop thinking 'sticker up top' and start thinking 'shortest path home' for each white edge. Most edges can reach their home spot in 1–3 moves if you look before you turn.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "R2 D' F2",
            mask: MASK_CROSS,
            caption:
              "Cross pieces head straight home in a few moves — no daisy detour.",
          },
        },
        {
          id: "plan-it",
          title: "Plan before you turn",
          paragraphs: [
            "Before you start solving, take a few seconds and just LOOK: find all four white edges and imagine their paths home. Speedcubers plan the whole cross before their first turn.",
            "Goal to grow into: solve the cross in 8 moves or fewer, without turning the cube over to check. Peek at the bottom by tilting, not flipping — your yellow center should stay up the entire solve.",
          ],
          cube: {
            frame: F,
            setup: "inverse",
            alg: "F2 R' D R2 D2 L D'",
            mask: MASK_CROSS,
            caption: "A cross solved in one smooth planned sequence.",
          },
          tips: [
            "Practice cross-only: scramble, solve JUST the cross, scramble again. Ten crosses a day and it becomes automatic.",
          ],
          quiz: [
            {
              question: "Why is the direct cross faster than the daisy?",
              options: [
                "It uses stronger fingers",
                "Pieces travel straight home instead of up-then-down",
                "It skips the cross entirely",
                "It isn't faster",
              ],
              answerIndex: 1,
              explanation:
                "Half the travel = half the moves. Plan the path, skip the detour.",
            },
          ],
        },
      ],
    },
    {
      id: "look-ahead",
      emoji: "👀",
      title: "Look Ahead",
      description: "The real speed secret: your eyes work before your hands.",
      steps: [
        {
          id: "stop-watching",
          title: "Stop watching your own hands",
          paragraphs: [
            "Here's the biggest speed secret in cubing, and it has nothing to do with fast fingers: while your hands finish the CURRENT piece, your eyes should already be hunting for the NEXT one.",
            "Try this exercise: solve the whole cube in slow motion — turning as slowly as you can bear — but NEVER PAUSING. No stops between steps. You'll be amazed: slow-but-nonstop often beats fast-with-pauses!",
          ],
          tips: [
            "Pauses are where solves go to die. Hunt the next piece early and the pauses disappear.",
          ],
        },
        {
          id: "milestones",
          title: "Your speed milestones",
          paragraphs: [
            "Time to set some goals! Head to the Timer page (⏱️ in the menu) and record some solves. Every solve counts — the timer keeps your history and calculates your averages.",
            "Milestones to chase, one at a time: under 3 minutes 🐢 → under 2 minutes 🚴 → under 90 seconds 🛵 → under 1 minute 🚀. Each one earns you a badge!",
            "Averages matter more than single solves: an 'ao5' is your average of 5 (dropping best and worst). It shows your TRUE speed.",
          ],
          quiz: [
            {
              question: "What's the 'slow motion' exercise for?",
              options: [
                "Resting your fingers",
                "Learning to solve without pauses by looking ahead",
                "Making solves take longer on purpose",
                "Warming up the cube",
              ],
              answerIndex: 1,
              explanation:
                "Turning slowly forces your eyes to stay ahead of your hands — that skill is what makes you fast.",
            },
          ],
        },
      ],
    },
  ],
};

export default level2;
