// Generates verified OLL + PLL data for the algorithm library.
//
// PLL: verifies each hand-written alg is a pure U-layer permutation (no
// orientation change, F2L untouched) and that its permutation structure
// matches the case's canonical definition.
//
// OLL: enumerates every last-layer orientation class (57 + solved), then
// assigns each class an alg from the hand-written bank (self-classified by
// applying it with the engine — no trust in labels), falling back to a
// verified composite (edge-orientation alg + U offset + corner alg).
//
// Output: src/curriculum/algData.ts

import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";
import { writeFileSync } from "node:fs";

const kp = await cube3x3x3.kpuzzle();

function apply(algStr) {
  return kp.defaultPattern().applyAlg(new Alg(algStr)).patternData;
}

function isIdentityOutsideU(p) {
  for (let i = 4; i < 12; i++) {
    if (p.EDGES.pieces[i] !== i || p.EDGES.orientation[i] !== 0) return false;
  }
  for (let i = 4; i < 8; i++) {
    if (p.CORNERS.pieces[i] !== i || p.CORNERS.orientation[i] !== 0) return false;
  }
  if (p.CENTERS.pieces.some((x, i) => x !== i)) return false;
  return true;
}

// ---------- PLL ----------

// Canonical permutation structure per case, written as cycles of slot names.
// Edge slots: UF UR UB UL (0-3). Corner slots: UFR UBR UBL UFL (0-3).
const E = { UF: 0, UR: 1, UB: 2, UL: 3 };
const C = { UFR: 0, UBR: 1, UBL: 2, UFL: 3 };

const PLL_BANK = [
  // [name, alg, description]
  ["Aa", "x R' U R' D2 R U' R' D2 R2 x'", "Three corners cycle; edges rest."],
  ["Ab", "x R2 D2 R U R' D2 R U' R x'", "Mirror of Aa — corners cycle the other way."],
  ["E", "x' R U' R' D R U R' D' R U R' D R U' R' D' x", "All four corners trade left-to-right; edges rest."],
  ["F", "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", "One edge pair and one corner pair swap across."],
  ["Ga", "R2 U R' U R' U' R U' R2 U' D R' U R D'", "Corners and edges both cycle — the G family."],
  ["Gb", "R' U' R U D' R2 U R' U R U' R U' R2 D", "G family."],
  ["Gc", "R2 U' R U' R U R' U R2 U D' R U' R' D", "G family."],
  ["Gd", "R U R' U' D R2 U' R U' R' U R' U R2 D'", "G family."],
  ["H", "M2 U M2 U2 M2 U M2", "Both pairs of opposite edges swap."],
  ["Ja", "x R2 F R F' R U2 r' U r U2 x'", "A corner pair and an edge pair swap, side by side."],
  ["Jb", "R U R' F' R U R' U' R' F R2 U' R'", "Mirror of Ja."],
  ["Na", "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", "Diagonal corner swap + opposite edge swap."],
  ["Nb", "R' U R U' R' F' U' F R U R' F R' F' R U' R", "Mirror of Na."],
  ["Ra", "R U' R' U' R U R D R' U' R D' R' U2 R'", "Corner pair + edge pair swap."],
  ["Rb", "R2 F R U R U' R' F' R U2 R' U2 R", "Mirror of Ra."],
  ["T", "R U R' U' R' F R2 U' R' U' R U R' F'", "Right corners swap + left-right edges swap."],
  ["Ua", "R U' R U R U R U' R' U' R2", "Three edges cycle; corners rest."],
  ["Ub", "R2 U R U R' U' R' U' R' U R'", "Three edges cycle the other way."],
  ["V", "R' U R' U' y R' F' R2 U' R' U R' F R F y'", "Diagonal corner swap + adjacent edge swap."],
  ["Y", "F R U' R' U' R U R' F' R U R' U' R' F R F'", "Diagonal corner swap + adjacent edge swap."],
  ["Z", "M' U M2 U M2 U M' U2 M2 U'", "Both pairs of neighboring edges swap."],
];

