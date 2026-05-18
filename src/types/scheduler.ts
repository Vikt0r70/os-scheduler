export interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface GanttBlock {
  processId: number | null;
  start: number;
  end: number;
}

export interface Metrics {
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}

export type AlgorithmType =
  | 'fcfs'
  | 'sjf'
  | 'srtf'
  | 'roundRobin'
  | 'priorityNP'
  | 'priorityP';

export interface AlgorithmResult {
  algorithm: AlgorithmType;
  ganttBlocks: GanttBlock[];
  processMetrics: Record<number, Metrics>;
  averages: Metrics;
}
