import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, ArrowRight, RefreshCw, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTaskRecommendations } from '../lib/recommendation';
import { RecommendationResult } from '../types';
import { RoseCornerOrnament, RoseHeroBadge } from './FloralMotifs';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocus: (task: RecommendationResult['task'], durationMinutes: number) => void;
}

const TIME_OPTIONS = [
  { label: '15 min', minutes: 15 },
  { label: '20 min', minutes: 20 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hours', minutes: 90 },
  { label: '2 hours', minutes: 120 },
];

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  onStartFocus,
}) => {
  const { tasks } = useApp();
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Recalculate when time changes
  useEffect(() => {
    if (selectedMinutes && selectedMinutes > 0) {
      const recs = calculateTaskRecommendations(tasks, selectedMinutes);
      setRecommendations(recs);
      setCurrentIndex(0);
    }
  }, [selectedMinutes, tasks]);

  if (!isOpen) return null;

  const currentRec = recommendations[currentIndex];
  const hasMore = recommendations.length > 1;

  const handleSelectTime = (mins: number) => {
    setSelectedMinutes(mins);
    setIsCustom(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0) {
      setSelectedMinutes(val);
    }
  };

  const handleNextCandidate = () => {
    if (recommendations.length > 0) {
      setCurrentIndex(prev => (prev + 1) % recommendations.length);
    }
  };

  const handleStart = () => {
    if (currentRec && selectedMinutes) {
      onStartFocus(currentRec.task, selectedMinutes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden text-left">
        <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />
        <RoseCornerOrnament position="bottom-left" className="absolute -bottom-2 -left-2" />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  AI Study Decision Engine
                </span>
              </div>
              <h2 className="text-2xl font-serif-title font-bold text-gray-900 mt-1">
                What Should I Do Now?
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Select Available Time */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-500" />
            How much time do you have?
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-2">
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.minutes}
                type="button"
                onClick={() => handleSelectTime(opt.minutes)}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer border text-center ${
                  selectedMinutes === opt.minutes && !isCustom
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                    : 'bg-rose-50/40 text-gray-700 border-rose-100 hover:bg-rose-100/60 hover:border-rose-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                setSelectedMinutes(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer border text-center ${
                isCustom
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                  : 'bg-rose-50/40 text-gray-700 border-rose-100 hover:bg-rose-100/60'
              }`}
            >
              Custom...
            </button>
          </div>

          {isCustom && (
            <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
              <input
                type="number"
                min="5"
                max="480"
                placeholder="Enter minutes (e.g. 25)"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                className="flex-1 px-4 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-xl hover:bg-rose-600 transition cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}
        </div>

        {/* Step 2: Show Recommendation */}
        {selectedMinutes && selectedMinutes > 0 && (
          <div className="animate-fadeIn">
            {recommendations.length === 0 ? (
              <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
                <RoseHeroBadge className="w-10 h-10 mb-2" />
                <h4 className="text-lg font-serif-title font-semibold text-rose-950 mb-1">
                  Everything is done for today! 🎉
                </h4>
                <p className="text-sm text-rose-800">
                  You completed all planned tasks. You can reopen completed tasks or add a new task.
                </p>
              </div>
            ) : (
              currentRec && (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white border border-rose-200/80 shadow-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Top Recommended ({currentIndex + 1} of {recommendations.length})
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      Available: <strong className="text-rose-600">{selectedMinutes} min</strong>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                    🎯 {currentRec.task.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      {currentRec.task.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-500" />
                      Est: {currentRec.task.estimatedMinutes}m
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        currentRec.task.priority === 'high'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : currentRec.task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >
                      {currentRec.task.priority === 'high' ? '🔴' : currentRec.task.priority === 'medium' ? '🟠' : '🟢'}{' '}
                      {currentRec.task.priority.toUpperCase()} Priority
                    </span>
                  </div>

                  {/* Why this task explanation */}
                  <div className="p-3.5 rounded-xl bg-white/90 border border-rose-100 mb-5">
                    <div className="text-xs font-bold text-rose-900 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                      Why This Task?
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2 font-medium">
                      &ldquo;{currentRec.reasoning}&rdquo;
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-500 pt-2 border-t border-rose-50">
                      <div>• {currentRec.details.timeFit}</div>
                      <div>• {currentRec.details.workloadContext}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleStart}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
                    >
                      START TASK
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {hasMore && (
                      <button
                        onClick={handleNextCandidate}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-rose-200 text-gray-700 hover:bg-rose-50 font-medium text-sm transition cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 text-rose-500" />
                        Choose Another ({currentIndex + 1}/{recommendations.length})
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
