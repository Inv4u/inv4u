export interface Stat {
  /** The number/figure, e.g. "1,200" or "97%". */
  value: string;
  /** What it measures, e.g. "מוזמנים שקיבלו הזמנה". */
  label: string;
}

/**
 * Real social-proof numbers — ONE place to edit.
 *
 * HOW TO ACTIVATE: add objects to this array. The stats strip renders
 * automatically once it is non-empty, and stays hidden while empty.
 *
 * Do NOT put aspirational or made-up numbers here — real figures only.
 */
export const stats: Stat[] = [];