function permSignature(p) {
  // Only U-layer permutation, orientations must be zero.
  const edges = p.EDGES.pieces.slice(0, 4);
  const corners = p.CORNERS.pieces.slice(0, 4);
  const eo = p.EDGES.orientation.slice(0, 4);
  const co = p.CORNERS.orientation.slice(0, 4);
  return { edges, corners, pure: eo.every((x) => x === 0) && co.every((x) => x === 0) };
}

function cycleStructure(perm) {
  const seen = new Set();
  const cycles = [];
  for (let i = 0; i < perm.length; i++) {
    if (seen.has(i) || perm[i] === i) continue;
    const cyc = [i];
    seen.add(i);
    let j = perm[i];
    while (j !== i) {
      cyc.push(j);
      seen.add(j);
      j = perm[j];
    }
    cycles.push(cyc.length);
  }
  return cycles.sort().join(",");
}

// Expected cycle structures per case family.
const EXPECTED = {
  Aa: ["", "3"], Ab: ["", "3"], E: ["", "2,2"], F: ["2", "2"],
  Ga: ["3", "3"], Gb: ["3", "3"], Gc: ["3", "3"], Gd: ["3", "3"],
  H: ["2,2", ""], Ja: ["2", "2"], Jb: ["2", "2"], Na: ["2", "2"], Nb: ["2", "2"],
  Ra: ["2", "2"], Rb: ["2", "2"], T: ["2", "2"], Ua: ["3", ""], Ub: ["3", ""],
  V: ["2", "2"], Y: ["2", "2"], Z: ["2,2", ""],
};

const US_ADJ = ["", "U", "U2", "U'"];

const pllResults = [];
let pllOk = true;
for (const [name, alg, description] of PLL_BANK) {
  const [wantE, wantC] = EXPECTED[name];
  // Normalize AUF: find pre/post U offsets making the alg a pure exact PLL
  // whose cycle structure matches the case family.
  let found = null;
  outer: for (const pre of US_ADJ) {
    for (const post of US_ADJ) {
      const cand = [pre, alg, post].filter(Boolean).join(" ");
      const p = apply(cand);
      if (!isIdentityOutsideU(p)) continue;
      const sig = permSignature(p);
      if (!sig.pure) continue;
      if (cycleStructure(sig.edges) !== wantE) continue;
      if (cycleStructure(sig.corners) !== wantC) continue;
      found = { cand, sig };
      break outer;
    }
  }
  if (!found) {
    console.error(`PLL ${name}: no AUF variant matches structure edges[${wantE}] corners[${wantC}] FAIL`);
    pllOk = false;
    continue;
  }
  pllResults.push({ name, alg: found.cand, description, sig: found.sig });
  console.log(`PLL ${name}: OK${found.cand !== alg ? " (AUF-adjusted)" : ""}`);
}
if (pllResults.length !== 21) {
  console.error(`PLL: only ${pllResults.length}/21 verified`);
  pllOk = false;
}

// Distinctness: no two cases may be the same permutation up to U-rotation.
function pllClassKey(sig) {
  // canonicalize under conjugation by U^m
  const rotPerm = (perm) => {
    // conjugate by U: newPerm[rot(i)] = rot(perm[i]), where rot maps slot i -> U(i).
    // U turn slot mapping (from rotateSig): slot contents cycle 0<-1<-2<-3, so
    // the piece IN slot 1 moves to slot 0, i.e. U(1)=0: U maps i -> (i+3)%4.
    const rot = (i) => (i + 3) % 4;
    const out = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) out[rot(i)] = rot(perm[i]);
    return out;
  };
  let e = sig.edges.slice();
  let c = sig.corners.slice();
  let best = null;
  for (let m = 0; m < 4; m++) {
    const key = e.join("") + "|" + c.join("");
    if (best === null || key < best) best = key;
    e = rotPerm(e);
    c = rotPerm(c);
  }
  return best;
}
const seenPll = new Map();
for (const r of pllResults) {
  const key = pllClassKey(r.sig);
  if (seenPll.has(key)) {
    console.error(`PLL ${r.name} is the SAME case as ${seenPll.get(key)}!`);
    pllOk = false;
  }
  seenPll.set(key, r.name);
}

// ---------- OLL ----------

// Orientation class of the case an alg SOLVES = orientation of inverse state.
function ollSignatureOfInverse(algStr) {
  const p = apply(new Alg(algStr).invert().toString());
  return {
    eo: p.EDGES.orientation.slice(0, 4),
    co: p.CORNERS.orientation.slice(0, 4),
  };
}

