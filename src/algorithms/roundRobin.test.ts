/// <reference types="node" />

import assert from 'node:assert/strict';
import test from 'node:test';

import { roundRobin } from './roundRobin.ts';
import type { Process } from '../types/index.ts';

test('roundRobin schedules processes with quantum slices', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 4, priority: 0 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 0 },
  ];

  const result = roundRobin(processes, 2);

  assert.equal(result.algorithm, 'roundRobin');
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 2 },
    { processId: 2, start: 2, end: 4 },
    { processId: 1, start: 4, end: 6 },
    { processId: 2, start: 6, end: 7 },
  ]);

  assert.deepEqual(result.processMetrics, {
    1: { completionTime: 6, turnaroundTime: 6, waitingTime: 2 },
    2: { completionTime: 7, turnaroundTime: 6, waitingTime: 3 },
  });

  assert.deepEqual(result.averages, {
    completionTime: 6.5,
    turnaroundTime: 6,
    waitingTime: 2.5,
  });
});

test('roundRobin handles idle time and default quantum', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 2, burstTime: 3, priority: 0 },
  ];

  // Default quantum = 2
  const result = roundRobin(processes);

  assert.deepEqual(result.ganttBlocks, [
    { processId: null, start: 0, end: 2 },
    { processId: 1, start: 2, end: 4 },
    { processId: 1, start: 4, end: 5 },
  ]);

  assert.deepEqual(result.processMetrics, {
    1: { completionTime: 5, turnaroundTime: 3, waitingTime: 0 },
  });
});

test('roundRobin handles empty input', () => {
  const result = roundRobin([]);
  assert.equal(result.algorithm, 'roundRobin');
  assert.deepEqual(result.ganttBlocks, []);
  assert.deepEqual(result.processMetrics, {});
  assert.deepEqual(result.averages, {
    completionTime: 0,
    turnaroundTime: 0,
    waitingTime: 0,
  });
});

test('roundRobin handles invalid quantum (clamped to 1)', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 2, priority: 0 },
  ];
  const result = roundRobin(processes, 0);
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 1 },
    { processId: 1, start: 1, end: 2 },
  ]);
});
