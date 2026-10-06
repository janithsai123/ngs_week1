import React, { useState, useEffect } from 'react';
import { Edit3, Clock, Calendar, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, Category, Priority, Recurrence } from '../types';
import { CATEGORIES } from '../lib/constants';
import { RoseCornerOrnament } from './FloralMotifs';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onDeleteRequest?: (taskId: string) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onDeleteRequest,
}) => {
  const { updateTask } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Machine Learning');
  const [priority, setPriority] = useState<Priority>('high');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(45);
  const [deadline, setDeadline] = useState('');
  const [recurrence, setRecurrence] = useState<Recurrence>('daily');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
      setPriority(task.priority);
      setEstimatedMinutes(task.estimatedMinutes);
      setDeadline(task.deadline || '');
      setRecurrence(task.recurrence);
      setNotes(task.notes || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTask(task.id, {
      title: title.trim(),
      category,
      priority,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      deadline: deadline ? deadline : undefined,
      recurrence,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden text-left max-h-[90vh] overflow-y-auto">
        <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />
        <RoseCornerOrnament position="bottom-left" className="absolute -bottom-2 -left-2" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif-title font-bold text-gray-900">
                Edit Task Rules &amp; Details
              </h3>
              <p className="text-xs text-rose-800/80">
                Authorized session (Passkey Verified)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Task Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`py-2 px-1 text-xs font-medium rounded-xl border transition cursor-pointer text-center ${
                    priority === 'high'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-rose-50/40 text-gray-700 border-rose-100'
                  }`}
                >
                  🔴 High
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`py-2 px-1 text-xs font-medium rounded-xl border transition cursor-pointer text-center ${
                    priority === 'medium'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-amber-50/40 text-gray-700 border-amber-100'
                  }`}
                >
                  🟠 Med
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`py-2 px-1 text-xs font-medium rounded-xl border transition cursor-pointer text-center ${
                    priority === 'low'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-emerald-50/40 text-gray-700 border-emerald-100'
                  }`}
                >
                  🟢 Low
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Est. Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Recurrence Rule
              </label>
              <select
                value={recurrence}
                onChange={e => setRecurrence(e.target.value as Recurrence)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              >
                <option value="daily">Daily (Resets each day)</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
                <option value="none">One-Time Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Notes &amp; Outline
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-rose-100">
            {onDeleteRequest && (
              <button
                type="button"
                onClick={() => {
                  onDeleteRequest(task.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Task
              </button>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
