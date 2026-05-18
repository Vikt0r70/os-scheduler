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

export function priorityP(processes: Process[]): AlgorithmResult {
  if (processes.length === 0) {
    return {
      algorithm: 'priorityP',
      ganttBlocks: [],
      processMetrics: {},
      averages: {
        completionTime: 0,
        turnaroundTime: 0,
        waitingTime: 0,
      },
    };
  }

  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const remainingTime = new Map<number, number>();
  processes.forEach((p) => remainingTime.set(p.id, p.burstTime));

  const ganttBlocks: AlgorithmResult['ganttBlocks'] = [];
  const processMetrics: AlgorithmResult['processMetrics'] = {};
  
  let currentTime = 0;
  let completedCount = 0;
  let lastProcessId: number | null = -1; // To track if we need to merge blocks

  while (completedCount < processes.length) {
    // Get all processes that have arrived and are not finished
    const availableProcesses = processes.filter(
      (p) => p.arrivalTime <= currentTime && remainingTime.get(p.id)! > 0
    );

    if (availableProcesses.length === 0) {
      // Idle time
      const nextArrival = sortedProcesses.find((p) => p.arrivalTime > currentTime);
      const idleEnd = nextArrival ? nextArrival.arrivalTime : currentTime + 1;
      
      if (lastProcessId === null) {
        ganttBlocks[ganttBlocks.length - 1].end = idleEnd;
      } else {
        ganttBlocks.push({ processId: null, start: currentTime, end: idleEnd });
      }
      
      currentTime = idleEnd;
      lastProcessId = null;
      continue;
    }

    // Pick the best process: highest priority, then earliest arrival, then lowest ID
    const currentProcess = availableProcesses.reduce((best, p) => {
      if (p.priority > best.priority) return p;
      if (p.priority < best.priority) return best;
      
      if (p.arrivalTime < best.arrivalTime) return p;
      if (p.arrivalTime > best.arrivalTime) return best;
      
      return p.id < best.id ? p : best;
    });

    // Determine how long to run: until next arrival or until current process finishes
    const nextArrivalProcess = sortedProcesses.find((p) => p.arrivalTime > currentTime);
    let timeToRun = remainingTime.get(currentProcess.id)!;
    
    if (nextArrivalProcess) {
      const timeUntilNextArrival = nextArrivalProcess.arrivalTime - currentTime;
      if (timeUntilNextArrival < timeToRun) {
        timeToRun = timeUntilNextArrival;
      }
    }

    const startTime = currentTime;
    const endTime = startTime + timeToRun;
    
    // Update Gantt blocks
    if (lastProcessId === currentProcess.id) {
      ganttBlocks[ganttBlocks.length - 1].end = endTime;
    } else {
      ganttBlocks.push({
        processId: currentProcess.id,
        start: startTime,
        end: endTime,
      });
    }

    // Update state
    remainingTime.set(currentProcess.id, remainingTime.get(currentProcess.id)! - timeToRun);
    currentTime = endTime;
    lastProcessId = currentProcess.id;

    if (remainingTime.get(currentProcess.id) === 0) {
      completedCount++;
      processMetrics[currentProcess.id] = {
        completionTime: currentTime,
        turnaroundTime: currentTime - currentProcess.arrivalTime,
        waitingTime: currentTime - currentProcess.arrivalTime - currentProcess.burstTime,
      };
    }
  }

  return {
    algorithm: 'priorityP',
    ganttBlocks,
    processMetrics,
    averages: calculateAverages(processMetrics),
  };
}
