import { useMemo, useState } from "react";
import { Alg } from "cubing/alg";
import CubeViewer from "../components/CubeViewer";
import { OLL_CASES, PLL_CASES } from "../curriculum/algData";
import { MASK_OLL, MASK_PLL } from "../curriculum/masks";

type Tab = "pll" | "oll" | "trainer";

const FRAME = "z2";

interface CaseItem {
  id: string;
  name: string;
  alg: string;
  mask: string;
  group: string;
  description?: string;
}

const PLL_ITEMS: CaseItem[] = PLL_CASES.map((c) => ({
  id: `pll-${c.name}`,
  name: `${c.name}-perm`,
  alg: c.alg,
  mask: MASK_PLL,
  group: "PLL",
  description: c.description,
}));

const OLL_ITEMS: CaseItem[] = OLL_CASES.map((c, i) => ({
  id: `oll-${i}`,
  name: c.name,
  alg: c.alg,
  mask: MASK_OLL,
  group: c.shape,
}));

const OLL_GROUPS = ["Cross", "L-shape", "Line", "Dot"] as const;
const GROUP_BLURB: Record<string, string> = {
  Cross: "Edges already oriented — only corners left. Your 2-look friends live here!",
  "L-shape": "Two neighboring edges flipped (the yellow L).",
  Line: "Two opposite edges flipped (the yellow line).",
  Dot: "All four edges flipped — the long-haul cases.",
};

function CaseCard({
  item,
  open,
  onToggle,
}: {
  item: CaseItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="font-extrabold text-slate-800">{item.name}</span>
        <span className="text-xl">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4">
          <CubeViewer
            alg={item.alg}
            setup="inverse"
            frame={FRAME}
            mask={item.mask}
            className="h-64"
          />
          {item.description && (
            <p className="mt-2 text-center text-sm font-semibold text-slate-500">
              {item.description}
            </p>
          )}
          <p className="mt-2 rounded-xl bg-slate-50 p-2 text-center font-mono text-sm font-bold text-slate-700">
            {item.alg}
          </p>
        </div>
      )}
    </div>
  );
}

function Trainer() {
  const [set, setSet] = useState<"pll" | "ocll">("pll");
  const pool = useMemo(
    () =>
      set === "pll" ? PLL_ITEMS : OLL_ITEMS.filter((c) => c.group === "Cross"),
    [set],
  );
  const [index, setIndex] = useState(() => Math.floor(Math.random() * pool.length));
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const item = pool[index % pool.length];

  function next(gotIt: boolean | null) {
    if (gotIt !== null) {
      setScore((s) => ({ right: s.right + (gotIt ? 1 : 0), total: s.total + 1 }));
    }
    setRevealed(false);
    setIndex(Math.floor(Math.random() * pool.length));
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex justify-center gap-2">
        {(
          [
            ["pll", "PLL (21)"],
            ["ocll", "OLL corners (7)"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setSet(key);
              setRevealed(false);
              setIndex(0);
            }}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              set === key
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-indigo-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-md">
        <p className="mb-2 text-center font-bold text-slate-500">
          Which case is this — and what's the algorithm?
        </p>
        <CubeViewer
          key={`${item.id}-${revealed}`}
          alg={revealed ? item.alg : ""}
          setup={revealed ? "inverse" : new Alg(item.alg).invert().toString()}
          frame={FRAME}
          mask={item.mask}
          className="h-64"
        />
        {!revealed ? (
          <div className="mt-3 text-center">
            <button
              onClick={() => setRevealed(true)}
              className="rounded-2xl bg-indigo-600 px-6 py-3 font-extrabold text-white shadow-md hover:bg-indigo-500"
            >
              🔍 Reveal
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-3 text-center">
            <p className="text-xl font-extrabold text-slate-800">{item.name}</p>
            <p className="rounded-xl bg-slate-50 p-2 font-mono text-sm font-bold text-slate-700">
              {item.alg}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => next(true)}
                className="rounded-2xl bg-green-500 px-5 py-2 font-extrabold text-white hover:bg-green-400"
              >
                ✅ I knew it!
              </button>
              <button
                onClick={() => next(false)}
                className="rounded-2xl bg-amber-400 px-5 py-2 font-extrabold text-slate-900 hover:bg-amber-300"
              >
                🤔 Still learning
              </button>
            </div>
          </div>
        )}
      </div>
      {score.total > 0 && (
        <p className="mt-3 text-center font-bold text-slate-500">
          Session score: {score.right}/{score.total} 🎯
        </p>
      )}
    </div>
  );
}

export default function AlgLibraryPage() {
  const [tab, setTab] = useState<Tab>("pll");
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-slate-900">
        📖 Algorithm Library
      </h1>
      <p className="mb-6 text-center font-semibold text-slate-500">
        Every algorithm here is machine-verified. Tap a case to see it animated.
      </p>

      <div className="mb-6 flex justify-center gap-2">
        {(
          [
            ["pll", "PLL — 21 cases"],
            ["oll", "OLL — 57 cases"],
            ["trainer", "🎴 Trainer"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 font-bold ${
              tab === key
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-indigo-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pll" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {PLL_ITEMS.map((item) => (
            <CaseCard
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      )}

      {tab === "oll" && (
        <div className="space-y-6">
          <p className="rounded-2xl bg-amber-50 p-3 text-center text-sm font-semibold text-amber-800">
            💡 Cases are grouped by the yellow shape on top. Remember: 2-look OLL
            (Level 3) already solves every one of these — learn full algorithms
            at your own pace!
          </p>
          {OLL_GROUPS.map((group) => {
            const items = OLL_ITEMS.filter((c) => c.group === group);
            return (
              <div key={group}>
                <h2 className="mb-1 text-xl font-extrabold text-slate-800">
                  {group} <span className="text-sm font-bold text-slate-400">({items.length})</span>
                </h2>
                <p className="mb-2 text-sm font-semibold text-slate-500">
                  {GROUP_BLURB[group]}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((item) => (
                    <CaseCard
                      key={item.id}
                      item={item}
                      open={openId === item.id}
                      onToggle={() =>
                        setOpenId(openId === item.id ? null : item.id)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "trainer" && <Trainer />}
    </div>
  );
}
