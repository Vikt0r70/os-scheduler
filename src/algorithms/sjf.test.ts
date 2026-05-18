/// <reference types="node" />

import assert from 'node:assert/strict';
import test from 'node:test';

import { sjf } from './sjf.ts';
import type { Process } from '../types/index.ts';

test('sjf schedules processes by shortest burst time with arrival and pid tie-breaks', () => {
  const processes: Process[] = [
    { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 0 },
    { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 0 },
    { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 0 },
    { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 0 },
  ];

  const snapshot = structuredClone(processes);
  const result = sjf(processes);

  assert.deepEqual(processes, snapshot);
  assert.equal(result.algorithm, 'sjf');
  assert.deepEqual(result.ganttBlocks, [
    { processId: 1, start: 0, end: 8 },
    { processId: 2, start: 8, end: 12 },
    { processId: 4, start: 12, end: 17 },
    { processId: 3, start: 17, end: 26 },
  ]);
  assert.deepEqual(result.processMetrics, {
    1: { completionTime: 8, turnaroundTime: 8, waitingTime: 0 },
    2: { completionTime: 12, turnaroundTime: 11, waitingTime: 7 },
    4: { completionTime: 17, turnaroundTime: 14, waitingTime: 9 },
    3: { completionTime: 26, turnaroundTime: 24, waitingTime: 15 },
  });
  assert.deepEqual(result.averages, {
    completionTime: 15.75,
    turnaroundTime: 14.25,
    waitingTime: 7.75,
  });
});

test('sjf inserts an idle block and handles empty input', () => {
  assert.deepEqual(sjf([]), {
    algorithm: 'sjf',
    ganttBlocks: [],
    processMetrics: {},
    averages: { completionTime: 0, turnaroundTime: 0, waitingTime: 0 },
  });

  assert.deepEqual(
    sjf([
      { id: 2, name: 'P2', arrivalTime: 5, burstTime: 3, priority: 1 },
      { id: 1, name: 'P1', arrivalTime: 5, burstTime: 2, priority: 1 },
    ]),
    {
      algorithm: 'sjf',
      ganttBlocks: [
        { processId: null, start: 0, end: 5 },
        { processId: 1, start: 5, end: 7 },
        { processId: 2, start: 7, end: 10 },
      ],
      processMetrics: {
        1: { completionTime: 7, turnaroundTime: 2, waitingTime: 0 },
        2: { completionTime: 10, turnaroundTime: 5, waitingTime: 2 },
      },
      averages: {
        completionTime: 8.5,
        turnaroundTime: 3.5,
        waitingTime: 1,
      },
    },
  );
});
