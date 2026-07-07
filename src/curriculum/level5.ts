import type { Level } from "./types";

const level5: Level = {
  id: 5,
  emoji: "🏁",
  title: "Speed Training",
  tagline: "Train like a real speedcuber — timers, averages, and goals.",
  gradient: "from-indigo-600 to-blue-500",
  lessons: [
    {
      id: "timer-mastery",
      emoji: "⏱️",
      title: "Timer Mastery",
      description: "Inspection, averages, and honest measurement.",
      steps: [
        {
          id: "inspection",
          title: "Use your 15 seconds",
          paragraphs: [
            "In official competitions you get 15 seconds of INSPECTION before every solve: look at the cube, plan, but don't turn. Great cubers plan their ENTIRE cross (and often the first F2L pair) during inspection.",
            "Our Timer page has an inspection mode — turn it on and practice using every second: find the four cross edges, decide your first moves, picture where the first pair will be.",
          ],
          tips: [
            "Hold the cube in inspection exactly how you'll start the solve. No surprises.",
          ],
        },
        {
          id: "averages",
          title: "Averages tell the truth",
          paragraphs: [
            "One lucky solve means nothing — averages are your real speed. An ao5 (average of 5) drops your best AND worst solve, then averages the middle three. ao12 does the same over twelve solves.",
            "The Timer tracks these automatically. Watch your ao5 — when it drops, YOU got faster. When a single solve is fast, you got lucky. Both feel great, but only one is progress!",
          ],
          quiz: [
            {
              question: "Your times are 50s, 55s, 48s, 90s, 52s. What does ao5 do with the 90?",
              options: [
                "Counts it fully",
                "Drops it (and also drops the 48)",
                "Doubles it as punishment",
                "Averages it with the 48",
              ],
              answerIndex: 1,
              explanation:
                "ao5 removes the best and worst, then averages the middle three: (50+55+52)/3.",
            },
          ],
        },
      ],
    },
    {
      id: "training-plan",
      emoji: "📅",
      title: "Your Training Plan",
      description: "Little drills, big gains.",
      steps: [
        {
          id: "drills",
          title: "Drill the pieces, not just full solves",
          paragraphs: [
            "Full solves are the test; drills are the training. Rotate through these, 10 minutes at a time:",
            "🎯 CROSS-ONLY: scramble, solve just the cross, repeat. Goal: under 5 seconds, eyes closed after inspection (yes, really — plan it fully, then solve blind!).",
            "👫 F2L-ONLY: solve cross + all four pairs, stop before the last layer. Focus on zero pauses.",
            "⚡ PLL TIME-ATTACK: do all the PLLs you know back-to-back as fast as possible. Beat yesterday's total.",
            "🐌 SLOW SOLVES: full solves at half speed with NO pauses allowed. This one builds lookahead faster than anything else.",
          ],
        },
        {
          id: "goal-ladder",
          title: "The goal ladder",
          paragraphs: [
            "Every speedcuber climbs the same ladder — each rung takes weeks, and that's normal: 3:00 → 2:00 → 1:30 → 1:00 → 0:45 → 0:30 → 0:20.",
            "Under 2:00 usually means your beginner method is smooth. Under 1:00 usually means F2L clicked. Under 0:30 means CFOP with good lookahead — genuinely fast!",
            "Record solves on the Timer page and collect the speed badges as you climb. 🏅",
          ],
          quiz: [
            {
              question: "What's the best sign that you're actually improving?",
              options: [
                "One super-fast lucky solve",
                "Your ao5 average dropping over time",
                "Turning the cube really loudly",
                "Skipping inspection",
              ],
              answerIndex: 1,
              explanation: "Averages don't lie. Lucky singles do!",
            },
          ],
        },
      ],
    },
    {
      id: "competition",
      emoji: "🏆",
      title: "The Cubing World",
      description: "Competitions, records, and what's next.",
      steps: [
        {
          id: "wca",
          title: "Real competitions exist — and kids win them",
          paragraphs: [
            "The World Cube Association (WCA) runs official competitions all over the world, and cubers your age compete in every one of them. Everyone solves five scrambles; your ao5 is your result. Nobody laughs at slow times — cubers are the friendliest crowd, and everyone remembers being a beginner.",
            "The world record single is under 4 seconds. World-class averages are around 5–6 seconds. Every one of those cubers started exactly where you are now.",
          ],
        },
        {
          id: "whats-next",
          title: "Your journey continues",
          paragraphs: [
            "You've climbed the whole mountain: from 'what's an edge piece?' to full CFOP with training plans. What's next is up to you:",
            "🧊 Bigger cubes: 4x4, 5x5 and beyond (your 3x3 skills carry over!). ✋ One-handed solving. 🙈 Blindfolded solving (yes, it's learnable!). 🏆 Your first WCA competition.",
            "Keep your streak going: a few solves every day beats a marathon once a month. See you on the leaderboards, speedcuber. 🚀",
          ],
          quiz: [
            {
              question: "What result counts at a WCA competition?",
              options: [
                "Your single best solve only",
                "Your average of 5 solves",
                "Your total over one hour",
                "Style points",
              ],
              answerIndex: 1,
              explanation:
                "Five scrambles, drop best and worst, average the rest — the ao5 you've been training!",
            },
          ],
        },
      ],
    },
  ],
};

export default level5;
