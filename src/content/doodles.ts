export type Doodle = { id: string; name: string; paths: string[] }

// Coordinates are normalized to the canvas, so guides and strokes stay aligned on resize.
export const doodles: Doodle[] = [
  { id: 'sun', name: 'Sun', paths: ['M50 32a18 18 0 1 0 0 36a18 18 0 1 0 0-36', 'M50 18v7 M50 75v7 M18 50h7 M75 50h7 M27 27l5 5 M68 68l5 5 M73 27l-5 5 M32 68l-5 5', 'M43 46h.1 M57 46h.1 M43 55q7 7 14 0'] },
  { id: 'house', name: 'House', paths: ['M22 48L50 23l28 25 M29 43v34h42V43 M44 77V58h12v19 M34 49h8v8h-8z M58 49h8v8h-8z', 'M63 33v-8h8v15'] },
  { id: 'flower', name: 'Flower', paths: ['M50 46a7 7 0 1 0 0-14a7 7 0 1 0 0 14', 'M50 32c-12-20-24-5-10 2c-20-8-22 10-2 10c-16 9-5 21 6 7c-1 19 15 19 14 0c11 14 22 2 6-7c20 0 18-18-2-10c14-7 2-22-10-2', 'M50 53v28 M50 68q-14-13-19-3q8 11 19 8 M50 73q14-13 19-3q-8 11-19 8'] },
  { id: 'fish', name: 'Fish', paths: ['M24 50q15-25 43-13l12-9v44l-12-9Q39 75 24 50z', 'M57 38q-9 12 0 24 M38 46h.1 M29 52q5 5 10 1 M49 37l6-9 8 8 M49 63l6 9 8-8'] },
]
