import { useMemo, type CSSProperties } from 'react';
import { motion } from 'motion/react';

import type { AlgorithmResult, GanttBlock } from '../types';
import { formatTime } from '../utils';
import { getProcessColor } from '../utils/colors';
import { BarChartIcon } from './Icons';

export interface GanttChartProps {
  result: AlgorithmResult;
  simState: 'idle' | 'running' | 'complete';
  stepMode: boolean;
  currentStep: number;
}

function getBlockDuration(block: GanttBlock) {
  return block.end - block.start;
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

export default function GanttChart({ result, simState, stepMode, currentStep }: GanttChartProps) {
  const blocks = result.ganttBlocks;

  const visibleBlocks = useMemo(() => {
    if (simState === 'idle') return [];
    if (stepMode) return blocks.slice(0, currentStep + 1);
    return blocks;
  }, [simState, stepMode, currentStep, blocks]);

  const totalDuration = useMemo(() => {
    if (visibleBlocks.length === 0) return 0;
    return visibleBlocks.reduce((sum, block) => sum + getBlockDuration(block), 0);
  }, [visibleBlocks]);

  const chartSummary = useMemo(() => {
    if (visibleBlocks.length === 0) {
      return { endTime: 0, processBlockCount: 0, idleBlockCount: 0 };
    }
    return visibleBlocks.reduce(
      (summary, block) => ({
        endTime: Math.max(summary.endTime, block.end),
        processBlockCount: summary.processBlockCount + (block.processId === null ? 0 : 1),
        idleBlockCount: summary.idleBlockCount + (block.processId === null ? 1 : 0),
      }),
      { endTime: visibleBlocks[0].end, processBlockCount: 0, idleBlockCount: 0 },
    );
  }, [visibleBlocks]);

  const isIdle = simState === 'idle';

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-lg hover-card">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-highest flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Gantt Chart</h2>
        {!isIdle && stepMode && (
          <span className="font-mono text-xs text-on-surface-variant">
            Step {currentStep + 1} of {blocks.length}
          </span>
        )}
      </div>

      <div className="p-6">
        {isIdle || visibleBlocks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-surface-dim/30 rounded-xl min-h-[200px]">
            <div className="text-center group">
              <BarChartIcon className="w-16 h-16 text-outline-variant mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
              <p className="font-mono text-sm text-on-surface-variant">
                {isIdle ? 'No simulation data' : 'No blocks to display'}
              </p>
              <p className="text-sm text-outline mt-1">
                {isIdle ? "Click 'Start' to run the simulation" : 'Add processes to see the schedule'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-surface-dim/30 rounded-xl border border-outline-variant p-4">
              <div className="flex w-full gap-1" aria-label="Scheduled CPU blocks">
                {visibleBlocks.map((block, index) => {
                  const label = getProcessLabel(block.processId);
                  const duration = getBlockDuration(block);
                  const widthPercent = totalDuration > 0 ? (duration / totalDuration) * 100 : 0;

                  return (
                    <motion.div
                      key={`${block.processId ?? 'idle'}-${block.start}-${block.end}-${index}`}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3, delay: stepMode ? 0 : index * 0.05, ease: 'easeOut' }}
                      className="flex-none origin-left"
                      style={{ width: `${widthPercent}%`, minWidth: '48px' }}
                    >
                      <div
                        className={[
                          'flex h-20 flex-col justify-between rounded-lg px-2 py-2 text-sm overflow-hidden',
                          block.processId === null
                            ? 'border border-dashed border-outline-variant bg-on-surface-variant/10 text-on-surface-variant'
                            : 'text-surface font-medium shadow-lg',
                        ].join(' ')}
                        style={getSegmentStyle(block)}
                      >
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-wider opacity-80 truncate">{label}</p>
                          <p className="mt-0.5 font-mono font-semibold text-xs sm:text-sm">{formatTime(duration)}u</p>
                        </div>
                        <p className="text-xs font-mono opacity-80 truncate">
                          {formatTime(block.start)}-{formatTime(block.end)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-3 flex w-full gap-1">
                {visibleBlocks.map((block, index) => {
                  const duration = getBlockDuration(block);
                  const widthPercent = totalDuration > 0 ? (duration / totalDuration) * 100 : 0;
                  return (
                    <div
                      key={`${block.start}-${block.end}-${index}`}
                      className="relative flex-none border-l border-outline-variant text-xs font-mono text-on-surface-variant"
                      style={{ width: `${widthPercent}%`, minWidth: '48px' }}
                    >
                      <span className="absolute left-0 top-1 -translate-x-1/2 rounded-full border border-outline-variant bg-background px-1.5 py-0.5 text-xs whitespace-nowrap">
                        {formatTime(block.start)}
                      </span>
                    </div>
                  );
                })}
                {visibleBlocks.length > 0 && (
                  <div className="relative flex-none border-l border-outline-variant text-xs font-mono text-on-surface-variant" style={{ width: '1px' }}>
                    <span className="absolute left-0 top-1 -translate-x-1/2 rounded-full border border-outline-variant bg-background px-1.5 py-0.5 text-xs whitespace-nowrap">
                      {formatTime(visibleBlocks[visibleBlocks.length - 1].end)}
                    </span>
                  </div>
                )}
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
