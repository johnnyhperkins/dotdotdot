import { COLORS } from './colors';

export const LEVELS = {
  1: {
    dotsToPop: 15,
    dotsPopped: {
      0: 0
    },
    movesRemaining: 10,
    dotColorsToPop: [COLORS[0]],
    dotColorsToPopIds: [0],
  }, 
  2: {
    dotsToPop: 15,
    dotsPopped: {
      0: 0,
      1: 0
    },
    movesRemaining: 15,
    dotColorsToPop: [COLORS[0], COLORS[1]],
    dotColorsToPopIds: [0,1],
  }, 
  3: {
    dotsToPop: 15,
    dotsPopped: {
      0: 0,
      1: 0,
      2: 0
    },
    movesRemaining: 15,
    dotColorsToPop: [COLORS[0], COLORS[1], COLORS[2]],
    dotColorsToPopIds: [0,1,2],
  }, 
  4: {
    dotsToPop: 10,
    dotsPopped: {
      0: 0,
      1: 0,
      2: 0,
      3: 0
    },
    movesRemaining: 20,
    dotColorsToPop: COLORS,
    dotColorsToPopIds: [0,1,2,3],
  }, 
  5: {
    dotsToPop: 1,
    dotsPopped: {
      0: 0,
      1: 0,
      2: 0
    },
    movesRemaining: 30,
    dotColorsToPop: [COLORS[0], COLORS[1], COLORS[2]],
    dotColorsToPopIds: [0,1,2],
  }, 
}