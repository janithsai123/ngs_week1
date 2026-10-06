import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Sparkles,
  Volume2,
  VolumeX,
  Target,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoseCornerOrnament, RoseHeroBadge } from '../FloralMotifs';

interface FocusModeViewProps {
  onOpenRecommend: () => void;
  onNavigateTasks: () => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  onOpenRecommend,
  onNavigateTasks,
}) => {
  const {
    activeFocusTask,
    focusTimer,
    pauseFocusTimer,
    resumeFocusTimer,
    adjustFocusTime,
    exitFocusMode,
    completeActiveFocusTask,
    settings,
    updateSettings,
    updateTask,
  } = useApp();

  const [sessionNotes, setSessionNotes] = useState('');

  if (!activeFocusTask) {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center max-w-xl mx-auto rounded-3xl bg-white border border-rose-100 shadow-sm relative overflow-hidden animate-fadeIn">
        <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-28 h-28" />
        <RoseCornerOrnament position="bottom-left" className="absolute bottom-0 left-0 w-28 h-28" />

        <div className="w-20 h-20 mb-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
          <Target className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-serif-title font-bold text-gray-900 mb-2">
          No Active Focus Session
        </h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-md">
          Select a task to enter single-task Focus Mode. Other tasks will be locked until you finish, eliminating context switching.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onOpenRecommend}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            Recommend Task Based on Time
          </button>
          <button
            onClick={onNavigateTasks}
            className="px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-sm transition cursor-pointer"
          >
            Browse All Tasks
          </button>
        </div>
      </div>
    );
  }

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const elapsedMins = Math.round(focusTimer.elapsedSeconds / 60);
  const progressRatio = focusTimer.initialSeconds > 0
    ? ((focusTimer.initialSeconds - focusTimer.remainingSeconds) / focusTimer.initialSeconds) * 100
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Immersive Focus Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-rose-200 shadow-xl p-6 sm:p-10 text-center">
        <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-36 h-36" />
        <RoseCornerOrnament position="bottom-left" className="absolute bottom-0 left-0 w-36 h-36" />

        {/* Top Focus Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider border border-rose-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            FOCUS MODE ACTIVE
          </div>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 text-gray-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition cursor-pointer"
            title={settings.soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-rose-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Active Task Title & Category */}
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 mb-2">
            {activeFocusTask.category}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight">
            {activeFocusTask.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            Estimated: {activeFocusTask.estimatedMinutes} minutes • Elapsed: {elapsedMins} min
          </p>
        </div>

        {/* Circular / Linear Countdown Display */}
        <div className="relative my-8 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG Radial Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-rose-100"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-rose-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progressRatio) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-mono font-bold text-gray-900 tracking-tight">
                {formatTime(focusTimer.remainingSeconds)}
              </span>
              <span className="text-xs font-medium text-rose-600 mt-1 uppercase tracking-wider">
                {focusTimer.isRunning ? 'Deep Concentration' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Quick Time Adjusters (+5m / -5m) */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => adjustFocusTime(-300)}
              disabled={focusTimer.remainingSeconds <= 300}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <Minus className="w-3 h-3" /> 5m
            </button>
            <button
              onClick={() => adjustFocusTime(300)}
              className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 5m
            </button>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          {focusTimer.isRunning ? (
            <button
              onClick={pauseFocusTimer}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4 fill-white" />
              PAUSE
            </button>
          ) : (
            <button
              onClick={resumeFocusTimer}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              RESUME
            </button>
          )}

          <button
            onClick={() => completeActiveFocusTask(sessionNotes)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            COMPLETE TASK
          </button>

          <button
            onClick={exitFocusMode}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-gray-500" />
            EXIT FOCUS MODE
          </button>
        </div>

        {/* Task Notes & Scratchpad */}
        <div className="text-left bg-rose-50/40 p-4 rounded-2xl border border-rose-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wide mb-2">
            <BookOpen className="w-3.5 h-3.5 text-rose-600" />
            Task Roadmap &amp; Focus Scratchpad
          </div>
          {activeFocusTask.notes && (
            <p className="text-xs text-gray-700 mb-2 bg-white/80 p-2.5 rounded-xl border border-rose-100 font-medium">
              {activeFocusTask.notes}
            </p>
          )}
          <textarea
            rows={2}
            placeholder="Jot down notes, formulas, or immediate thoughts during this session..."
            value={sessionNotes}
            onChange={e => setSessionNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
