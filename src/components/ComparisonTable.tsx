import { useMemo } from 'react';

import type { AlgorithmResult } from '../types';
import { formatAverage } from '../utils';

export interface ComparisonTableProps {
  results: AlgorithmResult[];
}

function getAlgorithmLabel(algorithm: AlgorithmResult['algorithm']) {
  const labels: Record<AlgorithmResult['algorithm'], string> = {
    fcfs: 'FCFS',
    sjf: 'SJF',
    srtf: 'SRTF',
    roundRobin: 'Round Robin',
    priorityNP: 'Priority NP',
    priorityP: 'Priority P',
  };

  return labels[algorithm];
}

function formatMetric(value: number) {
  return formatAverage(value).toFixed(2);
}

export function ComparisonTable({ results }: ComparisonTableProps) {
  const lowestAverages = useMemo(() => {
    if (results.length === 0) {
      return { waitingTime: null, turnaroundTime: null };
    }

    return results.reduce(
      (lowest, result) => ({
        waitingTime: Math.min(lowest.waitingTime, result.averages.waitingTime),
        turnaroundTime: Math.min(lowest.turnaroundTime, result.averages.turnaroundTime),
      }),
      {
        waitingTime: results[0].averages.waitingTime,
        turnaroundTime: results[0].averages.turnaroundTime,
      },
    );
  }, [results]);

  return (
    <section className="glass-panel space-y-6 rounded-3xl p-6" aria-labelledby="comparison-table-title">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-scheduler-accent/80">Comparison Ledger</p>
        <div>
          <h2 id="comparison-table-title" className="text-2xl font-semibold tracking-tight text-scheduler-ink">
            Algorithm comparison
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-scheduler-muted">
            Compare average waiting time and turnaround time across scheduling algorithms.
          </p>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="glass-card overflow-hidden rounded-3xl">
          <div className="overflow-x-auto" role="region" aria-label="Scrollable algorithm comparison table">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="border-b border-scheduler-border bg-scheduler-bg/40 text-xs uppercase tracking-[0.3em] text-scheduler-muted">
                <tr>
                  <th className="px-4 py-4 font-semibold" scope="col">
                    Algorithm
                  </th>
                  <th className="px-4 py-4 font-semibold" scope="col">
                    Avg waiting time
                  </th>
                  <th className="px-4 py-4 font-semibold" scope="col">
                    Avg turnaround time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-scheduler-border text-scheduler-ink">
                {results.map((result) => {
                  const isLowestWaitingTime = result.averages.waitingTime === lowestAverages.waitingTime;
                  const isLowestTurnaroundTime = result.averages.turnaroundTime === lowestAverages.turnaroundTime;

                  return (
                    <tr
                      key={result.algorithm}
                      className={[
                        'bg-scheduler-panel/30',
                        isLowestWaitingTime || isLowestTurnaroundTime ? 'bg-scheduler-accent/20' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <th className="px-4 py-4 font-semibold text-scheduler-accent" scope="row">
                        {getAlgorithmLabel(result.algorithm)}
                      </th>
                      <td className="px-4 py-4 tabular-nums font-semibold text-scheduler-ink">
                        {formatMetric(result.averages.waitingTime)}
                      </td>
                      <td className="px-4 py-4 tabular-nums font-semibold text-scheduler-ink">
                        {formatMetric(result.averages.turnaroundTime)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-scheduler-border bg-scheduler-panel/40 px-5 py-8 text-center text-sm text-scheduler-muted">
          Run algorithms to compare average waiting and turnaround times.
        </div>
      )}
    </section>
  );
}

export default ComparisonTable;
