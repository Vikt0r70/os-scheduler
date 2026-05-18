import { type FormEvent, useMemo, useState } from 'react';
import { motion } from 'motion/react';

import type { Process } from '../types';

const MAX_PROCESSES = 20;

const emptyForm = {
  name: '',
  arrivalTime: '',
  burstTime: '',
  priority: '',
};

type ProcessFormState = typeof emptyForm;
type ProcessFormErrors = Partial<Record<keyof ProcessFormState | 'form', string>>;

export interface ProcessInputProps {
  processes: Process[];
  onAdd: (process: Process) => void;
  onUpdate: (process: Process) => void;
  onRemove: (processId: Process['id']) => void;
}

function getNextProcessId(processes: Process[]) {
  return processes.reduce((largestId, process) => Math.max(largestId, process.id), 0) + 1;
}

function parseProcessForm(form: ProcessFormState) {
  const errors: ProcessFormErrors = {};
  const trimmedName = form.name.trim();
  const arrivalTime = Number(form.arrivalTime);
  const burstTime = Number(form.burstTime);
  const priority = Number(form.priority);

  if (!trimmedName) {
    errors.name = 'Enter a process name.';
  }

  if (form.arrivalTime.trim() === '' || !Number.isFinite(arrivalTime) || arrivalTime < 0) {
    errors.arrivalTime = 'Arrival time must be 0 or greater.';
  }

  if (form.burstTime.trim() === '' || !Number.isFinite(burstTime) || burstTime < 1) {
    errors.burstTime = 'Burst time must be at least 1.';
  }

  if (form.priority.trim() === '' || !Number.isInteger(priority)) {
    errors.priority = 'Priority must be an integer.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    process: {
      name: trimmedName,
      arrivalTime,
      burstTime,
      priority,
    },
    errors,
  };
}

