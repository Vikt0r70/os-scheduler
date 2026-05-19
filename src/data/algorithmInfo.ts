import type { AlgorithmType } from '../types';

export interface AlgorithmInfo {
  id: AlgorithmType;
  shortLabel: string;
  fullName: string;
  description: string;
  pros: string[];
  cons: string[];
}

export const algorithmInfos: AlgorithmInfo[] = [
  {
    id: 'fcfs',
    shortLabel: 'FCFS',
    fullName: 'First Come First Serve',
    description:
      'Processes are executed in the order they arrive. The first process to request the CPU gets it first. Simple and straightforward with no preemption.',
    pros: ['Simple to implement', 'No starvation'],
    cons: ['Convoy effect', 'Poor average response time'],
  },
  {
    id: 'sjf',
    shortLabel: 'SJF',
    fullName: 'Shortest Job First',
    description:
      'The process with the shortest burst time is executed next. Non-preemptive version — once a process starts, it runs to completion.',
    pros: ['Optimal average waiting time', 'Maximizes throughput'],
    cons: ['May cause starvation of long processes', 'Requires prediction of burst times'],
  },
  {
    id: 'srtf',
    shortLabel: 'SRTF',
    fullName: 'Shortest Remaining Time First',
    description:
      'Preemptive version of SJF. If a new process arrives with a shorter remaining burst time, the current process is preempted.',
    pros: ['Better average turnaround than SJF', 'Responsive to short jobs'],
    cons: ['High context switching overhead', 'Starvation possible', 'Requires precise burst time prediction'],
  },
  {
    id: 'roundRobin',
    shortLabel: 'RR',
    fullName: 'Round Robin',
    description:
      'Each process gets a small unit of CPU time (quantum), then cycles back to the queue. Fair and widely used in time-sharing systems.',
    pros: ['Fair allocation', 'No starvation', 'Good for time-sharing'],
    cons: ['Performance depends on quantum size', 'Higher average waiting time'],
  },
  {
    id: 'priorityNP',
    shortLabel: 'Priority NP',
    fullName: 'Priority (Non-Preemptive)',
    description:
      'Processes are scheduled based on priority. Lower priority number = higher priority. Non-preemptive — runs to completion once started.',
    pros: ['Important processes get CPU first', 'Flexible priority assignment'],
    cons: ['Indefinite blocking (starvation)', 'Priority inversion possible'],
  },
  {
    id: 'priorityP',
    shortLabel: 'Priority P',
    fullName: 'Priority (Preemptive)',
    description:
      'Preemptive version of priority scheduling. If a higher-priority process arrives, the current process is preempted.',
    pros: ['Responsive to high-priority tasks', 'Better for real-time systems'],
    cons: ['High context switching', 'Starvation of low-priority processes', 'Priority inversion'],
  },
];

export function getAlgorithmInfo(id: AlgorithmType): AlgorithmInfo {
  return algorithmInfos.find((a) => a.id === id) ?? algorithmInfos[0];
}
