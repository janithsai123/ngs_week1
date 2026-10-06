import React from 'react';
import { AlertCircle, Play, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoseCornerOrnament } from './FloralMotifs';

interface FocusLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTaskTitle?: string;
  onExitFocus: () => void;
}

export const FocusLockModal: React.FC<FocusLockModalProps> = ({
  isOpen,
  onClose,
  targetTaskTitle,
  onExitFocus,
}) => {
  const { activeFocusTask, focusTimer } = useApp();

  if (!isOpen || !activeFocusTask) return null;

  const minutesRemaining = Math.ceil(focusTimer.remainingSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden text-center">
        <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />
        <RoseCornerOrnament position="bottom-left" className="absolute -bottom-2 -left-2" />

        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wide uppercase bg-rose-50 text-rose-700 rounded-full border border-rose-200">
          Focus Session Active
        </div>

        <h3 className="text-xl font-serif-title font-bold text-gray-900 mb-2">
          Focus Lock in Progress
        </h3>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          You are currently focusing on{' '}
          <strong className="text-rose-700 font-semibold">{activeFocusTask.title}</strong>
          {minutesRemaining > 0 && ` (${minutesRemaining}m remaining)`}.
        </p>

        {targetTaskTitle && (
          <div className="p-3 mb-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500">
            Cannot switch to &ldquo;{targetTaskTitle}&rdquo;. Complete or exit the current focus session before opening another task.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-2">
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Continue Current Task
          </button>
          <button
            onClick={() => {
              onExitFocus();
              onClose();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-gray-500" />
            Exit Focus Mode
          </button>
        </div>
      </div>
    </div>
  );
};
