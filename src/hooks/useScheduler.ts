import { useMemo, useState } from 'react';

import { fcfs, priorityNP, priorityP, roundRobin, sjf, srtf } from '../algorithms';
import type { AlgorithmResult, AlgorithmType, Process } from '../types';

const initialProcesses: Process[] = [
  { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 2 },
  { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
  { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 3 },
  { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
];

const algorithmOrder: AlgorithmType[] = [
  'fcfs',
  'sjf',
  'srtf',
  'roundRobin',
  'priorityNP',
  'priorityP',
];

export function useScheduler() {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('fcfs');
  const [quantum, setQuantum] = useState(2);

  const results = useMemo<AlgorithmResult[]>(() => {
    const algorithmResults = {
      fcfs: fcfs(processes),
      sjf: sjf(processes),
      srtf: srtf(processes),
      roundRobin: roundRobin(processes, quantum),
      priorityNP: priorityNP(processes),
      priorityP: priorityP(processes),
    } satisfies Record<AlgorithmType, AlgorithmResult>;

    return algorithmOrder.map((algorithm) => algorithmResults[algorithm]);
  }, [processes, quantum]);

  const selectedResult = useMemo(
    () => results.find((result) => result.algorithm === selectedAlgorithm) ?? results[0],
    [results, selectedAlgorithm],
  );

  return {
    processes,
    setProcesses,
    selectedAlgorithm,
    setSelectedAlgorithm,
    quantum,
    setQuantum,
    results,
    selectedResult,
  };
}

export default useScheduler;
