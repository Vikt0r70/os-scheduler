import { useMemo } from 'react';
import { motion } from 'motion/react';

import type { AlgorithmResult } from '../types';
import { formatAverage } from '../utils';
import { XIcon, CheckCircleIcon } from './Icons';

export interface ComparisonTableProps {
  results: AlgorithmResult[];
  onClose: () => void;
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

export default function ComparisonTable({ results, onClose }: ComparisonTableProps) {
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

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => a.averages.waitingTime - b.averages.waitingTime);
  }, [results]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-surface-container border border-outline-variant rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-highest flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Algorithm Comparison</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Sorted by average waiting time (best first)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <XIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {results.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-outline-variant">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="border-b border-outline-variant bg-surface-dim/50">
                  <tr>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold" scope="col">
                      Rank
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold" scope="col">
                      Algorithm
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                      Avg Waiting
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                      Avg Turnaround
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold text-center" scope="col">
                      Best
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {sortedResults.map((result, index) => {
                    const isLowestWaiting = result.averages.waitingTime === lowestAverages.waitingTime;
                    const isLowestTurnaround = result.averages.turnaroundTime === lowestAverages.turnaroundTime;
                    const isBest = isLowestWaiting || isLowestTurnaround;

                    return (
                      <tr
                        key={result.algorithm}
                        className={[
                          'bg-surface-container-low/50 hover:bg-surface-variant/20 transition-colors',
                          isBest ? 'bg-primary/5' : '',
                        ].join(' ')}
                      >
                        <td className="px-4 py-3 font-mono text-sm text-on-surface-variant">
                          #{index + 1}
                        </td>
                        <th className="px-4 py-3 font-mono font-semibold text-primary" scope="row">
                          {getAlgorithmLabel(result.algorithm)}
                        </th>
                        <td className="px-4 py-3 font-mono tabular-nums font-semibold text-on-surface text-center">
                          {formatMetric(result.averages.waitingTime)}
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums font-semibold text-on-surface text-center">
                          {formatMetric(result.averages.turnaroundTime)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isBest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-xs font-semibold border border-primary/30">
                              <CheckCircleIcon className="w-3 h-3" />
                              Best
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-on-surface-variant text-sm">
                Run algorithms to compare their performance.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
