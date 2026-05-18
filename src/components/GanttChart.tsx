import { useMemo, type CSSProperties } from 'react';
import { motion } from 'motion/react';

import type { AlgorithmResult, GanttBlock } from '../types';
import { formatTime, getProcessColor } from '../utils';

const TIME_UNIT_WIDTH_REM = 3.25;
const MIN_SEGMENT_WIDTH_REM = 4.5;

export interface GanttChartProps {
  result: AlgorithmResult;
}

function getBlockDuration(block: GanttBlock) {
  return block.end - block.start;
}

function getSegmentWidth(block: GanttBlock) {
  return `${Math.max(getBlockDuration(block) * TIME_UNIT_WIDTH_REM, MIN_SEGMENT_WIDTH_REM)}rem`;
}

function getProcessLabel(processId: GanttBlock['processId']) {
  return processId === null ? 'Idle' : `P${processId}`;
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

function getSegmentStyle(block: GanttBlock): CSSProperties | undefined {
  if (block.processId === null) {
    return undefined;
  }

  const processColor = getProcessColor(block.processId);

  return {
    backgroundColor: processColor,
    borderColor: processColor,
  };
}

export function GanttChart({ result }: GanttChartProps) {
  const blocks = result.ganttBlocks;
  const chartSummary = useMemo(() => {
    if (blocks.length === 0) {
      return {
        endTime: 0,
        processBlockCount: 0,
        idleBlockCount: 0,
      };
    }

    return blocks.reduce(
      (summary, block) => ({
        endTime: Math.max(summary.endTime, block.end),
        processBlockCount: summary.processBlockCount + (block.processId === null ? 0 : 1),
        idleBlockCount: summary.idleBlockCount + (block.processId === null ? 1 : 0),
      }),
      {
        endTime: blocks[0].end,
        processBlockCount: 0,
        idleBlockCount: 0,
      },
    );
  }, [blocks]);

  return (
    <section className="glass-panel space-y-6 rounded-3xl p-6" aria-labelledby="gantt-chart-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-scheduler-accent/80">Execution Timeline</p>
          <div>
            <h2 id="gantt-chart-title" className="text-2xl font-semibold tracking-tight text-scheduler-ink">
              Gantt chart
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-scheduler-muted">
              Horizontal CPU schedule blocks with idle time separated from process execution.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex w-fit items-center rounded-full border border-scheduler-accent/30 bg-scheduler-accent/10 px-4 py-2 font-medium text-scheduler-accent">
            {getAlgorithmLabel(result.algorithm)}
          </span>
          <span className="inline-flex w-fit items-center rounded-full border border-scheduler-border bg-scheduler-panel/80 px-4 py-2 font-medium text-scheduler-muted">
            Finish {formatTime(chartSummary.endTime)}
          </span>
        </div>
      </div>

      {blocks.length > 0 ? (
        <div className="glass-card rounded-3xl p-4">
          <div className="overflow-x-auto pb-3" role="region" aria-label="Scrollable Gantt schedule">
            <ol className="flex min-w-max items-stretch gap-2" aria-label="Scheduled CPU blocks">
              {blocks.map((block, index) => {
                const label = getProcessLabel(block.processId);
                const duration = getBlockDuration(block);

                return (
                  <motion.li
                    key={`${block.processId ?? 'idle'}-${block.start}-${block.end}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05, ease: 'easeOut' }}
                    className="flex-none"
                    style={{ width: getSegmentWidth(block) }}
                  >
                    <article
                      className={
                        block.processId === null
                          ? 'flex h-24 flex-col justify-between rounded-2xl border border-dashed border-scheduler-border bg-scheduler-muted/10 px-4 py-3 text-scheduler-muted'
                          : 'flex h-24 flex-col justify-between rounded-2xl border px-4 py-3 text-scheduler-bg shadow-2xl'
                      }
                      style={getSegmentStyle(block)}
                      aria-label={`${label} from ${formatTime(block.start)} to ${formatTime(block.end)}`}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] opacity-80">{label}</p>
                        <p className="mt-1 text-lg font-semibold">{formatTime(duration)} units</p>
                      </div>
                      <p className="text-xs font-medium opacity-80">
                        {formatTime(block.start)} - {formatTime(block.end)}
                      </p>
                    </article>
                  </motion.li>
                );
              })}
            </ol>

            <div className="mt-3 flex min-w-max gap-2" aria-label="Gantt time boundaries">
              {blocks.map((block, index) => (
                <div
                  key={`${block.start}-${block.end}-${index}`}
                  className="relative h-7 flex-none border-l border-scheduler-border text-xs font-medium text-scheduler-muted"
                  style={{ width: getSegmentWidth(block) }}
                >
                  <span className="absolute left-0 top-2 -translate-x-1/2 rounded-full border border-scheduler-border bg-scheduler-bg px-2 py-1">
                    {formatTime(block.start)}
                  </span>
                </div>
              ))}
              <div className="relative h-7 border-l border-scheduler-border text-xs font-medium text-scheduler-muted">
                <span className="absolute left-0 top-2 -translate-x-1/2 rounded-full border border-scheduler-border bg-scheduler-bg px-2 py-1">
                  {formatTime(blocks[blocks.length - 1].end)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-scheduler-border bg-scheduler-panel/40 px-5 py-8 text-center text-sm text-scheduler-muted">
          Run a scheduling algorithm to generate Gantt blocks.
        </div>
      )}

      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-2xl border border-scheduler-border bg-scheduler-panel/80 px-4 py-3">
          <dt className="text-scheduler-muted">Process blocks</dt>
          <dd className="mt-1 font-semibold text-scheduler-ink">{chartSummary.processBlockCount}</dd>
        </div>
        <div className="rounded-2xl border border-scheduler-border bg-scheduler-panel/80 px-4 py-3">
          <dt className="text-scheduler-muted">Idle blocks</dt>
          <dd className="mt-1 font-semibold text-scheduler-ink">{chartSummary.idleBlockCount}</dd>
        </div>
        <div className="rounded-2xl border border-scheduler-border bg-scheduler-panel/80 px-4 py-3">
          <dt className="text-scheduler-muted">Total time</dt>
          <dd className="mt-1 font-semibold text-scheduler-ink">{formatTime(chartSummary.endTime)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default GanttChart;
