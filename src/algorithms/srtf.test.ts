/// <reference types="node" />

import assert from 'node:assert/strict';
import test from 'node:test';

import { srtf } from './srtf.ts';
import type { Process } from '../types/index.ts';

test('srtf schedules processes using shortest remaining time first with preemption', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 0 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 0 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 0 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 0 },
  ];

  const snapshot = structuredClone(processes);
  const result = srtf(processes);

  assert.deepEqual(processes, snapshot);
  assert.equal(result.algorithm, 'srtf');
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 1 },
    { processId: 2, start: 1, end: 5 },
    { processId: 4, start: 5, end: 10 },
    { processId: 1, start: 10, end: 17 },
    { processId: 3, start: 17, end: 26 },
  ]);

  assert.deepEqual(result.processMetrics, {
    1: { completionTime: 17, turnaroundTime: 17, waitingTime: 9 },
    2: { completionTime: 5, turnaroundTime: 4, waitingTime: 0 },
    3: { completionTime: 26, turnaroundTime: 24, waitingTime: 15 },
    4: { completionTime: 10, turnaroundTime: 7, waitingTime: 2 },
  });

  assert.deepEqual(result.averages, {
    completionTime: 14.5,
    turnaroundTime: 13,
    waitingTime: 6.5,
  });
});

test('srtf handles idle time and tie-breaks', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 5, burstTime: 2, priority: 0 },
    { id: 2, name: 'P2', arrivalTime: 5, burstTime: 2, priority: 0 },
  ];

  const result = srtf(processes);

  assert.deepEqual(result.ganttBlocks, [
    { processId: null, start: 0, end: 5 },
    { processId: 1, start: 5, end: 7 },
    { processId: 2, start: 7, end: 9 },
  ]);

  assert.deepEqual(result.processMetrics, {
    1: { completionTime: 7, turnaroundTime: 2, waitingTime: 0 },
    2: { completionTime: 9, turnaroundTime: 4, waitingTime: 2 },
  });
});

test('srtf handles empty input', () => {
  const result = srtf([]);
  assert.equal(result.algorithm, 'srtf');
  assert.deepEqual(result.ganttBlocks, []);
  assert.deepEqual(result.processMetrics, {});
  assert.deepEqual(result.averages, {
    completionTime: 0,
    turnaroundTime: 0,
    waitingTime: 0,
  });
});

test('srtf tie-break: equal remaining time uses arrival time, then PID', () => {
  const processes: Process[] = [
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 2, priority: 0 },
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 2, priority: 0 },
  ];

  const result = srtf(processes);

  // P1 arrives at 0, P2 at 1.
  // t=0: P1 runs.
  // t=1: P2 arrives. P1 remaining=1, P2 remaining=2. P1 continues.
  // t=2: P1 finishes. P2 runs.
  // t=4: P2 finishes.
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 2 },
    { processId: 2, start: 2, end: 4 },
  ]);
});
