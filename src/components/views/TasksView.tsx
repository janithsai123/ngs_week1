import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Filter,
  ArrowUpDown,
  Clock,
  Calendar,
  Play,
  CheckCircle2,
  RotateCcw,
  Edit3,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Category, Priority } from '../../types';
import { CATEGORIES } from '../../lib/constants';
import { FloralEmptyState } from '../FloralMotifs';

interface TasksViewProps {
  onOpenAddTask: () => void;
  onRequestFocus: (task: Task) => void;
  onRequestComplete: (task: Task) => void;
  onSelectTaskToEdit: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  onOpenAddTask,
  onRequestFocus,
  onRequestComplete,
  onSelectTaskToEdit,
}) => {
  const { tasks, reopenTask } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed_today'>('active');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'duration' | 'title' | 'deadline'>('priority');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Status filter
        if (statusFilter !== 'all' && task.status !== statusFilter) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchCategory = task.category.toLowerCase().includes(q);
          const matchNotes = (task.notes || '').toLowerCase().includes(q);
          const matchPriority = task.priority.toLowerCase().includes(q);
          if (!matchTitle && !matchCategory && !matchNotes && !matchPriority) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const pOrder = { high: 3, medium: 2, low: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        if (sortBy === 'duration') {
          return a.estimatedMinutes - b.estimatedMinutes;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'deadline') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy]);

  const activeCount = tasks.filter(t => t.status === 'active').length;
  const completedCount = tasks.filter(t => t.status === 'completed_today').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight">
            Study &amp; Goal Tasks
          </h2>
          <p className="text-xs sm:text-sm text-rose-800/80">
            {activeCount} active tasks • {completedCount} completed today
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          + Add Task
        </button>
      </div>

      {/* Search & Filtering Bar */}
      <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by task name, category, notes, or priority (e.g. 'machine', 'GATE', 'high')..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/20"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-rose-50/50 p-1 rounded-xl border border-rose-100 text-xs">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === 'active' ? 'bg-white text-rose-700 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Incomplete ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed_today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === 'completed_today' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-gray-800 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({tasks.length})
            </button>
          </div>

          {/* Category & Priority Selectors */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as Priority | 'all')}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟠 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as Category | 'all')}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <div className="flex items-center gap-1 bg-white border border-rose-200 rounded-xl px-2 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'priority' | 'duration' | 'title' | 'deadline')}
                className="bg-transparent text-gray-700 focus:outline-none text-xs"
              >
                <option value="priority">Priority First</option>
                <option value="duration">Shortest Duration</option>
                <option value="deadline">Nearest Deadline</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Render */}
      {filteredTasks.length === 0 ? (
        <FloralEmptyState
          title="No tasks match your filters"
          message="Try resetting your search query or selecting 'All' filters to view your curriculum."
          actionText="+ Add New Task"
          onAction={onOpenAddTask}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map(task => {
            const isCompleted = task.status === 'completed_today';

            return (
              <div
                key={task.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/20 border-emerald-200 opacity-80'
                    : 'bg-white border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Category & Priority Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
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

                    <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                      {task.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-base font-bold text-gray-900 mb-1.5 ${
                      isCompleted ? 'line-through text-gray-400 decoration-emerald-500' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Notes */}
                  {task.notes && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                      {task.notes}
                    </p>
                  )}
                </div>

                <div>
                  {/* Meta Tags */}
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 py-2 border-t border-rose-50 mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {task.estimatedMinutes}m est.
                    </span>

                    {task.deadline && (
                      <span className="flex items-center gap-1 text-rose-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        Due: {task.deadline}
                      </span>
                    )}

                    <span className="text-gray-400 capitalize">
                      {task.recurrence} recurrence
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectTaskToEdit(task)}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-rose-700 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                      title="Edit task rules (Protected by passkey)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <button
                          onClick={() => reopenTask(task.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold transition cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reopen
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onRequestFocus(task)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-semibold shadow-2xs hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            Focus
                          </button>

                          <button
                            onClick={() => onRequestComplete(task)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ✓ Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
