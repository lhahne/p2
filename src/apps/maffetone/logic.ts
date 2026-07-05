export interface MafResult {
  ceiling: number;
  zoneLow: number;
  zoneHigh: number;
  note: string | null;
}

const YOUTH_CEILING = 165;
const YOUTH_AGE_MAX = 16;
const SENIOR_AGE_MIN = 65;

export function computeMaf(age: number, modifier: number): MafResult {
  if (age <= YOUTH_AGE_MAX) {
    return {
      ceiling: YOUTH_CEILING,
      zoneLow: YOUTH_CEILING - 10,
      zoneHigh: YOUTH_CEILING,
      note:
        "Athletes 16 and under should use a fixed 165 bpm ceiling instead of the 180 − age formula.",
    };
  }

  const ceiling = 180 - age + modifier;
  const note =
    age >= SENIOR_AGE_MIN
      ? "Athletes over ~65 may need further individualized adjustment (up to +10 bpm with appropriate medical supervision per Maffetone)."
      : null;

  return {
    ceiling,
    zoneLow: ceiling - 10,
    zoneHigh: ceiling,
    note,
  };
}
