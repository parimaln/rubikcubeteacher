import { useEffect, useRef, useState } from "react";
import { TwistyPlayer } from "cubing/twisty";
import { Alg } from "cubing/alg";

export interface CubeViewerProps {
  /** Moves to animate (SiGN/WCA notation). Empty string shows a static cube. */
  alg?: string;
  /**
   * Cube state before the alg plays. Pass a move sequence, or "inverse" to
   * auto-compute the inverse of `alg` (so the animation always ends solved).
   */
  setup?: string | "inverse";
  /** Whole-cube rotation applied before the setup, e.g. "z2" for yellow-on-top lessons. */
  frame?: string;
  /** Dim stickers that don't matter for this lesson (e.g. "Cross", "F2L", "OLL", "PLL"). */
  stickering?: string;
  /** Custom per-piece mask string (experimentalStickeringMaskOrbits). Overrides stickering. */
  mask?: string;
  /** Show the built-in play/step control bar. Default true when there's an alg. */
  controls?: boolean;
  /** Show a mirrored view of the back of the cube. */
  backView?: boolean;
  /** Camera vertical angle in degrees. Positive looks down at the top face. */
  cameraLatitude?: number;
  /** Show the speed (tempo) picker. Default true when controls are shown. */
  speedControl?: boolean;
  className?: string;
}

const SPEEDS = [
  { label: "🐢 Slow", value: 0.4 },
  { label: "▶️ Normal", value: 0.9 },
  { label: "🐇 Fast", value: 2.5 },
];

/** React wrapper around cubing.js's <twisty-player> 3D cube. */
export default function CubeViewer({
  alg = "",
  setup,
  frame,
  stickering,
  mask,
  controls,
  backView = false,
  cameraLatitude,
  speedControl,
  className = "",
}: CubeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);
  const [speed, setSpeed] = useState(0.9);

  const showControls = controls ?? alg.trim().length > 0;
  const showSpeed = (speedControl ?? showControls) && alg.trim().length > 0;
  const setupPart =
    setup === "inverse" ? new Alg(alg).invert().toString() : (setup ?? "");
  const setupAlg = [frame, setupPart].filter(Boolean).join(" ");

  useEffect(() => {
    const player = new TwistyPlayer({
      puzzle: "3x3x3",
      background: "none",
      hintFacelets: "none",
    });
    playerRef.current = player;
    containerRef.current?.appendChild(player);
    return () => {
      player.remove();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    player.alg = alg;
    player.experimentalSetupAlg = setupAlg;
    player.controlPanel = showControls ? "bottom-row" : "none";
    player.backView = backView ? "top-right" : "none";
    if (mask) {
      player.experimentalStickeringMaskOrbits = mask;
    } else {
      player.experimentalStickering = stickering ?? "full";
    }
    if (cameraLatitude !== undefined) {
      player.cameraLatitude = cameraLatitude;
    }
    player.jumpToStart();
  }, [alg, setupAlg, showControls, backView, stickering, mask, cameraLatitude]);

  useEffect(() => {
    if (playerRef.current) playerRef.current.tempoScale = speed;
  }, [speed]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div ref={containerRef} className="min-h-0 w-full flex-1" />
      {showSpeed && (
        <div className="mt-1 flex justify-center gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSpeed(s.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                speed === s.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-500 hover:bg-indigo-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Imperative helper: play a one-off alg on a player-less page (notation playground). */
export { TwistyPlayer };
