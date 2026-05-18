/// <reference types="node" />

import assert from 'node:assert/strict';
import test from 'node:test';

import { priorityP } from './priorityP.ts';
import type { Process } from '../types/index.ts';

test('priorityP schedules processes with preemption based on priority number', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 2 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 3 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
  ];

  const snapshot = structuredClone(processes);
  const result = priorityP(processes);

  assert.deepEqual(processes, snapshot);
  assert.equal(result.algorithm, 'priorityP');
  
  // Expected Gantt: [P1:0-2, P3:2-11, P1:11-17, P4:17-22, P2:22-26]
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 2 },
    { processId: 3, start: 2, end: 11 },
    { processId: 1, start: 11, end: 17 },
    { processId: 4, start: 17, end: 22 },
    { processId: 2, start: 22, end: 26 },
  ]);

  assert.deepEqual(result.processMetrics, {
    1: { completionTime: 17, turnaroundTime: 17, waitingTime: 9 },
    2: { completionTime: 26, turnaroundTime: 25, waitingTime: 21 },
    3: { completionTime: 11, turnaroundTime: 9, waitingTime: 0 },
    4: { completionTime: 22, turnaroundTime: 19, waitingTime: 14 },
  });

  assert.deepEqual(result.averages, {
    completionTime: 19,
    turnaroundTime: 17.5,
    waitingTime: 11,
  });
});

test('priorityP handles equal priority without preemption', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 1 },
    { id: 2, name: 'P2', arrivalTime: 2, burstTime: 3, priority: 1 },
  ];

  const result = priorityP(processes);

  // P1 starts at 0. P2 arrives at 2 with same priority. P1 should NOT be preempted.
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 5 },
    { processId: 2, start: 5, end: 8 },
  ]);
});

test('priorityP handles idle time and empty input', () => {
  assert.deepEqual(priorityP([]), {
    algorithm: 'priorityP',
    ganttBlocks: [],
    processMetrics: {},
    averages: { completionTime: 0, turnaroundTime: 0, waitingTime: 0 },
  });

  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 5, burstTime: 2, priority: 1 },
  ];

  const result = priorityP(processes);

  assert.deepEqual(result.ganttBlocks, [
    { processId: null, start: 0, end: 5 },
    { processId: 1, start: 5, end: 7 },
  ]);
});
