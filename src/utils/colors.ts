function normalizeProcessId(processId: number): number {
  return Math.abs(Math.trunc(processId));
}

export function getProcessColor(processId: number): string {
  const normalizedId = normalizeProcessId(processId);
  const hue = ((normalizedId - 1) * 18 + 210) % 360;

  return `hsl(${hue} 70% 55%)`;
}
