/// <reference types="node" />

import assert from 'node:assert/strict';
import test from 'node:test';

import { priorityNP } from './priorityNP.ts';
import type { Process } from '../types/index.ts';

test('priorityNP schedules processes based on priority (higher number = higher priority)', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 2 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 3 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
  ];

  const snapshot = structuredClone(processes);
  const result = priorityNP(processes);

  assert.deepEqual(processes, snapshot);
  assert.equal(result.algorithm, 'priorityNP');
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 8 },
    { processId: 3, start: 8, end: 17 },
    { processId: 4, start: 17, end: 22 },
    { processId: 2, start: 22, end: 26 },
  ]);

  assert.deepEqual(result.processMetrics, {
    1: { completionTime: 8, turnaroundTime: 8, waitingTime: 0 },
    2: { completionTime: 26, turnaroundTime: 25, waitingTime: 21 },
    3: { completionTime: 17, turnaroundTime: 15, waitingTime: 6 },
    4: { completionTime: 22, turnaroundTime: 19, waitingTime: 14 },
  });

  assert.deepEqual(result.averages, {
    completionTime: 18.25,
    turnaroundTime: 16.75,
    waitingTime: 10.25,
  });
});

test('priorityNP tie-breaks with arrival time then PID', () => {
  const processes: Process[] = [
    { id: 2, name: 'P2', arrivalTime: 0, burstTime: 5, priority: 1 },
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 1 },
    { id: 3, name: 'P3', arrivalTime: 10, burstTime: 5, priority: 2 },
    { id: 4, name: 'P4', arrivalTime: 10, burstTime: 5, priority: 2 },
  ];

  const result = priorityNP(processes);

  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 5 },
    { processId: 2, start: 5, end: 10 },
    { processId: 3, start: 10, end: 15 },
    { processId: 4, start: 15, end: 20 },
  ]);
});

test('priorityNP handles idle time and empty input', () => {
  // Empty input
  assert.deepEqual(priorityNP([]), {
    algorithm: 'priorityNP',
    ganttBlocks: [],
    processMetrics: {},
    averages: { completionTime: 0, turnaroundTime: 0, waitingTime: 0 },
  });

  // Idle time
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 1 },
    { id: 2, name: 'P2', arrivalTime: 10, burstTime: 5, priority: 1 },
  ];

  const result = priorityNP(processes);

  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 5 },
    { processId: null, start: 5, end: 10 },
    { processId: 2, start: 10, end: 15 },
  ]);
});