export default function ProcessInput({
  processes,
  onAdd,
  onUpdate,
  onRemove,
}: ProcessInputProps) {
  const [form, setForm] = useState<ProcessFormState>(emptyForm);
  const [errors, setErrors] = useState<ProcessFormErrors>({});
  const [editingProcessId, setEditingProcessId] = useState<Process['id'] | null>(null);

  const isEditing = editingProcessId !== null;
  const processCountLabel = useMemo(
    () => `${processes.length}/${MAX_PROCESSES} processes`,
    [processes.length],
  );

  function updateField(field: keyof ProcessFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined, form: undefined }));
  }

  function resetForm() {
    setForm(emptyForm);
    setErrors({});
    setEditingProcessId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = parseProcessForm(form);

    if (Object.keys(parsed.errors).length > 0) {
      setErrors(parsed.errors);
      return;
    }

    if (!parsed.process) {
      return;
    }

    if (!isEditing && processes.length >= MAX_PROCESSES) {
      setErrors({ form: 'You can add up to 20 processes.' });
      return;
    }

    if (isEditing) {
      onUpdate({ ...parsed.process, id: editingProcessId });
    } else {
      onAdd({ ...parsed.process, id: getNextProcessId(processes) });
    }

    resetForm();
  }

  function handleEdit(process: Process) {
    setForm({
      name: process.name,
      arrivalTime: String(process.arrivalTime),
      burstTime: String(process.burstTime),
      priority: String(process.priority),
    });
    setErrors({});
    setEditingProcessId(process.id);
  }

  return (
    <section className="glass-panel space-y-6 rounded-3xl p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-scheduler-accent/80">Process Lab</p>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-scheduler-ink">Process input</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-scheduler-muted">
              Add CPU scheduling processes now; algorithm wiring can consume this controlled list later.
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-scheduler-accent/30 bg-scheduler-accent/10 px-4 py-2 text-sm font-medium text-scheduler-accent">
          {processCountLabel}
        </span>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm font-medium text-scheduler-ink" htmlFor="process-name">
            <span>Name</span>
            <input
              id="process-name"
              className="w-full rounded-2xl border border-scheduler-border bg-scheduler-bg/70 px-4 py-3 text-scheduler-ink outline-none transition-colors placeholder:text-scheduler-muted/60 focus:border-scheduler-accent focus:ring-2 focus:ring-scheduler-accent/20"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'process-name-error' : undefined}
              placeholder="P1"
            />
            {errors.name ? (
              <span id="process-name-error" className="block text-xs font-medium text-scheduler-coral-soft">
                {errors.name}
              </span>
            ) : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-scheduler-ink" htmlFor="process-arrival-time">
            <span>Arrival Time</span>
            <input
              id="process-arrival-time"
              className="w-full rounded-2xl border border-scheduler-border bg-scheduler-bg/70 px-4 py-3 text-scheduler-ink outline-none transition-colors placeholder:text-scheduler-muted/60 focus:border-scheduler-accent focus:ring-2 focus:ring-scheduler-accent/20"
              type="number"
              min="0"
              inputMode="decimal"
              value={form.arrivalTime}
              onChange={(event) => updateField('arrivalTime', event.target.value)}
              aria-invalid={Boolean(errors.arrivalTime)}
              aria-describedby={errors.arrivalTime ? 'process-arrival-time-error' : undefined}
              placeholder="0"
            />
            {errors.arrivalTime ? (
              <span id="process-arrival-time-error" className="block text-xs font-medium text-scheduler-coral-soft">
                {errors.arrivalTime}
              </span>
            ) : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-scheduler-ink" htmlFor="process-burst-time">
            <span>Burst Time</span>
            <input
              id="process-burst-time"
              className="w-full rounded-2xl border border-scheduler-border bg-scheduler-bg/70 px-4 py-3 text-scheduler-ink outline-none transition-colors placeholder:text-scheduler-muted/60 focus:border-scheduler-accent focus:ring-2 focus:ring-scheduler-accent/20"
              type="number"
              min="1"
              inputMode="decimal"
              value={form.burstTime}
              onChange={(event) => updateField('burstTime', event.target.value)}
              aria-invalid={Boolean(errors.burstTime)}
              aria-describedby={errors.burstTime ? 'process-burst-time-error' : undefined}
              placeholder="5"
            />
            {errors.burstTime ? (
              <span id="process-burst-time-error" className="block text-xs font-medium text-scheduler-coral-soft">
                {errors.burstTime}
              </span>
            ) : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-scheduler-ink" htmlFor="process-priority">
            <span>Priority</span>
            <input
              id="process-priority"
              className="w-full rounded-2xl border border-scheduler-border bg-scheduler-bg/70 px-4 py-3 text-scheduler-ink outline-none transition-colors placeholder:text-scheduler-muted/60 focus:border-scheduler-accent focus:ring-2 focus:ring-scheduler-accent/20"
              type="number"
              step="1"
              inputMode="numeric"
              value={form.priority}
              onChange={(event) => updateField('priority', event.target.value)}
              aria-invalid={Boolean(errors.priority)}
              aria-describedby={errors.priority ? 'process-priority-error' : undefined}
              placeholder="1"
            />
            {errors.priority ? (
              <span id="process-priority-error" className="block text-xs font-medium text-scheduler-coral-soft">
                {errors.priority}
              </span>
            ) : null}
          </label>
        </div>

        {errors.form ? (
          <p className="rounded-2xl border border-scheduler-coral/30 bg-scheduler-coral/10 px-4 py-3 text-sm font-medium text-scheduler-coral-soft" role="alert">
            {errors.form}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border border-scheduler-accent/40 bg-scheduler-accent px-5 py-3 text-sm font-semibold text-scheduler-bg transition-colors hover:bg-scheduler-cyan focus:outline-none focus:ring-2 focus:ring-scheduler-accent focus:ring-offset-2 focus:ring-offset-scheduler-bg"
            type="submit"
          >
            {isEditing ? 'Save Process' : 'Add Process'}
          </button>
          {isEditing ? (
            <button
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border border-scheduler-border bg-scheduler-panel/70 px-5 py-3 text-sm font-semibold text-scheduler-ink transition-colors hover:border-scheduler-accent/40 hover:bg-scheduler-panel focus:outline-none focus:ring-2 focus:ring-scheduler-accent focus:ring-offset-2 focus:ring-offset-scheduler-bg"
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-scheduler-ink">Current processes</h3>
          <p className="text-sm text-scheduler-muted">Name, arrival, burst, and priority</p>
        </div>

        {processes.length > 0 ? (
          <div className="grid gap-3">
            {processes.map((process) => (
              <motion.article
                key={process.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="glass-card rounded-3xl p-4 transition-colors hover:border-scheduler-accent/30"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-scheduler-accent/70">Process {process.id}</p>
                      <h4 className="mt-1 text-xl font-semibold text-scheduler-ink">{process.name}</h4>
                    </div>
                    <dl className="grid gap-3 text-sm sm:grid-cols-3">
                      <div className="rounded-2xl border border-scheduler-border bg-scheduler-panel/80 px-4 py-3">
                        <dt className="text-scheduler-muted">Arrival</dt>
                        <dd className="mt-1 font-semibold text-scheduler-ink">{process.arrivalTime}</dd>
                      </div>
                      <div className="rounded-2xl border border-scheduler-border bg-scheduler-panel/80 px-4 py-3">
                        <dt className="text-scheduler-muted">Burst</dt>
                        <dd className="mt-1 font-semibold text-scheduler-ink">{process.burstTime}</dd>
                      </div>
                      <div className="rounded-2xl border border-scheduler-border bg-scheduler-panel/80 px-4 py-3">
                        <dt className="text-scheduler-muted">Priority</dt>
                        <dd className="mt-1 font-semibold text-scheduler-ink">{process.priority}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    <button
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border border-scheduler-accent/30 bg-scheduler-accent/10 px-4 py-2 text-sm font-semibold text-scheduler-accent transition-colors hover:bg-scheduler-accent/20 focus:outline-none focus:ring-2 focus:ring-scheduler-accent focus:ring-offset-2 focus:ring-offset-scheduler-bg"
                      type="button"
                      onClick={() => handleEdit(process)}
                    >
                      Edit
                    </button>
                    <button
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border border-scheduler-coral/30 bg-scheduler-coral/10 px-4 py-2 text-sm font-semibold text-scheduler-coral-soft transition-colors hover:bg-scheduler-coral/20 focus:outline-none focus:ring-2 focus:ring-scheduler-coral focus:ring-offset-2 focus:ring-offset-scheduler-bg"
                      type="button"
                      onClick={() => onRemove(process.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-scheduler-border bg-scheduler-panel/40 px-5 py-8 text-center text-sm text-scheduler-muted">
            No processes yet. Add the first process to prepare the scheduler input set.
          </div>
        )}
      </div>
    </section>
  );
}


