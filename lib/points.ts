export const POINTS_PER_RUPEE = 1000;

export function pointsToRupees(points: number) {
  return Math.floor(points / POINTS_PER_RUPEE);
}

export function rupeesToPoints(rupees: number) {
  return rupees * POINTS_PER_RUPEE;
}
