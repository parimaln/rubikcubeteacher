import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { levels } from "../curriculum";
import { useProgress } from "../store/progress";
import LessonStepView from "../components/LessonStepView";

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { isStepComplete, markStepComplete } = useProgress();

  const found = useMemo(() => {
    for (const level of levels) {
      const index = level.lessons.findIndex((l) => l.id === lessonId);
      if (index !== -1) {
        return { level, lesson: level.lessons[index], lessonIndex: index };
      }
    }
    return null;
  }, [lessonId]);

  // Start at the first incomplete step so kids resume where they left off.
  const [stepIndex, setStepIndex] = useState(() => {
    if (!found) return 0;
    const i = found.lesson.steps.findIndex(
      (s) => !isStepComplete(found.lesson.id, s.id),
    );
    return i === -1 ? 0 : i;
  });
  const [quizPassed, setQuizPassed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  if (!found) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl">Hmm, that lesson doesn't exist. 🤷</p>
        <Link to="/" className="font-bold text-indigo-600 underline">
          Back to the map
        </Link>
      </div>
    );
  }

  const { level, lesson, lessonIndex } = found;
  const step = lesson.steps[stepIndex];
  const isLast = stepIndex === lesson.steps.length - 1;
  const stepDone = isStepComplete(lesson.id, step.id);
  const needsQuiz = !!step.quiz && !stepDone && !quizPassed;
  const nextLesson = level.lessons[lessonIndex + 1];

  function goTo(i: number) {
    setStepIndex(i);
    setQuizPassed(false);
    window.scrollTo({ top: 0 });
  }

  function completeAndAdvance() {
    markStepComplete(lesson.id, step.id);
    if (isLast) {
      setCelebrating(true);
    } else {
      goTo(stepIndex + 1);
    }
  }

  if (celebrating) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="animate-pop-in space-y-6 rounded-3xl bg-white p-10 shadow-xl">
          <p className="text-7xl">🎉</p>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Lesson complete!
          </h1>
          <p className="text-lg text-slate-600">
            You finished <strong>{lesson.title}</strong>. Awesome work!
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {nextLesson && (
              <button
                onClick={() => {
                  setCelebrating(false);
                  navigate(`/learn/${nextLesson.id}`);
                  goTo(0);
                }}
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-indigo-500"
              >
                Next lesson: {nextLesson.emoji} {nextLesson.title} →
              </button>
            )}
            <Link
              to="/"
              className="rounded-2xl bg-slate-200 px-6 py-3 text-lg font-bold text-slate-700 transition hover:bg-slate-300"
            >
              🗺️ Back to the map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/"
          className="text-sm font-bold text-indigo-600 hover:underline"
        >
          ← Level {level.id}: {level.title}
        </Link>
        <span className="text-sm font-semibold text-slate-500">
          {lesson.emoji} {lesson.title} — step {stepIndex + 1} of{" "}
          {lesson.steps.length}
        </span>
      </div>

      {/* step dots */}
      <div className="mb-6 flex flex-wrap gap-2">
        {lesson.steps.map((s, i) => {
          const done = isStepComplete(lesson.id, s.id);
          const active = i === stepIndex;
          return (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              title={s.title}
              className={`h-3.5 min-w-8 flex-1 rounded-full transition sm:flex-none sm:basis-10 ${
                active
                  ? "bg-indigo-600"
                  : done
                    ? "bg-green-400"
                    : "bg-slate-300 hover:bg-slate-400"
              }`}
            />
          );
        })}
      </div>

      <LessonStepView
        key={`${lesson.id}/${step.id}`}
        step={step}
        onQuizPassed={() => setQuizPassed(true)}
      />

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => goTo(Math.max(0, stepIndex - 1))}
          disabled={stepIndex === 0}
          className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={completeAndAdvance}
          disabled={needsQuiz}
          className="rounded-2xl bg-indigo-600 px-6 py-3 text-lg font-bold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {needsQuiz
            ? "Answer the quiz to continue"
            : isLast
              ? "Finish lesson 🎉"
              : stepDone
                ? "Next →"
                : "Got it! Next →"}
        </button>
      </div>
    </div>
  );
}
