import { levels } from "../curriculum";
import { challengesForLevel, type Challenge } from "../curriculum/challenges";
import { renderText } from "../lib/text";
import { XP } from "../lib/xp";
import { useProgress } from "../store/progress";
import type { Level } from "../curriculum/types";

function RepDots({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rounded-full transition ${
            i < done ? "bg-green-400" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const { challengeReps, isChallengeComplete, addChallengeRep } = useProgress();
  const reps = challengeReps(challenge.id);
  const complete = isChallengeComplete(challenge);
  const finishing = reps + 1 === challenge.reps;

  return (
    <div
      className={`flex flex-col rounded-3xl p-5 shadow-md transition ${
        complete
          ? "bg-gradient-to-b from-green-50 to-emerald-50 ring-2 ring-green-300"
          : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{complete ? "✅" : challenge.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-slate-800">{challenge.title}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {renderText(challenge.description)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <RepDots done={reps} total={challenge.reps} />
        {complete ? (
          <span className="animate-pop-in rounded-full bg-green-100 px-3 py-1.5 text-sm font-extrabold text-green-700">
            Mastered! 🎉
          </span>
        ) : (
          <button
            onClick={() => addChallengeRep(challenge)}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:scale-105 hover:bg-indigo-500"
          >
            I did it! +
            {XP.challengeRep + (finishing ? XP.challengeComplete : 0)} XP
          </button>
        )}
      </div>
    </div>
  );
}

function LevelChallenges({ level }: { level: Level }) {
  const { isLevelUnlocked, isLevelMastered, isChallengeComplete } =
    useProgress();
  const unlocked = isLevelUnlocked(level);
  const levelChallenges = challengesForLevel(level.id);
  const done = levelChallenges.filter((c) => isChallengeComplete(c)).length;
  const mastered = isLevelMastered(level);

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className={`bg-gradient-to-r ${level.gradient} px-6 py-3`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white drop-shadow-sm">
            <span className="mr-2 text-xl">{level.emoji}</span>
            Level {level.id}: {level.title}
          </h2>
          <span className="text-sm font-extrabold text-white/90">
            {mastered
              ? "💎 MASTERED"
              : unlocked
                ? `${done}/${levelChallenges.length}`
                : "🔒"}
          </span>
        </div>
      </div>
      {unlocked ? (
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {levelChallenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      ) : (
        <p className="px-6 py-4 text-center font-semibold text-slate-400">
          🔒 Unlock Level {level.id} on the Learn map first!
        </p>
      )}
    </section>
  );
}

export default function ChallengesPage() {
  const { completedChallengeCount } = useProgress();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-slate-900">
        🎯 Challenges
      </h1>
      <p className="mx-auto mb-6 max-w-xl text-center font-semibold text-slate-500">
        Grab your real cube and prove your skills! Tap{" "}
        <strong>"I did it!"</strong> each time you finish a challenge with your
        own hands. Master every challenge in a level to earn its 💎.
      </p>
      <p className="mb-6 text-center text-sm font-bold text-indigo-600">
        {completedChallengeCount} challenge
        {completedChallengeCount === 1 ? "" : "s"} mastered so far
      </p>

      <div className="space-y-6">
        {levels.map((level) => (
          <LevelChallenges key={level.id} level={level} />
        ))}
      </div>
    </div>
  );
}
