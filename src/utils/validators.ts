export function isValidArrival(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

export function isValidBurst(value: number): boolean {
  return Number.isFinite(value) && value >= 1;
}

export function isValidPriority(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value);
}

export function isValidQuantum(value: number): boolean {
  return Number.isFinite(value) && value >= 1;
}
