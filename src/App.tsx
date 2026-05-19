import { useMemo, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import ComparisonTable from './components/ComparisonTable';
import GanttChart from './components/GanttChart';
import MetricsTable from './components/MetricsTable';
import ProcessInput from './components/ProcessInput';
import { useScheduler } from './hooks/useScheduler';
import { getAlgorithmInfo } from './data/algorithmInfo';
import type { AlgorithmType, Process } from './types';
import {
  PlayIcon,
  ResetIcon,
  SkipNextIcon,
  BarChartIcon,
  CheckCircleIcon,
  XCircleIcon,
  GitHubIcon,
} from './components/Icons';

const algorithmTabs: Array<{ id: AlgorithmType; label: string }> = [
  { id: 'fcfs', label: 'FCFS' },
  { id: 'sjf', label: 'SJF' },
  { id: 'srtf', label: 'SRTF' },
  { id: 'roundRobin', label: 'RR' },
  { id: 'priorityNP', label: 'Priority NP' },
  { id: 'priorityP', label: 'Priority P' },
];

export default function App() {
  const {
    processes,
    setProcesses,
    selectedAlgorithm,
    setSelectedAlgorithm,
    quantum,
    setQuantum,
    results,
    selectedResult,
  } = useScheduler();

  const [simState, setSimState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepMode, setStepMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const algorithmInfo = useMemo(
    () => getAlgorithmInfo(selectedAlgorithm),
    [selectedAlgorithm],
  );

  const maxSteps = selectedResult.ganttBlocks.length;
  const isComplete = stepMode ? currentStep >= maxSteps - 1 : simState === 'complete';

  useEffect(() => {
    setSimState('idle');
    setCurrentStep(0);
  }, [selectedAlgorithm]);

  const handleAdd = useCallback(
    (process: Process) => {
      setProcesses((current) => [...current, process]);
      setSimState('idle');
      setCurrentStep(0);
    },
    [setProcesses],
  );

  const handleUpdate = useCallback(
    (updatedProcess: Process) => {
      setProcesses((current) =>
        current.map((p) => (p.id === updatedProcess.id ? updatedProcess : p)),
      );
    },
    [setProcesses],
  );

  const handleRemove = useCallback(
    (processId: Process['id']) => {
      setProcesses((current) => current.filter((p) => p.id !== processId));
      setSimState('idle');
      setCurrentStep(0);
    },
    [setProcesses],
  );

  const handleReset = useCallback(() => {
    setProcesses([
      { id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 2 },
      { id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
      { id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 3 },
      { id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
    ]);
    setSimState('idle');
    setCurrentStep(0);
    setStepMode(false);
  }, [setProcesses]);

  const handleStart = useCallback(() => {
    setSimState('running');
    setCurrentStep(0);
    if (!stepMode) {
      setTimeout(() => setSimState('complete'), 300);
    }
  }, [stepMode]);

  const handleStep = useCallback(() => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setSimState('complete');
    }
  }, [currentStep, maxSteps]);

  const handleProcessChange = useCallback(() => {
    setSimState('idle');
    setCurrentStep(0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background font-body flex flex-col">
      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 md:px-8 pb-12">
        {/* Hero Section */}
        <section className="pt-16 md:pt-20 pb-12 md:pb-16 flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary-fixed-dim" />
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant font-semibold">
              Operating Systems Simulator
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-fixed-dim via-secondary-fixed-dim to-tertiary-fixed-dim bg-clip-text text-transparent leading-tight"
          >
            CPU Scheduling Simulator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-on-surface-variant mb-6 max-w-2xl leading-relaxed"
          >
            Visualize and analyze fundamental operating system scheduling algorithms including FCFS, SJF, Round Robin, and Priority Scheduling in real-time.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            href="https://github.com/Vikt0r70/os-scheduler"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-mono text-xs"
          >
            <GitHubIcon />
            View on GitHub
          </motion.a>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => setShowComparison(true)}
            className="shimmer-btn font-mono text-sm px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(77,220,198,0.2)] cursor-pointer hover:scale-105"
          >
            <BarChartIcon />
            Compare All Algorithms
          </motion.button>
        </section>

        {/* Top Row: Algorithm + Process Table side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mb-4">
          {/* Algorithm Card — Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-lg hover-card"
          >
            <div className="p-6">
              {/* Algorithm Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {algorithmTabs.map((tab) => {
                  const isActive = tab.id === selectedAlgorithm;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedAlgorithm(tab.id)}
                      className={[
                        'px-4 py-1.5 rounded-full font-mono text-xs font-semibold transition-all active:scale-95 cursor-pointer',
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-surface text-on-surface-variant border border-outline-variant hover:border-outline hover:text-on-surface hover:bg-surface-variant/50',
                      ].join(' ')}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Algorithm Description */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedAlgorithm}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6"
                >
                  <h3 className="font-mono text-sm text-on-surface mb-2">
                    {algorithmInfo.fullName}
                  </h3>
                  <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                    {algorithmInfo.description}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex-1 border-l-2 border-primary-fixed-dim pl-3 hover:bg-primary-fixed-dim/5 p-2 rounded-r transition-colors">
                      <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-1">
                        Pros
                      </span>
                      <ul className="space-y-1">
                        {algorithmInfo.pros.map((pro, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-on-surface">
                            <CheckCircleIcon className="text-primary-fixed-dim shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex-1 border-l-2 border-error pl-3 hover:bg-error/5 p-2 rounded-r transition-colors">
                      <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-1">
                        Cons
                      </span>
                      <ul className="space-y-1">
                        {algorithmInfo.cons.map((con, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-on-surface">
                            <XCircleIcon className="text-error shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Round Robin Quantum */}
              <AnimatePresence>
                {selectedAlgorithm === 'roundRobin' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Time Quantum
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={quantum}
                      onChange={(e) =>
                        setQuantum(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="w-24 bg-surface border border-outline-variant rounded px-3 py-2 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center justify-between border-t border-outline-variant pt-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={stepMode}
                    onChange={(e) => {
                      setStepMode(e.target.checked);
                      setSimState('idle');
                      setCurrentStep(0);
                    }}
                    className="w-4 h-4 rounded border-outline-variant bg-surface text-secondary-fixed-dim focus:ring-secondary-fixed-dim cursor-pointer"
                  />
                  <span className="font-mono text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Step-by-Step
                  </span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-on-surface-variant hover:text-on-surface px-3 py-2 rounded border border-outline-variant hover:border-outline hover:bg-surface-variant/50 active:scale-95 transition-all cursor-pointer"
                    title="Reset"
                  >
                    <ResetIcon />
                  </button>
                  {simState !== 'idle' && stepMode && (
                    <button
                      type="button"
                      onClick={handleStep}
                      disabled={isComplete}
                      className="text-on-surface-variant hover:text-on-surface px-3 py-2 rounded border border-outline-variant hover:border-outline hover:bg-surface-variant/50 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Next Step"
                    >
                      <SkipNextIcon />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={simState !== 'idle'}
                    className="bg-primary text-on-primary px-4 py-2 rounded font-mono text-sm font-semibold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(94,234,212,0.3)] hover:shadow-[0_0_20px_rgba(94,234,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlayIcon />
                    {simState === 'idle' ? 'Start' : isComplete ? 'Complete' : 'Running...'}
                  </button>
                </div>
              </div>

              {/* Step Progress */}
              {simState !== 'idle' && stepMode && maxSteps > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-1">
                    <span>Step Progress</span>
                    <span>{Math.min(currentStep + 1, maxSteps)} / {maxSteps}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-dim rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((Math.min(currentStep + 1, maxSteps)) / maxSteps) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Process Table — Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <ProcessInput
              processes={processes}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onChange={handleProcessChange}
            />
          </motion.div>
        </div>

        {/* Gantt Chart — Full Width */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedResult.algorithm + simState + currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mb-4"
          >
            <GanttChart
              result={selectedResult}
              simState={simState}
              stepMode={stepMode}
              currentStep={currentStep}
            />
          </motion.div>
        </AnimatePresence>

        {/* Metrics Table — Full Width */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedResult.algorithm + simState + currentStep + '-metrics'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            <MetricsTable
              result={selectedResult}
              simState={simState}
              stepMode={stepMode}
              currentStep={currentStep}
            />
          </motion.div>
        </AnimatePresence>

        {/* Comparison Modal */}
        <AnimatePresence>
          {showComparison && (
            <ComparisonTable
              results={results}
              onClose={() => setShowComparison(false)}
            />
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
