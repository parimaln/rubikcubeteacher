import { useEffect, useRef, useState } from "react";
import { TwistyPlayer } from "cubing/twisty";

const FACES = ["R", "L", "U", "D", "F", "B"] as const;
type Modifier = "" | "'" | "2";

/** Tap-a-move playground: kids press notation buttons and watch the cube obey. */
export default function NotationPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);
  const [modifier, setModifier] = useState<Modifier>("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const player = new TwistyPlayer({
      puzzle: "3x3x3",
      background: "none",
      hintFacelets: "none",
      controlPanel: "none",
    });
    playerRef.current = player;
    containerRef.current?.appendChild(player);
    return () => {
      player.remove();
      playerRef.current = null;
    };
  }, []);

  function doMove(face: string) {
    const move = `${face}${modifier}`;
    playerRef.current?.experimentalAddMove(move);
    setHistory((h) => [...h.slice(-11), move]);
  }

  function reset() {
    const player = playerRef.current;
    if (player) player.alg = "";
    setHistory([]);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={containerRef} className="h-64 w-full sm:h-72" />
      <div className="flex flex-wrap justify-center gap-2">
        {FACES.map((f) => (
          <button
            key={f}
            onClick={() => doMove(f)}
            className="h-14 w-14 rounded-2xl bg-indigo-600 font-mono text-xl font-extrabold text-white shadow-md transition hover:scale-105 hover:bg-indigo-500 active:scale-95"
          >
            {f}
            {modifier}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">Turn type:</span>
        {(["", "'", "2"] as Modifier[]).map((m) => (
          <button
            key={m || "plain"}
            onClick={() => setModifier(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              modifier === m
                ? "bg-amber-400 text-slate-900"
                : "bg-white text-slate-500 hover:bg-amber-100"
            }`}
          >
            {m === "" ? "Normal ↻" : m === "'" ? "Prime ↺" : "Double ×2"}
          </button>
        ))}
        <button
          onClick={reset}
          className="rounded-full bg-slate-200 px-4 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-300"
        >
          🔄 Reset
        </button>
      </div>
      {history.length > 0 && (
        <p className="font-mono text-sm text-slate-500">
          You did: {history.join(" ")}
        </p>
      )}
    </div>
  );
}
