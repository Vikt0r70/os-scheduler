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

export function fcfs(processes: Process[]): AlgorithmResult {
  const sortedProcesses = [...processes].sort((firstProcess, secondProcess) => {
    if (firstProcess.arrivalTime !== secondProcess.arrivalTime) {
      return firstProcess.arrivalTime - secondProcess.arrivalTime;
    }

    return firstProcess.id - secondProcess.id;
  });

  const ganttBlocks: AlgorithmResult['ganttBlocks'] = [];
  const processMetrics: AlgorithmResult['processMetrics'] = {};
  let currentTime = 0;

  for (const process of sortedProcesses) {
    if (currentTime < process.arrivalTime) {
      ganttBlocks.push({
        processId: null,
        start: currentTime,
        end: process.arrivalTime,
      });
      currentTime = process.arrivalTime;
    }

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
    algorithm: 'fcfs',
    ganttBlocks,
    processMetrics,
    averages: calculateAverages(processMetrics),
  };
}
