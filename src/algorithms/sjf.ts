import type { AlgorithmResult, Process } from '../types/index.ts';
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

export function sjf(processes: Process[]): AlgorithmResult {
  const remainingProcesses = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.id - b.id;
  });

  const ganttBlocks: AlgorithmResult['ganttBlocks'] = [];
  const processMetrics: AlgorithmResult['processMetrics'] = {};
  const readyQueue: Process[] = [];
  let currentTime = 0;

  while (remainingProcesses.length > 0 || readyQueue.length > 0) {
    // Add processes that have arrived to the ready queue
    while (
      remainingProcesses.length > 0 &&
      remainingProcesses[0].arrivalTime <= currentTime
    ) {
      readyQueue.push(remainingProcesses.shift()!);
    }

    if (readyQueue.length === 0) {
      if (remainingProcesses.length > 0) {
        const nextArrival = remainingProcesses[0].arrivalTime;
        ganttBlocks.push({
          processId: null,
          start: currentTime,
          end: nextArrival,
        });
        currentTime = nextArrival;
        continue;
      }
      break;
    }

    // Sort ready queue by burst time, then arrival time, then id
    readyQueue.sort((a, b) => {
      if (a.burstTime !== b.burstTime) {
        return a.burstTime - b.burstTime;
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      return a.id - b.id;
    });

    const process = readyQueue.shift()!;
    const startTime = currentTime;
    const completionTime = startTime + process.burstTime;

    ganttBlocks.push({
      processId: process.id,
      start: startTime,
      end: completionTime,
    });

    processMetrics[process.id] = {
      completionTime,
      turnaroundTime: completionTime - process.arrivalTime,
      waitingTime: startTime - process.arrivalTime,
    };

    currentTime = completionTime;
  }

  return {
    algorithm: 'sjf',
    ganttBlocks,
    processMetrics,
    averages: calculateAverages(processMetrics),
  };
}
