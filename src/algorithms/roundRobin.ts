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

export function roundRobin(processes: Process[], quantum = 2): AlgorithmResult {
  const normalizedQuantum = Math.max(1, quantum);
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.id - b.id;
  });

  const ganttBlocks: AlgorithmResult['ganttBlocks'] = [];
  const processMetrics: AlgorithmResult['processMetrics'] = {};
  const remainingBurst: Record<number, number> = {};
  const initialBurst: Record<number, number> = {};

  for (const p of processes) {
    remainingBurst[p.id] = p.burstTime;
    initialBurst[p.id] = p.burstTime;
  }

  let currentTime = 0;
  const readyQueue: Process[] = [];
  const finishedProcesses = new Set<number>();
  let processIndex = 0;

  // Initial idle time if first process arrives later than 0
  if (sortedProcesses.length > 0 && sortedProcesses[0].arrivalTime > 0) {
    ganttBlocks.push({
      processId: null,
      start: 0,
      end: sortedProcesses[0].arrivalTime,
    });
    currentTime = sortedProcesses[0].arrivalTime;
  }

  // Add all processes that have arrived by currentTime
  while (processIndex < sortedProcesses.length && sortedProcesses[processIndex].arrivalTime <= currentTime) {
    readyQueue.push(sortedProcesses[processIndex]);
    processIndex++;
  }

  while (finishedProcesses.size < processes.length) {
    if (readyQueue.length === 0) {
      // Idle time
      const nextArrival = sortedProcesses[processIndex].arrivalTime;
      ganttBlocks.push({
        processId: null,
        start: currentTime,
        end: nextArrival,
      });
      currentTime = nextArrival;
      
      // Add processes arriving at this time
      while (processIndex < sortedProcesses.length && sortedProcesses[processIndex].arrivalTime <= currentTime) {
        readyQueue.push(sortedProcesses[processIndex]);
        processIndex++;
      }
      continue;
    }

    const currentProcess = readyQueue.shift()!;
    const executeTime = Math.min(remainingBurst[currentProcess.id], normalizedQuantum);
    const startTime = currentTime;
    currentTime += executeTime;
    remainingBurst[currentProcess.id] -= executeTime;

    // Merge adjacent blocks if it's the same process (though RR usually has slices)
    // The requirement says: "Merge adjacent continuous blocks only when they represent the same process without an intervening scheduling decision; keep quantum slices visible for the expected fixture."
    // In RR, every slice is a scheduling decision. So we keep them separate.
    ganttBlocks.push({
      processId: currentProcess.id,
      start: startTime,
      end: currentTime,
    });

    // Add new arrivals during the execution time
    while (processIndex < sortedProcesses.length && sortedProcesses[processIndex].arrivalTime <= currentTime) {
      readyQueue.push(sortedProcesses[processIndex]);
      processIndex++;
    }

    if (remainingBurst[currentProcess.id] > 0) {
      readyQueue.push(currentProcess);
    } else {
      finishedProcesses.add(currentProcess.id);
      const ct = currentTime;
      const tat = ct - currentProcess.arrivalTime;
      const wt = tat - initialBurst[currentProcess.id];
      processMetrics[currentProcess.id] = {
        completionTime: ct,
        turnaroundTime: tat,
        waitingTime: wt,
      };
    }
  }

  return {
    algorithm: 'roundRobin',
    ganttBlocks,
    processMetrics,
    averages: calculateAverages(processMetrics),
  };
}
