// Curriculum fact-checker: applies algorithms with cubing.js's kpuzzle engine
// and reports what they actually do to the cube, so lesson claims stay honest.
//
// Usage:
//   node scripts/check-alg.mjs top "z2 F R U R' U' F'"   # U-face sticker map after alg
//   node scripts/check-alg.mjs effect "R U R' U' ..."     # which pieces move/twist
//   node scripts/check-alg.mjs solved "z2 <setup> <alg>"  # does it end solved?

import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";

const kp = await cube3x3x3.kpuzzle();

const EDGE_NAMES = ["UF","UR","UB","UL","DF","DR","DB","DL","FR","FL","BR","BL"];
const CORNER_NAMES = ["UFR","UBR","UBL","UFL","DFR","DFL","DBL","DBR"];

function pattern(algStr) {
  return kp.defaultPattern().applyAlg(new Alg(algStr)).patternData;
}

// A piece "shows its U/D sticker upward" in a U slot iff orientation === 0.
// U-layer pieces are 0..3 (white side), D-layer pieces 4..7 (yellow side).
// After a z2/x2 setup the U center is yellow, so "matches U center" means the
// piece's U/D sticker color equals the current U center color.
function topView(algStr) {
  const p = pattern(algStr);
  const uCenterPiece = p.CENTERS.pieces[0]; // 0=white(U), 5=yellow(D) in ULFRBD? verify below
  // Center order: determine by which piece sits in U slot; piece colors:
  // centers order in def is U,L,F,R,B,D -> colors white,orange,green,red,blue,yellow
  const centerColors = ["white", "orange", "green", "red", "blue", "yellow"];
  const uColor = centerColors[uCenterPiece];
  const isU = (orbit, slot) => {
    const piece = p[orbit].pieces[slot];
    const ori = p[orbit].orientation[slot];
    if (ori !== 0) return false;
    const pieceUDColor =
      orbit === "EDGES"
        ? piece <= 3
          ? "white"
          : piece <= 7
            ? "yellow"
            : null // E-layer edge: no U/D sticker
        : piece <= 3
          ? "white"
          : "yellow";
    return pieceUDColor === uColor;
  };
  // Also, an E-layer edge in a U slot never shows a U/D color up.
  const c = (slot) => (isU("CORNERS", slot) ? "■" : "·");
  const e = (slot) => (isU("EDGES", slot) ? "■" : "·");
  console.log(`U face (looking down), ■ = matches U center (${uColor}):`);
  console.log(`  ${c(2)} ${e(2)} ${c(1)}   <- back row`);
  console.log(`  ${e(3)} ■ ${e(1)}`);
  console.log(`  ${c(3)} ${e(0)} ${c(0)}   <- front row`);
}

function effect(algStr) {
  const p = pattern(algStr);
  const moved = { EDGES: [], CORNERS: [] };
  const names = { EDGES: EDGE_NAMES, CORNERS: CORNER_NAMES };
  for (const orbit of ["EDGES", "CORNERS"]) {
    p[orbit].pieces.forEach((piece, slot) => {
      const ori = p[orbit].orientation[slot];
      if (piece !== slot || ori !== 0) {
        moved[orbit].push(
          `${names[orbit][slot]}<=${names[orbit][piece]}${ori ? ` (twist ${ori})` : ""}`,
        );
      }
    });
  }
  const centersMoved = p.CENTERS.pieces.some((x, i) => x !== i);
  console.log("edges:  ", moved.EDGES.join("  ") || "(none)");
  console.log("corners:", moved.CORNERS.join("  ") || "(none)");
  console.log("centers moved (net rotation):", centersMoved);
}

function solved(algStr) {
  const p = pattern(algStr);
  const ok =
    p.EDGES.pieces.every((x, i) => x === i && p.EDGES.orientation[i] === 0) &&
    p.CORNERS.pieces.every((x, i) => x === i && p.CORNERS.orientation[i] === 0);
  console.log(ok ? "SOLVED (ignoring rotation-free centers check)" : "NOT solved");
  if (!ok) effect(algStr);
}

const [, , cmd, alg] = process.argv;
if (cmd === "top") topView(alg);
else if (cmd === "effect") effect(alg);
else if (cmd === "solved") solved(alg);
else console.log("usage: check-alg.mjs top|effect|solved '<alg>'");