// Rotate a signature by one U turn (for canonicalization).
// U moves slot contents: UF<-UR? Determined empirically below.
function rotateSig(sig) {
  // U turn: piece at UF goes to UL, UR->UF, UB->UR, UL->UB (empirical: U cycles
  // slots 0<-1<-2<-3<-0). Corner slots same indices order UFR,UBR,UBL,UFL:
  // UFR<-UBR, UBR<-UBL, UBL<-UFL, UFL<-UFR.
  const rot = (a) => [a[1], a[2], a[3], a[0]];
  return { eo: rot(sig.eo), co: rot(sig.co) };
}

function canonical(sig) {
  let best = null;
  let s = sig;
  for (let i = 0; i < 4; i++) {
    const key = s.eo.join("") + "|" + s.co.join("");
    if (best === null || key < best.key) best = { key, sig: s, rot: i };
    s = rotateSig(s);
  }
  return best;
}

// Verify a candidate alg is a valid OLL solution for a given signature class:
// applying it to a state with that orientation must orient everything, touch
// nothing outside U. We check: alg's own effect touches only U layer, and
// inverse-state signature canonically equals the class.
function checkOllAlg(algStr) {
  const p = apply(algStr);
  if (!isIdentityOutsideU(p)) return null;
  return ollSignatureOfInverse(algStr);
}

// Hand-written bank of well-known OLL algs (self-classified by the engine).
const OLL_BANK = [
  ["Sune", "R U R' U R U2 R'"],
  ["Antisune", "R U2 R' U' R U' R'"],
  ["H (double Sune)", "R U R' U R U' R' U R U2 R'"],
  ["Pi", "R U2 R2 U' R2 U' R2 U2 R"],
  ["Headlights", "R2 D R' U2 R D' R' U2 R'"],
  ["T (chameleon)", "r U R' U' r' F R F'"],
  ["Bowtie", "F' r U R' U' r' F R"],
  ["Cross-line", "F R U R' U' F'"],
  ["Cross-L", "F U R U' R' F'"],
  ["T-shape", "R U R' U' R' F R F'"],
  ["Dot", "R U2 R2 F R F' U2 R' F R F'"],
  ["Fish (kite)", "R U R' U' R' F R2 U R' U' F'"],
  ["W", "R U R' U R U' R' U' R' F R F'"],
  ["P (couch)", "R' U' F U R U' R' F' R"],
  ["Square-left", "r' U2 R U R' U r"],
  ["Square-right", "r U2 R' U' R U' r'"],
  ["Small lightning", "r U R' U R U2 r'"],
  ["Small lightning 2", "r' U' R U' R' U2 r"],
  ["C-shape", "R U R2 U' R' F R U R U' F'"],
  ["Knight move", "F U R U' R2 F' R U R U' R'"],
];

const bankBySig = new Map();
for (const [name, alg] of OLL_BANK) {
  const sig = checkOllAlg(alg);
  if (!sig) {
    console.error(`OLL bank "${name}": INVALID (touches F2L) — dropped`);
    continue;
  }
  const canon = canonical(sig);
  if (!bankBySig.has(canon.key)) {
    bankBySig.set(canon.key, { name, alg, sig });
  }
}
console.log(`OLL bank: ${bankBySig.size} distinct classes covered directly`);

// Enumerate ALL orientation classes: eo in {0,1}^4 with even sum, co in {0,1,2}^4 with sum%3==0.
const allClasses = new Map();
for (let e = 0; e < 16; e++) {
  const eo = [e & 1, (e >> 1) & 1, (e >> 2) & 1, (e >> 3) & 1];
  if (eo.reduce((a, b) => a + b) % 2) continue;
  for (let c = 0; c < 81; c++) {
    const co = [c % 3, Math.floor(c / 3) % 3, Math.floor(c / 9) % 3, Math.floor(c / 27) % 3];
    if (co.reduce((a, b) => a + b) % 3) continue;
    const canon = canonical({ eo, co });
    if (!allClasses.has(canon.key)) allClasses.set(canon.key, canon.sig);
  }
}
allClasses.delete("0000|0000"); // solved
console.log(`Total OLL classes: ${allClasses.size} (expected 57)`);

