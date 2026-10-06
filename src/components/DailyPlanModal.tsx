import React, { useState } from 'react';
import { Sparkles, Calendar, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DailyPlanItem } from '../types';
import { RoseCornerOrnament } from './FloralMotifs';

interface DailyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyPlanModal: React.FC<DailyPlanModalProps> = ({ isOpen, onClose }) => {
  const { tasks, updateDailyPlan } = useApp();
  const [totalHours, setTotalHours] = useState<number>(3);
  const [generatedPlan, setGeneratedPlan] = useState<DailyPlanItem[]>([]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGeneratePlan = () => {
    const totalMins = totalHours * 60;
    const activeTasks = tasks.filter(t => t.status === 'active');

    // Sort by priority (High first)
    const sorted = [...activeTasks].sort((a, b) => {
      const pMap = { high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    });

    const plan: DailyPlanItem[] = [];
    let accumulatedMins = 0;
    let startHour = 9; // 09:00 AM start
    let startMinute = 0;

    const formatTime = (h: number, m: number) => {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      return `${hh}:${mm}`;
    };

    for (const task of sorted) {
      if (accumulatedMins + task.estimatedMinutes <= totalMins) {
        plan.push({
          id: `plan-gen-${Date.now()}-${task.id}`,
          time: formatTime(startHour, startMinute),
          taskId: task.id,
          title: task.title,
          category: task.category,
          durationMinutes: task.estimatedMinutes,
          isCompleted: false,
        });

        accumulatedMins += task.estimatedMinutes;
        startMinute += task.estimatedMinutes;
        while (startMinute >= 60) {
          startHour += 1;
          startMinute -= 60;
        }

        // Add 15 min rest buffer if time allows
        if (accumulatedMins + 15 <= totalMins) {
          plan.push({
            id: `plan-gen-buffer-${Date.now()}-${Math.random()}`,
            time: formatTime(startHour, startMinute),
            title: '🌿 Floral Rest & Refreshment Break',
            category: 'Personal',
            durationMinutes: 15,
            isCompleted: false,
          });
          accumulatedMins += 15;
          startMinute += 15;
          while (startMinute >= 60) {
            startHour += 1;
            startMinute -= 60;
          }
        }
      }
    }

    setGeneratedPlan(plan);
    setIsGenerated(true);
  };

  const handleRemoveItem = (id: string) => {
    setGeneratedPlan(prev => prev.filter(p => p.id !== id));
  };

  const handleSavePlan = () => {
    updateDailyPlan(generatedPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden text-left max-h-[90vh] overflow-y-auto">
        <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />
        <RoseCornerOrnament position="bottom-left" className="absolute -bottom-2 -left-2" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif-title font-bold text-gray-900">
                Daily Study Planner
              </h3>
              <p className="text-xs text-rose-800/80">
                AI Time-Blocked Schedule Generator
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

        {!isGenerated ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-rose-900 text-sm">
              <p className="font-semibold mb-1">
                What is your available study / work time today?
              </p>
              <p className="text-xs text-rose-700/80">
                The smart scheduler will prioritize high-yield topics (ML, GATE, Aptitude) and build a balanced timeline.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Select Available Hours
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 6].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setTotalHours(h)}
                    className={`py-3 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                      totalHours === h
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                        : 'bg-rose-50/40 text-gray-700 border-rose-100 hover:bg-rose-100/60'
                    }`}
                  >
                    {h} Hours
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Optimal Daily Schedule
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Suggested Schedule ({totalHours} Hours)
              </span>
              <button
                onClick={() => setIsGenerated(false)}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium"
              >
                Change Hours
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {generatedPlan.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                      {item.time}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-[11px] text-gray-500">
                        {item.category} • {item.durationMinutes} min
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleSavePlan}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Accept &amp; Save Schedule
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
