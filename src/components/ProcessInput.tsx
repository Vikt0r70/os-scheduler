import { type FormEvent, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import type { Process } from '../types';
import { getProcessColor } from '../utils/colors';
import { AddIcon, CloseIcon } from './Icons';

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
  const [showAddForm, setShowAddForm] = useState(false);

  const isEditing = editingProcessId !== null;
  const processCountLabel = useMemo(
    () => `${processes.length}/${MAX_PROCESSES} processes`,
    [processes.length],
  );

  function updateField(field: keyof ProcessFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  function resetForm() {
    setForm(emptyForm);
    setErrors({});
    setEditingProcessId(null);
    setShowAddForm(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseProcessForm(form);

    if (Object.keys(parsed.errors).length > 0) {
      setErrors(parsed.errors);
      return;
    }

    if (!parsed.process) return;

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

  function handleInlineUpdate(process: Process, field: keyof Process, value: string) {
    const numValue = Number(value);
    if (field === 'name') {
      onUpdate({ ...process, name: value });
    } else if (field === 'arrivalTime') {
      if (value === '' || numValue < 0) return;
      onUpdate({ ...process, arrivalTime: numValue });
    } else if (field === 'burstTime') {
      if (value === '' || numValue < 1) return;
      onUpdate({ ...process, burstTime: numValue });
    } else if (field === 'priority') {
      if (value === '' || !Number.isInteger(numValue)) return;
      onUpdate({ ...process, priority: numValue });
    }
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-lg hover-card">
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-highest">
        <h2 className="font-display text-xl font-semibold">Process Table</h2>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={processes.length >= MAX_PROCESSES}
          className="text-primary hover:text-primary-fixed hover:bg-primary/10 px-2 py-1.5 rounded transition-all flex items-center gap-1 font-mono text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <AddIcon />
          Add Process
        </button>
      </div>

      <div className="p-6 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant pb-3 font-normal border-b border-outline-variant">
                PID
              </th>
              <th className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant pb-3 font-normal border-b border-outline-variant text-center">
                Arrival
              </th>
              <th className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant pb-3 font-normal border-b border-outline-variant text-center">
                Burst
              </th>
              <th className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant pb-3 font-normal border-b border-outline-variant text-center">
                Priority
              </th>
              <th className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant pb-3 font-normal border-b border-outline-variant text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {processes.map((process) => {
                const color = getProcessColor(process.id);
                return (
                  <motion.tr
                    key={process.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-outline-variant/50 hover:bg-surface-variant/30 row-lift"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: color,
                            boxShadow: `0 0 8px ${color}66`,
                          }}
                        />
                        <span className="font-mono text-sm text-on-surface font-medium">
                          {process.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        min={0}
                        value={process.arrivalTime}
                        onChange={(e) =>
                          handleInlineUpdate(process, 'arrivalTime', e.target.value)
                        }
                        className="w-16 bg-surface border border-outline-variant rounded px-2 py-1 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors text-center"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={process.burstTime}
                        onChange={(e) =>
                          handleInlineUpdate(process, 'burstTime', e.target.value)
                        }
                        className="w-16 bg-surface border border-outline-variant rounded px-2 py-1 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors text-center"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        value={process.priority}
                        onChange={(e) =>
                          handleInlineUpdate(process, 'priority', e.target.value)
                        }
                        className="w-16 bg-surface border border-outline-variant rounded px-2 py-1 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors text-center"
                      />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onRemove(process.id)}
                        className="text-on-surface-variant hover:text-error hover:bg-error/10 p-1 rounded transition-colors inline-flex cursor-pointer"
                      >
                        <CloseIcon />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>

            {/* Add Process Form Row */}
            <AnimatePresence>
              {showAddForm && (
                <motion.tr
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-outline-variant/50"
                >
                  <td colSpan={5} className="py-3">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                      <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-20 bg-surface border border-outline-variant rounded px-2 py-1 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={form.arrivalTime}
                        onChange={(e) => updateField('arrivalTime', e.target.value)}
                        className="w-16 bg-surface border border-outline-variant rounded px-2 py-1 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors text-center"
                      />
                      <input
                        type="number"
                        min={1}
                        placeholder="5"
                        value={form.burstTime}
                        onChange={(e) => updateField('burstTime', e.target.value)}
                        className="w-16 bg-surface border border-outline-variant rounded px-2 py-1 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors text-center"
                      />
                      <input
                        type="number"
                        placeholder="1"
                        value={form.priority}
                        onChange={(e) => updateField('priority', e.target.value)}
                        className="w-16 bg-surface border border-outline-variant rounded px-2 py-1 font-mono text-sm focus:border-secondary-fixed-dim focus:ring-1 focus:ring-secondary-fixed-dim outline-none text-on-surface transition-colors text-center"
                      />
                      <div className="flex gap-2 ml-auto">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="text-on-surface-variant hover:text-on-surface px-2 py-1 rounded border border-outline-variant hover:border-outline transition-colors text-sm cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-primary text-on-primary px-3 py-1 rounded font-mono text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                    {errors.form && (
                      <p className="text-error text-xs mt-2">{errors.form}</p>
                    )}
                    {errors.name && (
                      <p className="text-error text-xs mt-1">{errors.name}</p>
                    )}
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {processes.length === 0 && !showAddForm && (
          <div className="text-center py-8">
            <p className="text-on-surface-variant text-sm">
              No processes yet. Click "Add Process" to get started.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-outline-variant flex items-center justify-between bg-surface-container-high/50">
        <span className="font-mono text-xs text-on-surface-variant">
          {processCountLabel}
        </span>
        <div className="flex gap-1">
          {processes.map((p) => (
            <span
              key={p.id}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getProcessColor(p.id) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
