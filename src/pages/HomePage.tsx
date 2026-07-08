import { Link } from "react-router-dom";
import { levels } from "../curriculum";
import { challengesForLevel } from "../curriculum/challenges";
import { dueReviews, type DueReview } from "../lib/review";
import { conceptsToday, currentStreak, lastWeek } from "../lib/streak";
import { rankForXp } from "../lib/xp";
import { useProfiles } from "../store/profiles";
import { useProgress } from "../store/progress";
import type { Level } from "../curriculum/types";

/** The next new concept: first incomplete step across unlocked lessons. */
function useNextConcept() {
  const { isStepComplete, isLevelUnlocked } = useProgress();
  for (const level of levels) {
    if (!isLevelUnlocked(level)) continue;
    for (const lesson of level.lessons) {
      for (const step of lesson.steps) {
        if (!isStepComplete(lesson.id, step.id)) {
          return { lesson, stepTitle: step.title, levelId: level.id };
        }
      }
    }
  }
  return null;
}

function StreakPanel() {
  const { activity } = useProgress();
  const streak = currentStreak(activity);
  const week = lastWeek(activity);
  const doneToday = conceptsToday(activity) > 0;

  return (
    <div className="flex flex-col items-center rounded-3xl bg-white p-5 shadow-md">
      <p className={`text-5xl ${doneToday ? "" : "grayscale opacity-60"}`}>
        🔥
      </p>
      <p className="mt-1 text-3xl font-extrabold text-slate-900">
        {streak}
        <span className="ml-1 text-base font-bold text-slate-400">
          day{streak === 1 ? "" : "s"}
        </span>
      </p>
      <p className="text-xs font-bold text-slate-400">
        {doneToday
          ? "Today's concept: DONE ✓"
          : "Do 1 concept today to keep it!"}
      </p>
      <div className="mt-3 flex gap-1.5">
        {week.map((d) => (
          <div key={d.key} className="flex flex-col items-center">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
                d.done
                  ? "bg-orange-400 text-white"
                  : d.isToday
                    ? "border-2 border-dashed border-orange-300 text-orange-300"
                    : "bg-slate-100 text-slate-300"
              }`}
            >
              {d.done ? "✓" : d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankPanel() {
  const { xp } = useProgress();
  const { rank, next, progress } = rankForXp(xp);

  return (
    <div className="flex flex-col justify-center rounded-3xl bg-white p-5 shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{rank.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold text-slate-900">{rank.name}</p>
          <p className="text-xs font-bold text-slate-400">{xp} XP</p>
        </div>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <p className="mt-1 text-xs font-bold text-slate-400">
        {next
          ? `${next.xp - xp} XP to ${next.emoji} ${next.name}`
          : "Top rank reached — legendary!"}
      </p>
    </div>
  );
}

function MissionCard({ due }: { due: DueReview[] }) {
  const { activity } = useProgress();
  const next = useNextConcept();
  const done = conceptsToday(activity);

  if (done > 0) {
    return (
      <div className="rounded-3xl bg-gradient-to-r from-emerald-400 to-green-500 p-6 text-center text-white shadow-lg">
        <p className="text-4xl">🎉</p>
        <h2 className="mt-1 text-2xl font-extrabold drop-shadow-sm">
          Today's mission complete!
        </h2>
        <p className="mt-1 font-semibold text-white/90">
          {done === 1
            ? "You learned your concept for today — your streak is safe. See you tomorrow!"
            : done < 3
              ? `${done} concepts today — nice! Remember: mastering one lesson slowly beats rushing through many.`
              : `Wow, ${done} concepts today! Time to grab your real cube and practice — challenges are waiting. 🎯`}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            to="/challenges"
            className="rounded-2xl bg-white/20 px-5 py-2.5 font-extrabold backdrop-blur transition hover:bg-white/30"
          >
            🎯 Practice a challenge
          </Link>
          <Link
            to="/timer"
            className="rounded-2xl bg-white/20 px-5 py-2.5 font-extrabold backdrop-blur transition hover:bg-white/30"
          >
            ⏱️ Do a timed solve
          </Link>
        </div>
      </div>
    );
  }

  // Revision first when something is due — old concepts fade fast!
  const review = due[0];
  if (review) {
    return (
      <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-center text-white shadow-lg">
        <p className="text-sm font-extrabold uppercase tracking-wide text-white/80">
          Today's mission
        </p>
        <h2 className="mt-1 text-2xl font-extrabold drop-shadow-sm">
          🔁 Revise: {review.lesson.emoji} {review.lesson.title}
        </h2>
        <p className="mt-1 font-semibold text-white/90">
          You learned this a while ago — a quick revision keeps it locked in
          your brain forever.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            to={`/learn/${review.lesson.id}?review=1`}
            className="rounded-2xl bg-white px-6 py-3 text-lg font-extrabold text-orange-600 shadow-md transition hover:scale-105"
          >
            Start revision →
          </Link>
          {next && (
            <Link
              to={`/learn/${next.lesson.id}`}
              className="rounded-2xl bg-white/20 px-5 py-3 font-bold backdrop-blur transition hover:bg-white/30"
            >
              or learn something new
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (next) {
    return (
      <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-600 p-6 text-center text-white shadow-lg">
        <p className="text-sm font-extrabold uppercase tracking-wide text-white/80">
          Today's mission — one concept a day!
        </p>
        <h2 className="mt-1 text-2xl font-extrabold drop-shadow-sm">
          {next.lesson.emoji} {next.lesson.title}
        </h2>
        <p className="mt-1 font-semibold text-white/90">
          Next concept: <strong>{next.stepTitle}</strong>
        </p>
        <Link
          to={`/learn/${next.lesson.id}`}
          className="mt-4 inline-block rounded-2xl bg-white px-8 py-3 text-lg font-extrabold text-indigo-700 shadow-md transition hover:scale-105"
        >
          Start today's concept →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-600 p-6 text-center text-white shadow-lg">
      <p className="text-4xl">🎓</p>
      <h2 className="mt-1 text-2xl font-extrabold">
        You've finished every lesson!
      </h2>
      <p className="mt-1 font-semibold text-white/90">
        Keep your streak alive with challenges and timed solves.
      </p>
      <Link
        to="/challenges"
        className="mt-4 inline-block rounded-2xl bg-white px-6 py-3 font-extrabold text-indigo-700 shadow-md transition hover:scale-105"
      >
        🎯 Go to challenges
      </Link>
    </div>
  );
}

function ReviewQueue({ due }: { due: DueReview[] }) {
  if (due.length === 0) return null;
  return (
    <section className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-5">
      <h2 className="font-extrabold text-amber-800">
        🔁 Time to revise ({due.length})
      </h2>
      <p className="mb-3 text-sm font-semibold text-amber-700/80">
        Great cubers re-visit old concepts so they never forget them. Each
        revision = +15 XP!
      </p>
      <div className="flex flex-wrap gap-2">
        {due.slice(0, 4).map((r) => (
          <Link
            key={r.lesson.id}
            to={`/learn/${r.lesson.id}?review=1`}
            className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 font-bold text-slate-700 shadow-sm transition hover:scale-105 hover:shadow-md"
          >
            <span className="text-xl">{r.lesson.emoji}</span>
            {r.lesson.title}
          </Link>
        ))}
        {due.length > 4 && (
          <span className="self-center text-sm font-bold text-amber-700">
            +{due.length - 4} more
          </span>
        )}
      </div>
    </section>
  );
}

function LevelCard({ level }: { level: Level }) {
  const {
    levelProgress,
    isLevelUnlocked,
    isLessonComplete,
    lessonProgress,
    isLevelMastered,
    isChallengeComplete,
  } = useProgress();
  const unlocked = isLevelUnlocked(level);
  const { done, total } = levelProgress(level);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = total > 0 && done === total;
  const mastered = isLevelMastered(level);
  const levelChallenges = challengesForLevel(level.id);
  const challengesDone = levelChallenges.filter((c) =>
    isChallengeComplete(c),
  ).length;

  // Focus: the first not-yet-finished lesson is "up next" — one at a time!
  const currentLessonId = level.lessons.find((l) => !isLessonComplete(l))?.id;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-lg transition ${
        unlocked ? "bg-white" : "bg-slate-100 opacity-80"
      }`}
    >
      <div className={`bg-gradient-to-r ${level.gradient} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white drop-shadow-sm sm:text-2xl">
            <span className="mr-2 text-2xl sm:text-3xl">{level.emoji}</span>
            Level {level.id}: {level.title}
          </h2>
          <span className="text-2xl">
            {mastered ? "💎" : complete ? "🏅" : unlocked ? "" : "🔒"}
          </span>
        </div>
        <p className="mt-1 font-semibold text-white/90">{level.tagline}</p>
      </div>

      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-green-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-500">{pct}%</span>
        </div>

        {unlocked ? (
          <>
            <ul className="grid gap-2 sm:grid-cols-2">
              {level.lessons.map((lesson) => {
                const lessonDone = isLessonComplete(lesson);
                const p = lessonProgress(lesson);
                const started = p.done > 0 && !lessonDone;
                const isCurrent = lesson.id === currentLessonId;
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/learn/${lesson.id}`}
                      className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition hover:scale-[1.02] hover:shadow-md ${
                        lessonDone
                          ? "border-green-300 bg-green-50"
                          : started
                            ? "border-amber-300 bg-amber-50"
                            : isCurrent
                              ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                              : "border-slate-200 bg-white"
                      }`}
                    >
                      <span className="text-2xl">{lesson.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-slate-800">
                          {lesson.title}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {isCurrent && !started
                            ? "⭐ Up next — focus here!"
                            : lesson.description}
                        </span>
                      </span>
                      <span className="text-lg">
                        {lessonDone ? "✅" : started ? "▶️" : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              to="/challenges"
              className="mt-3 flex items-center justify-between rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 px-4 py-2.5 font-bold text-violet-700 transition hover:scale-[1.01] hover:bg-violet-100"
            >
              <span>🎯 Level {level.id} challenges</span>
              <span className="text-sm">
                {challengesDone}/{levelChallenges.length}{" "}
                {mastered ? "💎" : ""}
              </span>
            </Link>
          </>
        ) : (
          <p className="py-2 text-center font-semibold text-slate-500">
            🔒 Finish Level {level.id - 1} to unlock this level!
          </p>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { activeProfile } = useProfiles();
  const { isLessonComplete, lessonCompletedAt, reviews } = useProgress();
  const due = dueReviews(isLessonComplete, lessonCompletedAt, reviews);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {activeProfile?.avatar} Hi, {activeProfile?.name}!
        </h1>
        <p className="mt-2 font-semibold text-slate-600">
          One concept a day, one lesson at a time — that's how champions are
          made. 🏆
        </p>
      </header>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <StreakPanel />
        <RankPanel />
      </div>

      <div className="mb-4">
        <MissionCard due={due} />
      </div>

      <div className="mb-6">
        <ReviewQueue due={due} />
      </div>

      <div className="space-y-6">
        {levels.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>
    </div>
  );
}
