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

export function priorityNP(processes: Process[]): AlgorithmResult {
  const unprocessedProcesses = [...processes];
  const ganttBlocks: AlgorithmResult['ganttBlocks'] = [];
  const processMetrics: AlgorithmResult['processMetrics'] = {};
  let currentTime = 0;

  while (unprocessedProcesses.length > 0) {
    const readyProcesses = unprocessedProcesses.filter(
      (process) => process.arrivalTime <= currentTime,
    );

    if (readyProcesses.length === 0) {
      const nextArrivalTime = Math.min(
        ...unprocessedProcesses.map((process) => process.arrivalTime),
      );

      ganttBlocks.push({
        processId: null,
        start: currentTime,
        end: nextArrivalTime,
      });

      currentTime = nextArrivalTime;
      continue;
    }

    const selectedProcess = readyProcesses.reduce((highest, current) => {
      if (current.priority > highest.priority) {
        return current;
      }
      if (current.priority === highest.priority) {
        if (current.arrivalTime < highest.arrivalTime) {
          return current;
        }
        if (current.arrivalTime === highest.arrivalTime) {
          return current.id < highest.id ? current : highest;
        }
      }
      return highest;
    });

    const startTime = currentTime;
    const completionTime = startTime + selectedProcess.burstTime;

    ganttBlocks.push({
      processId: selectedProcess.id,
      start: startTime,
      end: completionTime,
    });

    processMetrics[selectedProcess.id] = {
      completionTime,
      turnaroundTime: completionTime - selectedProcess.arrivalTime,
      waitingTime: startTime - selectedProcess.arrivalTime,
    };

    currentTime = completionTime;
    const index = unprocessedProcesses.findIndex((p) => p.id === selectedProcess.id);
    unprocessedProcesses.splice(index, 1);
  }

  return {
    algorithm: 'priorityNP',
    ganttBlocks,
    processMetrics,
    averages: calculateAverages(processMetrics),
  };
}
