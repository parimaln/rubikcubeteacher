import { useCallback, useEffect, useRef, useState } from "react";
import CubeViewer from "../components/CubeViewer";
import { generateScramble } from "../lib/scramble";
import { averageOfN, bestMs } from "../lib/stats";
import { formatMs } from "../lib/text";
import { useProgress } from "../store/progress";

type Phase = "idle" | "inspecting" | "armed" | "running" | "stopped";

export default function TimerPage() {
  const { solves, addSolve, deleteSolve } = useProgress();
  const [scramble, setScramble] = useState(generateScramble);
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayMs, setDisplayMs] = useState(0);
  const [inspectionOn, setInspectionOn] = useState(false);
  const [inspectLeft, setInspectLeft] = useState(15);

  const startRef = useRef(0);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;
  const scrambleRef = useRef(scramble);
  scrambleRef.current = scramble;

  const tick = useCallback(() => {
    setDisplayMs(performance.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startTimer = useCallback(() => {
    startRef.current = performance.now();
    setPhase("running");
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stopTimer = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const ms = performance.now() - startRef.current;
    setDisplayMs(ms);
    setPhase("stopped");
    addSolve(Math.round(ms), scrambleRef.current);
    setScramble(generateScramble());
  }, [addSolve]);

  // Inspection countdown
  useEffect(() => {
    if (phase !== "inspecting") return;
    setInspectLeft(15);
    const iv = setInterval(() => {
      setInspectLeft((s) => {
        if (s <= 1) {
          clearInterval(iv);
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // Keyboard control: hold space to arm, release to start, any key stops.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const p = phaseRef.current;
      if (p === "running") {
        e.preventDefault();
        stopTimer();
        return;
      }
      if (e.code !== "Space") return;
      e.preventDefault();
      if (p === "idle" || p === "stopped") {
        if (inspectionOn) {
          setPhase("inspecting");
        } else {
          setDisplayMs(0);
          setPhase("armed");
        }
      } else if (p === "inspecting") {
        setDisplayMs(0);
        setPhase("armed");
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (phaseRef.current === "armed") startTimer();
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [inspectionOn, startTimer, stopTimer]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Touch control (tablets/phones)
  function onTouchStart() {
    const p = phaseRef.current;
    if (p === "running") {
      stopTimer();
    } else if (p === "idle" || p === "stopped") {
      if (inspectionOn) setPhase("inspecting");
      else {
        setDisplayMs(0);
        setPhase("armed");
      }
    } else if (p === "inspecting") {
      setDisplayMs(0);
      setPhase("armed");
    }
  }
  function onTouchEnd() {
    if (phaseRef.current === "armed") startTimer();
  }

  const best = bestMs(solves);
  const ao5 = averageOfN(solves, 5);
  const ao12 = averageOfN(solves, 12);

  const timerColor =
    phase === "armed"
      ? "text-green-500"
      : phase === "running"
        ? "text-slate-900"
        : "text-indigo-700";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-center text-3xl font-extrabold text-slate-900">
        ⏱️ Speed Timer
      </h1>

      <div className="mb-4 rounded-2xl bg-white p-4 text-center shadow-md">
        <p className="mb-1 text-sm font-bold text-slate-400">SCRAMBLE</p>
        <p className="font-mono text-lg font-bold tracking-wide text-slate-800">
          {scramble}
        </p>
        <button
          onClick={() => setScramble(generateScramble())}
          className="mt-2 rounded-full bg-slate-100 px-4 py-1 text-sm font-bold text-slate-500 hover:bg-slate-200"
        >
          🔄 New scramble
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex min-h-64 cursor-pointer select-none flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-md"
        >
          {phase === "inspecting" ? (
            <>
              <p className={`text-7xl font-extrabold tabular-nums ${inspectLeft <= 4 ? "text-red-500" : "text-amber-500"}`}>
                {inspectLeft}
              </p>
              <p className="mt-3 font-semibold text-slate-500">
                Inspect! Hold SPACE (or press here) when ready...
              </p>
            </>
          ) : (
            <>
              <p className={`font-mono text-7xl font-extrabold tabular-nums ${timerColor}`}>
                {formatMs(displayMs)}
              </p>
              <p className="mt-3 text-center font-semibold text-slate-500">
                {phase === "running"
                  ? "Press any key (or tap) to STOP"
                  : phase === "armed"
                    ? "Release to GO!"
                    : "Hold SPACE (or press here), release to start"}
              </p>
            </>
          )}
          <label className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-500">
            <input
              type="checkbox"
              checked={inspectionOn}
              onChange={(e) => setInspectionOn(e.target.checked)}
              className="h-4 w-4"
            />
            15s inspection (like real competitions)
          </label>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-4 shadow-md">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs font-bold text-slate-400">BEST</p>
                <p className="text-xl font-extrabold text-green-600">
                  {best !== null ? formatMs(best) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">AO5</p>
                <p className="text-xl font-extrabold text-indigo-600">
                  {ao5 !== null ? formatMs(ao5) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">AO12</p>
                <p className="text-xl font-extrabold text-violet-600">
                  {ao12 !== null ? formatMs(ao12) : "—"}
                </p>
              </div>
            </div>
            <p className="mt-2 text-center text-xs font-semibold text-slate-400">
              {solves.length} solve{solves.length === 1 ? "" : "s"} recorded
            </p>
          </div>

          <div className="rounded-3xl bg-white p-3 shadow-md">
            <CubeViewer
              setup={scramble}
              controls={false}
              speedControl={false}
              className="h-44"
            />
            <p className="text-center text-xs font-semibold text-slate-400">
              Your scramble, previewed
            </p>
          </div>
        </div>
      </div>

      {solves.length > 0 && (
        <div className="mt-6 rounded-3xl bg-white p-4 shadow-md">
          <h2 className="mb-2 font-extrabold text-slate-700">History</h2>
          <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
            {[...solves].reverse().map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-8 font-bold text-slate-400">
                  #{solves.length - i}
                </span>
                <span className="w-20 font-mono text-base font-extrabold text-slate-800">
                  {formatMs(s.ms)}
                </span>
                <span className="hidden flex-1 truncate font-mono text-xs text-slate-400 sm:block">
                  {s.scramble}
                </span>
                <button
                  onClick={() => deleteSolve(s.id)}
                  title="Delete this solve"
                  className="rounded-full px-2 py-1 text-slate-300 hover:bg-red-50 hover:text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
