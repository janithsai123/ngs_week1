import React, { useState } from 'react';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { RoseCornerOrnament } from './FloralMotifs';

interface CompleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onConfirm: (taskId: string, actualMinutes?: number, notes?: string) => void;
}

export const CompleteConfirmModal: React.FC<CompleteConfirmModalProps> = ({
  isOpen,
  onClose,
  task,
  onConfirm,
}) => {
  const [actualMinutes, setActualMinutes] = useState<number>(30);
  const [completionNotes, setCompletionNotes] = useState<string>('');

  React.useEffect(() => {
    if (task) {
      setActualMinutes(task.estimatedMinutes || 30);
      setCompletionNotes('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleComplete = () => {
    onConfirm(task.id, actualMinutes, completionNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-7 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden text-center">
        <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />
        <RoseCornerOrnament position="bottom-left" className="absolute -bottom-2 -left-2" />

        <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          Mark as Completed (janith_completed)
        </div>

        <h3 className="text-xl font-serif-title font-bold text-gray-900 mb-1">
          Mark this task as completed?
        </h3>

        <p className="text-sm font-semibold text-rose-700 mb-4">
          &ldquo;{task.title}&rdquo;
        </p>

        <div className="space-y-3 mb-5 text-left bg-rose-50/40 p-3.5 rounded-2xl border border-rose-100">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              Actual Time Spent (Minutes)
            </label>
            <input
              type="number"
              min="1"
              max="600"
              value={actualMinutes}
              onChange={e => setActualMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Session Accomplishment Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Solved 12 GATE DP questions, understood proof"
              value={completionNotes}
              onChange={e => setCompletionNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            />
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={handleComplete}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-md hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer"
          >
            YES, COMPLETE
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
