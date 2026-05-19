import { useMemo, type CSSProperties } from 'react';
import { motion } from 'motion/react';

import type { AlgorithmResult, GanttBlock } from '../types';
import { formatTime } from '../utils';
import { getProcessColor } from '../utils/colors';
import { BarChartIcon } from './Icons';

const TIME_UNIT_WIDTH_REM = 3.25;
const MIN_SEGMENT_WIDTH_REM = 4.5;

export interface GanttChartProps {
  result: AlgorithmResult;
  hasStarted: boolean;
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

function getSegmentStyle(block: GanttBlock): CSSProperties | undefined {
  if (block.processId === null) {
    return undefined;
  }
  const color = getProcessColor(block.processId);
  return { backgroundColor: color, borderColor: color };
}

export default function GanttChart({ result, hasStarted }: GanttChartProps) {
  const blocks = result.ganttBlocks;
  const chartSummary = useMemo(() => {
    if (blocks.length === 0) {
      return { endTime: 0, processBlockCount: 0, idleBlockCount: 0 };
    }
    return blocks.reduce(
      (summary, block) => ({
        endTime: Math.max(summary.endTime, block.end),
        processBlockCount: summary.processBlockCount + (block.processId === null ? 0 : 1),
        idleBlockCount: summary.idleBlockCount + (block.processId === null ? 1 : 0),
      }),
      { endTime: blocks[0].end, processBlockCount: 0, idleBlockCount: 0 },
    );
  }, [blocks]);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-lg hover-card">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-highest">
        <h2 className="font-display text-xl font-semibold">Gantt Chart</h2>
      </div>

      <div className="p-6">
        {!hasStarted || blocks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-surface-dim/30 rounded-xl min-h-[200px]">
            <div className="text-center group">
              <BarChartIcon className="w-16 h-16 text-outline-variant mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
              <p className="font-mono text-sm text-on-surface-variant">
                {hasStarted ? 'No simulation data' : 'No simulation data'}
              </p>
              <p className="text-sm text-outline mt-1">
                {hasStarted ? 'Add processes to see the schedule' : "Click 'Start' to run the simulation"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-surface-dim/30 rounded-xl border border-outline-variant p-4 overflow-x-auto custom-scrollbar">
              <ol className="flex min-w-max items-stretch gap-2" aria-label="Scheduled CPU blocks">
                {blocks.map((block, index) => {
                  const label = getProcessLabel(block.processId);
                  const duration = getBlockDuration(block);
                  return (
                    <motion.li
                      key={`${block.processId ?? 'idle'}-${block.start}-${block.end}-${index}`}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                      className="flex-none origin-left"
                      style={{ width: getSegmentWidth(block) }}
                    >
                      <div
                        className={[
                          'flex h-20 flex-col justify-between rounded-lg px-3 py-2 text-sm',
                          block.processId === null
                            ? 'border border-dashed border-outline-variant bg-on-surface-variant/10 text-on-surface-variant'
                            : 'text-surface font-medium shadow-lg',
                        ].join(' ')}
                        style={getSegmentStyle(block)}
                      >
                        <div>
                          <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
                          <p className="mt-0.5 font-mono font-semibold">{formatTime(duration)} units</p>
                        </div>
                        <p className="text-xs font-mono opacity-80">
                          {formatTime(block.start)} - {formatTime(block.end)}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>

              <div className="mt-3 flex min-w-max gap-2">
                {blocks.map((block, index) => (
                  <div
                    key={`${block.start}-${block.end}-${index}`}
                    className="relative h-7 flex-none border-l border-outline-variant text-xs font-mono text-on-surface-variant"
                    style={{ width: getSegmentWidth(block) }}
                  >
                    <span className="absolute left-0 top-2 -translate-x-1/2 rounded-full border border-outline-variant bg-background px-2 py-0.5 text-xs">
                      {formatTime(block.start)}
                    </span>
                  </div>
                ))}
                <div className="relative h-7 border-l border-outline-variant text-xs font-mono text-on-surface-variant">
                  <span className="absolute left-0 top-2 -translate-x-1/2 rounded-full border border-outline-variant bg-background px-2 py-0.5 text-xs">
                    {formatTime(blocks[blocks.length - 1].end)}
                  </span>
                </div>
              </div>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-3 mt-4">
              <div className="rounded-lg border border-outline-variant bg-surface-container-high px-4 py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">Process blocks</dt>
                <dd className="mt-1 font-mono text-lg font-semibold text-on-surface">{chartSummary.processBlockCount}</dd>
              </div>
              <div className="rounded-lg border border-outline-variant bg-surface-container-high px-4 py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">Idle blocks</dt>
                <dd className="mt-1 font-mono text-lg font-semibold text-on-surface">{chartSummary.idleBlockCount}</dd>
              </div>
              <div className="rounded-lg border border-outline-variant bg-surface-container-high px-4 py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">Total time</dt>
                <dd className="mt-1 font-mono text-lg font-semibold text-on-surface">{formatTime(chartSummary.endTime)}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
