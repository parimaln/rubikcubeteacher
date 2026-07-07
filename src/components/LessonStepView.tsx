import type { LessonStep } from "../curriculum/types";
import CubeViewer from "./CubeViewer";
import NotationPlayground from "./NotationPlayground";
import QuizView from "./QuizView";
import { renderText } from "../lib/text";

interface Props {
  step: LessonStep;
  onQuizPassed: () => void;
}

export default function LessonStepView({ step, onQuizPassed }: Props) {
  const hasCube = !!step.cube || step.interactive === "notation";
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900">
          {step.title}
        </h2>
        {step.paragraphs.map((p, i) => (
          <p key={i} className="text-lg leading-relaxed text-slate-700">
            {renderText(p)}
          </p>
        ))}
        {step.tips && step.tips.length > 0 && (
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 font-bold text-amber-700">💡 Tips</p>
            <ul className="list-inside list-disc space-y-1 text-amber-900">
              {step.tips.map((t, i) => (
                <li key={i}>{renderText(t)}</li>
              ))}
            </ul>
          </div>
        )}
        {step.quiz && (
          <QuizView questions={step.quiz} onPassed={onQuizPassed} />
        )}
      </div>

      {hasCube && (
        <div className="space-y-4 lg:sticky lg:top-20">
          {step.interactive === "notation" ? (
            <div className="rounded-3xl bg-white p-4 shadow-lg">
              <NotationPlayground />
            </div>
          ) : (
            step.cube && (
              <div className="rounded-3xl bg-white p-4 shadow-lg">
                <CubeViewer
                  alg={step.cube.alg}
                  setup={step.cube.setup}
                  frame={step.cube.frame}
                  stickering={step.cube.stickering}
                  mask={step.cube.mask}
                  backView={step.cube.backView}
                  className="h-72 sm:h-80"
                />
                {step.cube.caption && (
                  <p className="mt-2 text-center text-sm font-semibold text-slate-500">
                    {renderText(step.cube.caption)}
                  </p>
                )}
              </div>
            )
          )}
          {step.moreCubes?.map((c, i) => (
            <div key={i} className="rounded-3xl bg-white p-4 shadow-lg">
              <CubeViewer
                alg={c.alg}
                setup={c.setup}
                frame={c.frame}
                stickering={c.stickering}
                mask={c.mask}
                backView={c.backView}
                className="h-60"
              />
              {c.caption && (
                <p className="mt-2 text-center text-sm font-semibold text-slate-500">
                  {renderText(c.caption)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
