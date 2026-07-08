import { bestStreak } from "../lib/streak";
import { allBadges, earnedBadgeIds } from "../store/badges";
import { useProgress } from "../store/progress";

export default function BadgesPage() {
  const {
    isLessonComplete,
    isLevelComplete,
    isLevelMastered,
    solves,
    xp,
    completedChallengeCount,
    reviewCount,
    activity,
  } = useProgress();
  const earned = earnedBadgeIds({
    isLessonComplete,
    isLevelComplete,
    isLevelMastered,
    solves,
    xp,
    bestStreak: bestStreak(activity),
    completedChallengeCount,
    reviewCount,
  });
  const badges = allBadges();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-slate-900">
        🏅 Badge Collection
      </h1>
      <p className="mb-6 text-center font-semibold text-slate-500">
        {earned.size} of {badges.length} earned — keep going!
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {badges.map((b) => {
          const got = earned.has(b.id);
          return (
            <div
              key={b.id}
              className={`flex flex-col items-center rounded-3xl p-4 text-center shadow-md transition ${
                got
                  ? "animate-pop-in bg-gradient-to-b from-amber-100 to-yellow-50 ring-2 ring-amber-300"
                  : "bg-white opacity-60 grayscale"
              }`}
            >
              <span className="text-5xl">{got ? b.emoji : "🔒"}</span>
              <p className="mt-2 font-extrabold text-slate-800">{b.name}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
