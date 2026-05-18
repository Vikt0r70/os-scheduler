import type { AlgorithmResult, Metrics, Process } from '../types/index.ts';
import { formatAverage } from '../utils/index.ts';

function calculateAverages(
  processMetrics: AlgorithmResult['processMetrics'],
): AlgorithmResult['averages'] {
  const metricEntries = Object.values(processMetrics);

  if (metricEntries.length === 0) {
    return {
      completionTime: 0,
      turnaroundTime: 0,
      waitingTime: 0,
    };
  }

  const totals = metricEntries.reduce(
    (accumulator, metrics) => ({
      completionTime: accumulator.completionTime + metrics.completionTime,
      turnaroundTime: accumulator.turnaroundTime + metrics.turnaroundTime,
      waitingTime: accumulator.waitingTime + metrics.waitingTime,
    }),
    {
      completionTime: 0,
      turnaroundTime: 0,
      waitingTime: 0,
    },
  );

  return {
    completionTime: formatAverage(totals.completionTime / metricEntries.length),
    turnaroundTime: formatAverage(totals.turnaroundTime / metricEntries.length),
    waitingTime: formatAverage(totals.waitingTime / metricEntries.length),
  };
}

interface ProcessState extends Process {
  remainingTime: number;
}

export function srtf(processes: Process[]): AlgorithmResult {
  if (processes.length === 0) {
    return {
      algorithm: 'srtf',
      ganttBlocks: [],
      processMetrics: {},
      averages: { completionTime: 0, turnaroundTime: 0, waitingTime: 0 },
    };
  }

  const states: ProcessState[] = processes.map((process) => ({
    ...process,
    remainingTime: process.burstTime,
  }));

  const ganttBlocks: AlgorithmResult['ganttBlocks'] = [];
  const processMetrics: Record<number, Metrics> = {};
  let currentTime = 0;
  let completedCount = 0;

  while (completedCount < states.length) {
    const availableProcesses = states.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime > 0,
    );

    if (availableProcesses.length === 0) {
      const nextArrival = states
        .filter((p) => p.arrivalTime > currentTime)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];

      if (nextArrival) {
        const idleEnd = nextArrival.arrivalTime;
        if (ganttBlocks.length > 0 && ganttBlocks[ganttBlocks.length - 1].processId === null) {
          ganttBlocks[ganttBlocks.length - 1].end = idleEnd;
        } else {
          ganttBlocks.push({
            processId: null,
            start: currentTime,
            end: idleEnd,
          });
        }
        currentTime = idleEnd;
        continue;
      }
    }

    // Pick process with shortest remaining time
    // Tie-break: arrival time, then id
    const currentProcess = availableProcesses.sort((a, b) => {
      if (a.remainingTime !== b.remainingTime) {
        return a.remainingTime - b.remainingTime;
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      return a.id - b.id;
    })[0];

    const startTime = currentTime;
    // Run for 1 unit of time to check for preemption at next arrival
    // Or run until next arrival
    const nextArrivals = states.filter((p) => p.arrivalTime > currentTime);
    const nextArrivalTime = nextArrivals.length > 0 
      ? Math.min(...nextArrivals.map(p => p.arrivalTime))
      : Infinity;
    
    const timeToNextArrival = nextArrivalTime - currentTime;
    const runTime = Math.min(currentProcess.remainingTime, timeToNextArrival);
    
    currentTime += runTime;
    currentProcess.remainingTime -= runTime;

    // Update Gantt blocks
    if (
      ganttBlocks.length > 0 &&
      ganttBlocks[ganttBlocks.length - 1].processId === currentProcess.id
    ) {
      ganttBlocks[ganttBlocks.length - 1].end = currentTime;
    } else {
      ganttBlocks.push({
        processId: currentProcess.id,
        start: startTime,
        end: currentTime,
      });
    }

    if (currentProcess.remainingTime === 0) {
      completedCount++;
      const completionTime = currentTime;
      const turnaroundTime = completionTime - currentProcess.arrivalTime;
      const waitingTime = turnaroundTime - currentProcess.burstTime;

      processMetrics[currentProcess.id] = {
        completionTime,
        turnaroundTime,
        waitingTime,
      };
    }
  }

  return {
    algorithm: 'srtf',
    ganttBlocks,
    processMetrics,
    averages: calculateAverages(processMetrics),
  };
}
