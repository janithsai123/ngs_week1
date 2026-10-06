import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  ArrowRight,
  TrendingUp,
  Calendar,
  RotateCcw,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { RoseCornerOrnament, RoseHeroBadge, FloralEmptyState } from '../FloralMotifs';

interface DashboardViewProps {
  onOpenRecommend: () => void;
  onOpenAddTask: () => void;
  onOpenDailyPlan: () => void;
  onRequestFocus: (task: Task) => void;
  onRequestComplete: (task: Task) => void;
  onSelectTaskToEdit: (task: Task) => void;
  onNavigateTasks: () => void;
  onNavigateCalendar: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenRecommend,
  onOpenAddTask,
  onOpenDailyPlan,
  onRequestFocus,
  onRequestComplete,
  onSelectTaskToEdit,
  onNavigateTasks,
  onNavigateCalendar,
}) => {
  const { tasks, profile, dailyPlan, toggleDailyPlanItem, reopenTask } = useApp();

  const activeTasks = tasks.filter(t => t.status === 'active');
  const completedTodayTasks = tasks.filter(t => t.status === 'completed_today');
  const totalTasks = activeTasks.length + completedTodayTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTodayTasks.length / totalTasks) * 100) : 0;

  // Find top priority task
  const topPriorityTask = activeTasks.find(t => t.priority === 'high') || activeTasks[0];

  // Calculate total estimated remaining time
  const remainingMinutes = activeTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);
  const remainingHoursFormatted = (remainingMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-16">
      {/* 1. Hero Motivation Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-hero p-6 sm:p-8">
        <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-36 h-36" />
        <RoseCornerOrnament position="bottom-left" className="absolute bottom-0 left-0 w-28 h-28" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-white/90 text-rose-800 text-xs font-bold shadow-2xs border border-rose-200">
              <RoseHeroBadge className="w-4 h-4" />
              <span>Personal Study Planner &amp; AI Goal Track</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight mb-2">
              Master Your Focus, <span className="text-rose-600">Janith</span>.
            </h2>
            <p className="text-sm text-rose-950/90 leading-relaxed max-w-xl font-normal">
              &ldquo;Small progress every day becomes a big achievement. Maintain your Machine Learning, GATE, and Placement momentum.&rdquo;
            </p>
          </div>

          {/* Big "What Should I Do Now?" Hero Button */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenRecommend}
              className="w-full md:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer ring-4 ring-rose-300/60"
            >
              <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200 animate-spin" />
              <span>WHAT SHOULD I DO NOW?</span>
              <ArrowRight className="w-5 h-5 text-white/90" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Dashboard Metrics Grid (6 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Today's Progress */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-2 glass-card p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
            <span className="flex items-center gap-1.5 text-rose-950 font-bold">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              Today&apos;s Progress
            </span>
            <span className="font-bold text-rose-600 text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full bg-rose-100/70 h-2.5 rounded-full overflow-hidden border border-rose-200/60 mb-2">
            <div
              className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 flex justify-between font-medium">
            <span>{completedTodayTasks.length} / {totalTasks} completed</span>
            <span className="text-rose-700 font-semibold">{activeTasks.length} left</span>
          </div>
        </div>

        {/* Metric 2: Completed Today */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Done Today
          </div>
          <div className="text-2xl font-serif-title font-bold text-gray-900 my-1">
            {completedTodayTasks.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {completedTodayTasks.length > 0 ? 'Consistent work!' : 'Ready to start'}
          </div>
        </div>

        {/* Metric 3: Remaining Tasks */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Remaining
          </div>
          <div className="text-2xl font-serif-title font-bold text-gray-900 my-1">
            {activeTasks.length}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold">
            ~{remainingHoursFormatted}h workload
          </div>
        </div>

        {/* Metric 4: Current Streak */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            Streak
          </div>
          <div className="text-2xl font-serif-title font-bold text-rose-600 my-1 flex items-baseline gap-1">
            {profile.streak.current} <span className="text-xs font-sans text-gray-500 font-normal">days</span>
          </div>
          <div className="text-[11px] text-rose-800 font-semibold">
            Best: {profile.streak.longest}d
          </div>
        </div>

        {/* Metric 5: Today's Priority */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-500" />
            Top Focus
          </div>
          <div className="text-xs font-bold text-gray-900 my-1 line-clamp-2" title={topPriorityTask?.title}>
            {topPriorityTask ? topPriorityTask.title : 'All Done 🎉'}
          </div>
          <div className="text-[11px] text-purple-800 font-semibold">
            {topPriorityTask ? `${topPriorityTask.category} • ${topPriorityTask.estimatedMinutes}m` : 'Take a rest'}
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Remaining Tasks (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif-title font-bold text-gray-900">
                Remaining Tasks ({activeTasks.length})
              </h3>
              <span className="text-xs bg-rose-50/90 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                Priority Ordered
              </span>
            </div>
            <button
              onClick={onNavigateTasks}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeTasks.length === 0 ? (
            <FloralEmptyState
              title="Everything is done for today! 🎉"
              message="You completed all planned tasks. You can reopen completed tasks below or create a new session."
              actionText="+ Add Another Task"
              onAction={onOpenAddTask}
            />
          ) : (
            <div className="space-y-2.5">
              {activeTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl glass-card group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          task.priority === 'high'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : task.priority === 'medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}
                      >
                        {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟠' : '🟢'}{' '}
                        {task.priority.toUpperCase()}
                      </span>

                      <span className="text-[11px] font-semibold text-rose-800 bg-rose-50/90 px-2 py-0.5 rounded-md border border-rose-100">
                        {task.category}
                      </span>

                      <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {task.estimatedMinutes}m
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-rose-700 transition truncate">
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {task.notes}
                      </p>
                    )}
                  </div>

                  {/* Task Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-100/60">
                    <button
                      onClick={() => onRequestFocus(task)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-semibold shadow-2xs hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
                      title="Start Focus Session"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      Focus
                    </button>

                    <button
                      onClick={() => onRequestComplete(task)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition cursor-pointer"
                      title="Mark as Completed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ✓ Complete
                    </button>

                    <button
                      onClick={() => onSelectTaskToEdit(task)}
                      className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-rose-50/80 rounded-lg text-xs transition cursor-pointer"
                      title="Edit Task Rules"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Today Section */}
          {completedTodayTasks.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-serif-title font-bold text-gray-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Completed Today ({completedTodayTasks.length})
                </h3>
              </div>

              <div className="space-y-2">
                {completedTodayTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <div>
                        <span className="font-semibold text-gray-800 line-through decoration-emerald-500">
                          {task.title}
                        </span>
                        <div className="text-[10px] text-gray-500">
                          {task.category} • {task.actualMinutes || task.estimatedMinutes}m recorded
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => reopenTask(task.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-rose-700 font-semibold px-2 py-1 rounded bg-white border border-gray-200 transition cursor-pointer"
                      title="Reopen task if needed"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reopen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Today's Plan Timeline (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl glass-card relative">
            <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-20 h-20" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <h3 className="text-base font-serif-title font-bold text-gray-900">
                  Today&apos;s Plan
                </h3>
              </div>
              <button
                onClick={onOpenDailyPlan}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                + Auto Plan
              </button>
            </div>

            <div className="space-y-2.5">
              {dailyPlan.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleDailyPlanItem(item.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    item.isCompleted
                      ? 'bg-emerald-50/60 border-emerald-200 text-gray-500'
                      : 'bg-white/80 border-rose-100 hover:bg-rose-50/60 text-gray-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.time}
                    </span>
                    <div>
                      <div className={`text-xs font-medium ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {item.title}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {item.durationMinutes} min
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs ${item.isCompleted ? 'text-emerald-600 font-bold' : 'text-gray-300'}`}>
                    {item.isCompleted ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onNavigateCalendar}
              className="w-full mt-4 py-2 text-center text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50/80 hover:bg-rose-100/90 rounded-xl transition cursor-pointer border border-rose-100"
            >
              Open Full Calendar View →
            </button>
          </div>

          {/* Focus Rule Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/90 to-rose-50/70 border border-rose-200/80 backdrop-blur-md shadow-2xs">
            <h4 className="text-xs font-bold text-rose-950 mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-rose-600" />
              Janith&apos;s Focus Rule
            </h4>
            <p className="text-[11px] text-rose-900/90 leading-relaxed font-normal">
              When working in Focus Mode, other tasks are locked to prevent multi-tasking. Complete your session to build the streak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
