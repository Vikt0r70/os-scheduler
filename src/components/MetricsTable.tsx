import { useMemo } from 'react';

import type { AlgorithmResult, Metrics } from '../types';
import { formatAverage } from '../utils';

export interface MetricsTableProps {
  result: AlgorithmResult;
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

export function MetricsTable({ result }: MetricsTableProps) {
  const rows = useMemo(() => getMetricsRows(result.processMetrics), [result.processMetrics]);
  const hasMetrics = rows.length > 0;

  return (
    <section className="glass-panel space-y-6 rounded-3xl p-6" aria-labelledby="metrics-table-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-scheduler-accent/80">Performance Ledger</p>
          <div>
            <h2 id="metrics-table-title" className="text-2xl font-semibold tracking-tight text-scheduler-ink">
              Metrics table
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-scheduler-muted">
              Per-process completion, turnaround, and waiting times with derived arrival and burst values.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-scheduler-border bg-scheduler-panel/80 px-4 py-2 text-sm font-medium text-scheduler-muted">
          {rows.length} {rows.length === 1 ? 'process' : 'processes'}
        </span>
      </div>

      {hasMetrics ? (
        <div className="glass-card overflow-hidden rounded-3xl">
          <div className="overflow-x-auto" role="region" aria-label="Scrollable process metrics table">
            <table className="min-w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Scheduler metrics by process. Priority is unavailable in the current algorithm result and is shown as N/A.
              </caption>
              <thead className="border-b border-scheduler-border bg-scheduler-bg/40 text-xs uppercase tracking-[0.3em] text-scheduler-muted">
                <tr>
                  <th className="px-4 py-4 font-semibold" scope="col">Process ID</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Arrival Time</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Burst Time</th>
                  <th className="px-4 py-4 font-semibold" scope="col">Priority</th>
                  <th className="px-4 py-4 font-semibold" scope="col">CT</th>
                  <th className="px-4 py-4 font-semibold" scope="col">TAT</th>
                  <th className="px-4 py-4 font-semibold" scope="col">WT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-scheduler-border text-scheduler-ink">
                {rows.map((row) => (
                  <tr key={row.processId} className="bg-scheduler-panel/30">
                    <th className="px-4 py-4 font-semibold text-scheduler-accent" scope="row">
                      P{row.processId}
                    </th>
                    <td className="px-4 py-4 tabular-nums text-scheduler-muted">{formatMetric(row.arrivalTime)}</td>
                    <td className="px-4 py-4 tabular-nums text-scheduler-muted">{formatMetric(row.burstTime)}</td>
                    <td className="px-4 py-4 text-scheduler-muted">N/A</td>
                    <td className="px-4 py-4 tabular-nums font-semibold text-scheduler-ink">
                      {formatMetric(row.metrics.completionTime)}
                    </td>
                    <td className="px-4 py-4 tabular-nums font-semibold text-scheduler-ink">
                      {formatMetric(row.metrics.turnaroundTime)}
                    </td>
                    <td className="px-4 py-4 tabular-nums font-semibold text-scheduler-ink">
                      {formatMetric(row.metrics.waitingTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-scheduler-accent/30 bg-scheduler-accent/10 text-scheduler-accent">
                <tr>
                  <th className="px-4 py-4 font-semibold" colSpan={4} scope="row">
                    Averages
                  </th>
                  <td className="px-4 py-4 tabular-nums font-semibold">
                    {formatMetric(result.averages.completionTime)}
                  </td>
                  <td className="px-4 py-4 tabular-nums font-semibold">
                    {formatMetric(result.averages.turnaroundTime)}
                  </td>
                  <td className="px-4 py-4 tabular-nums font-semibold">
                    {formatMetric(result.averages.waitingTime)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-scheduler-border bg-scheduler-panel/40 px-5 py-8 text-center text-sm text-scheduler-muted">
          Run a scheduling algorithm to generate process metrics.
        </div>
      )}
    </section>
  );
}

export default MetricsTable;
