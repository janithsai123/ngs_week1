import React, { useState, useMemo } from 'react';
import {
  History as HistoryIcon,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category, Priority } from '../../types';
import { CATEGORIES } from '../../lib/constants';
import { FloralEmptyState, RoseCornerOrnament } from '../FloralMotifs';

export const HistoryView: React.FC = () => {
  const { tasks } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchDate, setSearchDate] = useState<string>('');

  // Collect all completion records
  const allRecords = useMemo(() => {
    const list: {
      id: string;
      taskId: string;
      title: string;
      category: Category;
      priority: Priority;
      date: string;
      timestamp: string;
      actualMinutes: number;
      estimatedMinutes: number;
      notes?: string;
    }[] = [];

    tasks.forEach(task => {
      (task.completionHistory || []).forEach(record => {
        list.push({
          id: record.id,
          taskId: task.id,
          title: task.title,
          category: task.category,
          priority: task.priority,
          date: record.date,
          timestamp: record.timestamp,
          actualMinutes: record.actualMinutes,
          estimatedMinutes: record.estimatedMinutes,
          notes: record.notes,
        });
      });

      // Also include tasks currently marked completed_today if history is empty
      if (task.status === 'completed_today' && (!task.completionHistory || task.completionHistory.length === 0)) {
        list.push({
          id: `hist-${task.id}`,
          taskId: task.id,
          title: task.title,
          category: task.category,
          priority: task.priority,
          date: new Date().toISOString().split('T')[0],
          timestamp: task.lastCompletedAt || new Date().toISOString(),
          actualMinutes: task.actualMinutes || task.estimatedMinutes,
          estimatedMinutes: task.estimatedMinutes,
          notes: task.notes,
        });
      }
    });

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [tasks]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
      if (searchDate && r.date !== searchDate) return false;
      return true;
    });
  }, [allRecords, categoryFilter, priorityFilter, searchDate]);

  // Group by date
  const groupedByDate: Record<string, typeof filteredRecords> = {};
  filteredRecords.forEach(r => {
    if (!groupedByDate[r.date]) {
      groupedByDate[r.date] = [];
    }
    groupedByDate[r.date].push(r);
  });

  const dateGroups = Object.entries(groupedByDate);

  const formatDateHeader = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight">
            Task Completion History
          </h2>
          <p className="text-xs sm:text-sm text-rose-800/80">
            Chronological log of completed study sessions and milestones
          </p>
        </div>

        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
          {filteredRecords.length} Completed Sessions
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as Category | 'all')}
            className="px-3 py-2 rounded-xl border border-rose-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as Priority | 'all')}
            className="px-3 py-2 rounded-xl border border-rose-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟠 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          {/* Date Picker */}
          <div className="flex items-center gap-1 bg-white border border-rose-200 rounded-xl px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <input
              type="date"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
              className="bg-transparent text-xs text-gray-700 focus:outline-none"
            />
          </div>
        </div>

        {searchDate && (
          <button
            onClick={() => setSearchDate('')}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
          >
            Clear Date Filter
          </button>
        )}
      </div>

      {/* Grouped Log */}
      {dateGroups.length === 0 ? (
        <FloralEmptyState
          title="No history records found"
          message="Complete tasks using the ✓ Complete button or finish a Focus Session to record historical data."
        />
      ) : (
        <div className="space-y-6">
          {dateGroups.map(([dateKey, items]) => (
            <div key={dateKey} className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-2xs relative">
              <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-20 h-20" />

              <div className="flex items-center justify-between border-b border-rose-50 pb-3 mb-4">
                <h3 className="text-base font-serif-title font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  {formatDateHeader(dateKey)}
                </h3>
                <span className="text-xs font-semibold text-rose-700">
                  {items.length} completed • {items.reduce((s, it) => s + it.actualMinutes, 0)} min total
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-rose-50/30 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap text-gray-500">
                          <span className="font-medium text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            Actual: <strong>{item.actualMinutes}m</strong> (Est: {item.estimatedMinutes}m)
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-gray-600 mt-1 italic">
                            &ldquo;{item.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-400 font-mono self-end sm:self-center">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
