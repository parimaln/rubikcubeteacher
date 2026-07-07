// Custom stickering masks (experimentalStickeringMaskOrbits) that isolate the
// pieces each Level-1 stage cares about, in the white-cross-DOWN teaching frame.
//
// Piece order (cubing.js 3x3 kpuzzle):
//   EDGES:   UF UR UB UL DF DR DB DL FR FL BR BL   (0-3 white, 4-7 yellow, 8-11 middle)
//   CORNERS: UFR UBR UBL UFL DFR DFL DBL DBR       (0-3 white, 4-7 yellow)
//   CENTERS: U L F R B D
// Mask chars: "-" regular · "D" dim (solved, in the background) ·
//             "I" ignored (not solved yet — gray) · "O" show only the U/D sticker color

/** Daisy: only the white side of the white edges matters. */
export const MASK_DAISY = "EDGES:OOOOIIIIIIII,CORNERS:IIIIIIII,CENTERS:------";

/** White cross: white edges in full color, everything else gray. */
export const MASK_CROSS = "EDGES:----IIIIIIII,CORNERS:IIIIIIII,CENTERS:------";

/** White corners: cross done (dim), white corners in focus. */
export const MASK_WHITE_CORNERS =
  "EDGES:DDDDIIIIIIII,CORNERS:----IIII,CENTERS:------";

/** Middle layer: bottom layer done (dim), middle edges in focus. */
export const MASK_MIDDLE =
  "EDGES:DDDDIIII----,CORNERS:DDDDIIII,CENTERS:------";

/** Yellow cross: only yellow-ness of top edges matters; top corners not yet. */
export const MASK_YELLOW_CROSS =
  "EDGES:DDDDOOOODDDD,CORNERS:DDDDIIII,CENTERS:------";

/** Position yellow edges: their side colors matter now; corners still later. */
export const MASK_LL_EDGES =
  "EDGES:DDDD----DDDD,CORNERS:DDDDIIII,CENTERS:------";

/** Position yellow corners: full corner colors in focus, edges done. */
export const MASK_LL_CORNERS_POS =
  "EDGES:DDDDDDDDDDDD,CORNERS:DDDD----,CENTERS:------";

/** Twist yellow corners: corners placed, only yellow-side orientation left. */
export const MASK_LL_CORNERS_ORI =
  "EDGES:DDDDDDDDDDDD,CORNERS:DDDDOOOO,CENTERS:------";

/**
 * F2L: focus one corner-edge pair (the physical front-right slot in the z2
 * teaching frame = edge piece FL(9) + corner piece UFL(3)); cross dimmed,
 * last layer ignored.
 */
export const MASK_F2L_SLOT =
  "EDGES:DDDDIIIID-DD,CORNERS:DDD-IIII,CENTERS:------";

/** OLL: first two layers done; only the yellow side of LL pieces matters. */
export const MASK_OLL = "EDGES:DDDDOOOODDDD,CORNERS:DDDDOOOO,CENTERS:------";

/** PLL: first two layers done; full colors on the last layer. */
export const MASK_PLL = "EDGES:DDDD----DDDD,CORNERS:DDDD----,CENTERS:------";
