import type { ReactNode } from "react";

/** Render lesson text, turning backtick-wrapped tokens into move chips: "do `R U R'`". */
export function renderText(text: string): ReactNode[] {
  const parts = text.split("`");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="move">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function formatMs(ms: number): string {
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) return totalSeconds.toFixed(2);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
}
