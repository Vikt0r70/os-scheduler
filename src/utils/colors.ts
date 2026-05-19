const processColors = [
  '#60a5fa', // blue (P1)
  '#fb7185', // rose (P2)
  '#34d399', // emerald (P3)
  '#fbbf24', // amber (P4)
  '#a78bfa', // purple (P5)
  '#5eead4', // teal (P6)
  '#f472b6', // pink (P7)
  '#f87171', // red (P8)
  '#22d3ee', // cyan (P9)
  '#a3e635', // lime (P10)
  '#fb923c', // orange (P11)
  '#c084fc', // violet (P12)
  '#2dd4bf', // turquoise (P13)
  '#e879f9', // fuchsia (P14)
  '#fde047', // yellow (P15)
  '#6ee7b7', // mint (P16)
  '#fda4af', // light rose (P17)
  '#93c5fd', // light blue (P18)
  '#fcd34d', // light amber (P19)
  '#d8b4fe', // light purple (P20)
];

function normalizeProcessId(processId: number): number {
  return Math.abs(Math.trunc(processId));
}

export function getProcessColor(processId: number): string {
  const normalizedId = normalizeProcessId(processId);
  return processColors[(normalizedId - 1) % processColors.length];
}

export function getProcessColorWithGlow(processId: number): { color: string; shadow: string } {
  const color = getProcessColor(processId);
  return {
    color,
    shadow: `0 0 8px ${color}66`,
  };
}
