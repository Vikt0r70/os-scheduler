import { useMemo } from 'react';

import type { AlgorithmResult, Metrics } from '../types';
import { formatAverage } from '../utils';
import { AnalyticsIcon } from './Icons';

export interface MetricsTableProps {
  result: AlgorithmResult;
  simState: 'idle' | 'running' | 'complete';
  stepMode: boolean;
  currentStep: number;
}

interface MetricsRow {
  processId: string;
  arrivalTime: number;
  burstTime: number;
  metrics: Metrics;
}

function formatMetric(value: number) {
  return formatAverage(value).toFixed(2);
}

function getMetricsRows(processMetrics: AlgorithmResult['processMetrics']): MetricsRow[] {
  return Object.entries(processMetrics).map(([processId, metrics]) => ({
    processId,
    arrivalTime: metrics.completionTime - metrics.turnaroundTime,
    burstTime: metrics.turnaroundTime - metrics.waitingTime,
    metrics,
  }));
}

export default function MetricsTable({ result, simState, stepMode, currentStep }: MetricsTableProps) {
  const rows = useMemo(() => getMetricsRows(result.processMetrics), [result.processMetrics]);
  const hasMetrics = rows.length > 0;
  const isIdle = simState === 'idle';

  // In step mode, only show metrics for processes that have completed up to current step
  const visibleRows = useMemo(() => {
    if (!stepMode || simState === 'idle') return rows;
    // Get process IDs that have appeared in visible Gantt blocks
    const visibleBlocks = result.ganttBlocks.slice(0, currentStep + 1);
    const completedProcessIds = new Set<number>();
    visibleBlocks.forEach((block) => {
      if (block.processId !== null) {
        completedProcessIds.add(block.processId);
      }
    });
    return rows.filter((row) => completedProcessIds.has(Number(row.processId)));
  }, [rows, result.ganttBlocks, stepMode, currentStep, simState]);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-lg hover-card">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-highest flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Performance Metrics</h2>
        {!isIdle && stepMode && (
          <span className="font-mono text-xs text-on-surface-variant">
            {visibleRows.length} of {rows.length} processes
          </span>
        )}
      </div>

      <div className="p-6">
        {isIdle || !hasMetrics ? (
          <div className="flex-1 flex items-center justify-center bg-surface-dim/30 rounded-xl min-h-[160px]">
            <div className="text-center group">
              <AnalyticsIcon className="w-12 h-12 text-outline-variant mx-auto mb-2 group-hover:rotate-12 transition-transform duration-500" />
              <p className="font-mono text-sm text-on-surface-variant">
                {isIdle ? 'Awaiting simulation' : 'No metrics available'}
              </p>
              <p className="text-sm text-outline mt-1">
                {isIdle ? "Click 'Start' to generate metrics" : 'Add processes to calculate metrics'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar rounded-xl border border-outline-variant">
            <table className="min-w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Scheduler metrics by process.
              </caption>
              <thead className="border-b border-outline-variant bg-surface-dim/50">
                <tr>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold" scope="col">
                    Process
                  </th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                    Arrival
                  </th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                    Burst
                  </th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                    CT
                  </th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                    TAT
                  </th>
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                    WT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {(stepMode ? visibleRows : rows).map((row) => (
                  <tr key={row.processId} className="bg-surface-container-low/50 hover:bg-surface-variant/20 transition-colors">
                    <th className="px-4 py-3 font-mono font-semibold text-primary" scope="row">
                      P{row.processId}
                    </th>
                    <td className="px-4 py-3 font-mono tabular-nums text-on-surface-variant text-center">
                      {formatMetric(row.arrivalTime)}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-on-surface-variant text-center">
                      {formatMetric(row.burstTime)}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-on-surface text-center">
                      {formatMetric(row.metrics.completionTime)}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-on-surface text-center">
                      {formatMetric(row.metrics.turnaroundTime)}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-on-surface text-center">
                      {formatMetric(row.metrics.waitingTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {(!stepMode || simState === 'complete') && (
                <tfoot className="border-t border-primary/30 bg-primary/10">
                  <tr>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-primary font-semibold" colSpan={3} scope="row">
                      Averages
                    </th>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-primary text-center">
                      {formatMetric(result.averages.completionTime)}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-primary text-center">
                      {formatMetric(result.averages.turnaroundTime)}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums font-semibold text-primary text-center">
                      {formatMetric(result.averages.waitingTime)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
