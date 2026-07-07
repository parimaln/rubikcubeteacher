import { useState } from "react";
import type { QuizQuestion } from "../curriculum/types";
import { renderText } from "../lib/text";

interface Props {
  questions: QuizQuestion[];
  /** Called once when every question has been answered correctly. */
  onPassed: () => void;
}

/** Kid-friendly quiz: pick answers, instant feedback, retry until correct. */
export default function QuizView({ questions, onPassed }: Props) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [passed, setPassed] = useState(false);

  function pick(qIndex: number, optionIndex: number) {
    if (picked[qIndex] === questions[qIndex].answerIndex) return; // already correct
    const next = { ...picked, [qIndex]: optionIndex };
    setPicked(next);
    const allCorrect = questions.every(
      (q, i) => next[i] === q.answerIndex,
    );
    if (allCorrect && !passed) {
      setPassed(true);
      onPassed();
    }
  }

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const chosen = picked[qi];
        const correct = chosen === q.answerIndex;
        return (
          <div key={qi} className="rounded-2xl bg-violet-50 p-4">
            <p className="mb-3 font-bold text-slate-800">
              🤔 {renderText(q.question)}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const style = isChosen
                  ? correct
                    ? "bg-green-500 text-white ring-2 ring-green-600"
                    : "bg-red-400 text-white"
                  : "bg-white hover:bg-violet-100 text-slate-700";
                return (
                  <button
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    className={`rounded-xl px-4 py-3 text-left font-semibold shadow-sm transition ${style}`}
                  >
                    {renderText(opt)}
                  </button>
                );
              })}
            </div>
            {chosen !== undefined && (
              <p
                className={`mt-3 font-semibold ${correct ? "text-green-700" : "text-red-500"}`}
              >
                {correct
                  ? `🎉 Correct! ${q.explanation ?? ""}`
                  : "Not quite — try again!"}
              </p>
            )}
          </div>
        );
      })}
      {passed && (
        <p className="animate-pop-in text-center text-lg font-extrabold text-green-600">
          ⭐ Quiz passed! ⭐
        </p>
      )}
    </div>
  );
}
