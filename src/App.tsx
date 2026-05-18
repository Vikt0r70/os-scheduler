import ComparisonTable from './components/ComparisonTable';
import Footer from './components/Footer';
import GanttChart from './components/GanttChart';
import MetricsTable from './components/MetricsTable';
import ProcessInput from './components/ProcessInput';
import { useScheduler } from './hooks/useScheduler';
import type { AlgorithmType, Process } from './types';

const algorithmTabs: Array<{ id: AlgorithmType; label: string }> = [
  { id: 'fcfs', label: 'FCFS' },
  { id: 'sjf', label: 'SJF' },
  { id: 'srtf', label: 'SRTF' },
  { id: 'roundRobin', label: 'Round Robin' },
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

  function handleAdd(process: Process) {
    setProcesses((currentProcesses) => [...currentProcesses, process]);
  }

  function handleUpdate(updatedProcess: Process) {
    setProcesses((currentProcesses) =>
      currentProcesses.map((process) => (process.id === updatedProcess.id ? updatedProcess : process)),
    );
  }

  function handleRemove(processId: Process['id']) {
    setProcesses((currentProcesses) => currentProcesses.filter((process) => process.id !== processId));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-6">
        <header className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <div className="flex flex-col gap-6 border-b border-scheduler-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs uppercase tracking-[0.45em] text-scheduler-accent/80">CPU Scheduling Simulator</p>
              <h1 className="text-4xl font-semibold tracking-tight text-scheduler-ink sm:text-5xl">
                Glass Lab Scheduler
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-scheduler-muted sm:text-base">
                Compare six scheduling strategies with live process input, automatic recalculation, and a shared
                execution dashboard.
              </p>
            </div>

            <div className="rounded-3xl border border-scheduler-border bg-scheduler-panel/70 px-4 py-3 text-sm text-scheduler-muted">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-scheduler-cyan" />
                <span>{processes.length} processes loaded</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-scheduler-muted/80">Quantum defaults to 2</p>
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-3" aria-label="Scheduling algorithms">
            {algorithmTabs.map((tab) => {
              const isActive = tab.id === selectedAlgorithm;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedAlgorithm(tab.id)}
                  className={[
                    'min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'border-scheduler-accent/50 bg-scheduler-accent text-scheduler-bg'
                      : 'border-scheduler-border bg-scheduler-panel/60 text-scheduler-muted hover:border-scheduler-accent/30 hover:text-scheduler-ink',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-6">
            <ProcessInput processes={processes} onAdd={handleAdd} onUpdate={handleUpdate} onRemove={handleRemove} />

            {selectedAlgorithm === 'roundRobin' ? (
              <section className="glass-panel space-y-4 rounded-3xl p-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-scheduler-accent/80">Round Robin</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-scheduler-ink">Quantum control</h2>
                  <p className="text-sm leading-6 text-scheduler-muted">
                    Set the time slice used by the Round Robin scheduler.
                  </p>
                </div>

                <label className="block space-y-2 text-sm font-medium text-scheduler-ink" htmlFor="round-robin-quantum">
                  <span>Quantum</span>
                  <input
                    id="round-robin-quantum"
                    type="number"
                    min="1"
                    step="1"
                    value={quantum}
                    onChange={(event) => setQuantum(Math.max(1, Number(event.target.value) || 1))}
                    className="w-full rounded-2xl border border-scheduler-border bg-scheduler-bg/70 px-4 py-3 text-scheduler-ink outline-none transition-colors placeholder:text-scheduler-muted/60 focus:border-scheduler-accent focus:ring-2 focus:ring-scheduler-accent/20"
                  />
                </label>
              </section>
            ) : null}
          </div>

          <div className="space-y-6">
            <GanttChart result={selectedResult} />
            <MetricsTable result={selectedResult} />
          </div>
        </section>

        <ComparisonTable results={results} />

        <Footer />
      </div>
    </main>
  );
}
