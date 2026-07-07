import { Link } from "react-router-dom";
import { levels } from "../curriculum";
import { useProgress } from "../store/progress";
import type { Level } from "../curriculum/types";

function LevelCard({ level }: { level: Level }) {
  const { levelProgress, isLevelUnlocked, isLessonComplete, lessonProgress } =
    useProgress();
  const unlocked = isLevelUnlocked(level);
  const { done, total } = levelProgress(level);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = total > 0 && done === total;

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
            {complete ? "🏅" : unlocked ? "" : "🔒"}
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
          <ul className="grid gap-2 sm:grid-cols-2">
            {level.lessons.map((lesson) => {
              const lessonDone = isLessonComplete(lesson);
              const p = lessonProgress(lesson);
              const started = p.done > 0 && !lessonDone;
              return (
                <li key={lesson.id}>
                  <Link
                    to={`/learn/${lesson.id}`}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition hover:scale-[1.02] hover:shadow-md ${
                      lessonDone
                        ? "border-green-300 bg-green-50"
                        : started
                          ? "border-amber-300 bg-amber-50"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{lesson.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-slate-800">
                        {lesson.title}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {lesson.description}
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
  const { isStepComplete } = useProgress();

  // Find the first incomplete step across all unlocked content → "Continue" button.
  let continueTo: { lessonId: string; title: string; emoji: string } | null =
    null;
  outer: for (const level of levels) {
    for (const lesson of level.lessons) {
      for (const step of lesson.steps) {
        if (!isStepComplete(lesson.id, step.id)) {
          continueTo = {
            lessonId: lesson.id,
            title: lesson.title,
            emoji: lesson.emoji,
          };
          break outer;
        }
      }
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          🧩 Cube Academy
        </h1>
        <p className="mt-3 text-lg font-semibold text-slate-600">
          Your journey from first turn to speedcuber — one level at a time!
        </p>
        {continueTo && (
          <Link
            to={`/learn/${continueTo.lessonId}`}
            className="mt-5 inline-block rounded-2xl bg-indigo-600 px-8 py-4 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 hover:bg-indigo-500"
          >
            {continueTo.emoji} Continue: {continueTo.title} →
          </Link>
        )}
      </header>

      <div className="space-y-6">
        {levels.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>
    </div>
  );
}