// Composite fallback: EO stage + AUF + OCLL stage, engine-searched.
const EO_ALGS = [
  "",
  "F R U R' U' F'",
  "F U R U' R' F'",
  // dot fix (flips all four edges), verified in scripts/check-alg.mjs work:
  "F R U R' U' F' U2 F R U R' U' F' F R U R' U' F'",
];
const OCLL_ALGS = [
  "",
  "R U R' U R U2 R'",
  "R U2 R' U' R U' R'",
  "R U R' U R U' R' U R U2 R'",
  "R U2 R2 U' R2 U' R2 U2 R",
  "R2 D R' U2 R D' R' U2 R'",
  "r U R' U' r' F R F'",
  "F' r U R' U' r' F R",
];
const US = ["", "U", "U2", "U'"];

function sigKey(sig) {
  return canonical(sig).key;
}

// Precompute: does candidate solve class? candidate solves class X iff
// inverse(candidate) state's signature ≡ X (canonically). We search composites.
function findComposite(targetKey) {
  for (const u1 of US) {
    for (const eo of EO_ALGS) {
      for (const u2 of US) {
        for (const oc of OCLL_ALGS) {
          const alg = [u1, eo, u2, oc].filter(Boolean).join(" ");
          if (!alg) continue;
          const sig = checkOllAlg(alg);
          if (sig && sigKey(sig) === targetKey) return alg;
        }
      }
    }
  }
  return null;
}

const SHAPE_NAMES = {
  "0": "Cross", // 0 flipped edges
  "2": "Corner-shape", // 2 adjacent
  "2o": "Line", // 2 opposite
  "4": "Dot",
};

function shapeOf(eo) {
  const flipped = eo.reduce((a, b) => a + b);
  if (flipped === 0) return "Cross";
  if (flipped === 4) return "Dot";
  // adjacent or opposite?
  const idx = eo.map((x, i) => (x ? i : -1)).filter((i) => i >= 0);
  return (idx[1] - idx[0]) % 2 === 0 ? "Line" : "L-shape";
}

const ollResults = [];
let counters = {};
let missing = 0;
for (const [key, sig] of allClasses) {
  const bank = bankBySig.get(key);
  const shape = shapeOf(sig.eo);
  counters[shape] = (counters[shape] ?? 0) + 1;
  let name, alg;
  if (bank) {
    name = bank.name;
    alg = bank.alg;
  } else {
    alg = findComposite(key);
    name = `${shape} ${counters[shape]}`;
    if (!alg) {
      console.error(`NO SOLUTION FOUND for class ${key}`);
      missing++;
      continue;
    }
  }
  ollResults.push({ name, alg, shape, key });
}
console.log(`OLL: ${ollResults.length} classes solved, ${missing} missing`);

if (!pllOk || missing > 0 || ollResults.length !== 57) {
  console.error("VERIFICATION FAILED — not writing output");
  process.exit(1);
}

// Order: crosses (corners-only) first, then L-shapes, lines, dots.
const shapeOrder = { Cross: 0, "L-shape": 1, Line: 2, Dot: 3 };
ollResults.sort((a, b) => shapeOrder[a.shape] - shapeOrder[b.shape] || a.name.localeCompare(b.name));

const out = `// AUTO-GENERATED by scripts/gen-algs.mjs — every algorithm verified with the
// cubing.js kpuzzle engine. Do not edit by hand; edit the generator and rerun.

export interface PllCase {
  name: string;
  alg: string;
  description: string;
}

export interface OllCase {
  name: string;
  alg: string;
  /** Edge-flip shape group: Cross (edges done), L-shape, Line, Dot. */
  shape: "Cross" | "L-shape" | "Line" | "Dot";
}

export const PLL_CASES: PllCase[] = ${JSON.stringify(
  pllResults.map(({ name, alg, description }) => ({ name, alg, description })),
  null,
  2,
)};

export const OLL_CASES: OllCase[] = ${JSON.stringify(
  ollResults.map(({ name, alg, shape }) => ({ name, alg, shape })),
  null,
  2,
)};
`;
writeFileSync("src/curriculum/algData.ts", out);
console.log("Wrote src/curriculum/algData.ts");
