function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
}

export function formatTime(value: number): string {
  return trimTrailingZeros(roundTo(value, 2).toFixed(2));
}

export function formatAverage(value: number): number {
  return roundTo(value, 2);
}
