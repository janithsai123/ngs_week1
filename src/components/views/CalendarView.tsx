import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, Category } from '../../types';
import { CATEGORIES } from '../../lib/constants';
import { RoseCornerOrnament } from '../FloralMotifs';

export const CalendarView: React.FC = () => {
  const { calendarEvents, tasks, addCalendarEvent, deleteCalendarEvent } = useApp();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Machine Learning');
  const [newTime, setNewTime] = useState('10:00');
  const [newDuration, setNewDuration] = useState(60);
  const [newType, setNewType] = useState<CalendarEvent['type']>('study');

  // Month navigation
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar matrix calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonthDate = new Date(year, month - 1, d);
    calendarDays.push({
      day: d,
      dateStr: prevMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const mStr = (month + 1).toString().padStart(2, '0');
    const dStr = i.toString().padStart(2, '0');
    calendarDays.push({
      day: i,
      dateStr: `${year}-${mStr}-${dStr}`,
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill 35 or 42 grid cells
  const remaining = 35 - calendarDays.length > 0 ? 35 - calendarDays.length : 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    calendarDays.push({
      day: i,
      dateStr: nextMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
    });
  }

  // Events & Tasks for the selected date
  const eventsForSelectedDate = calendarEvents.filter(e => e.date === selectedDateStr);
  const tasksDueOnSelectedDate = tasks.filter(t => t.deadline === selectedDateStr);
  const tasksCompletedOnSelectedDate = tasks.flatMap(t =>
    t.completionHistory.filter(h => h.date === selectedDateStr).map(h => ({ ...t, completionRecord: h }))
  );

  const totalMinutesForDate =
    eventsForSelectedDate.reduce((sum, e) => sum + e.durationMinutes, 0) +
    tasksCompletedOnSelectedDate.reduce((sum, t) => sum + t.completionRecord.actualMinutes, 0);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle.trim(),
      date: selectedDateStr,
      time: newTime,
      durationMinutes: Number(newDuration) || 30,
      category: newCategory,
      isCompleted: false,
      type: newType,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight">
            Study &amp; Deadlines Calendar
          </h2>
          <p className="text-xs sm:text-sm text-rose-800/80">
            Track study blocks, project milestones, and GATE deadlines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-rose-50/70 p-1 rounded-xl border border-rose-100 text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'month' ? 'bg-white text-rose-700 font-bold shadow-2xs' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'day' ? 'bg-white text-rose-700 font-bold shadow-2xs' : 'text-gray-600'
              }`}
            >
              Day Detail
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-xs sm:text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Add Event
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left (2/3), Date Inspector on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-2xs relative">
          <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-24 h-24" />

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-rose-600" />
              <h3 className="text-lg font-serif-title font-bold text-gray-900">
                {monthNames[month]} {year}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-rose-50 transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDateStr(todayStr);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-rose-50 transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-rose-800 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateStr === selectedDateStr;
              const isToday = item.dateStr === todayStr;

              // Find badges for this date
              const dayEvents = calendarEvents.filter(e => e.date === item.dateStr);
              const dayDeadlines = tasks.filter(t => t.deadline === item.dateStr);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateStr(item.dateStr)}
                  className={`min-h-[70px] sm:min-h-[84px] p-1.5 rounded-2xl text-left transition flex flex-col justify-between border cursor-pointer ${
                    isSelected
                      ? 'bg-rose-100/70 border-rose-400 ring-2 ring-rose-300'
                      : isToday
                      ? 'bg-rose-50/50 border-rose-200'
                      : item.isCurrentMonth
                      ? 'bg-white border-rose-50 hover:bg-rose-50/40 hover:border-rose-200'
                      : 'bg-gray-50/40 border-transparent text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'text-rose-900'
                          : item.isCurrentMonth
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>

                  {/* Day Dot Badges */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayDeadlines.map(d => (
                      <div
                        key={d.id}
                        className="text-[9px] font-bold text-red-700 bg-red-100/90 px-1 py-0.5 rounded truncate flex items-center gap-0.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                        <span className="truncate">{d.title}</span>
                      </div>
                    ))}
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        className="text-[9px] font-medium text-rose-800 bg-rose-100/80 px-1 py-0.5 rounded truncate flex items-center gap-0.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span className="truncate">{e.title}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Inspector */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-2xs space-y-4">
          <div className="border-b border-rose-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Selected Day
            </span>
            <h3 className="text-lg font-serif-title font-bold text-gray-900 mt-1">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              <span>Study Time: <strong>{totalMinutesForDate} min</strong></span>
            </div>
          </div>

          {/* Upcoming Deadlines for Date */}
          {tasksDueOnSelectedDate.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Deadlines On This Date
              </h4>
              <div className="space-y-1.5">
                {tasksDueOnSelectedDate.map(t => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs">
                    <div className="font-bold text-red-900">{t.title}</div>
                    <div className="text-[10px] text-red-700">{t.category} • Priority: {t.priority}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Calendar Events */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Scheduled Events ({eventsForSelectedDate.length})
              </h4>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-[11px] text-rose-600 font-semibold hover:text-rose-800"
              >
                + Add
              </button>
            </div>

            {eventsForSelectedDate.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">
                No custom schedule blocks on this date.
              </p>
            ) : (
              <div className="space-y-2">
                {eventsForSelectedDate.map(evt => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{evt.title}</div>
                      <div className="text-[10px] text-gray-500">
                        {evt.time && `${evt.time} • `}{evt.durationMinutes} min • {evt.category}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCalendarEvent(evt.id)}
                      className="text-gray-400 hover:text-red-600 text-xs p-1"
                      title="Delete event"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Sessions Log for this Date */}
          {tasksCompletedOnSelectedDate.length > 0 && (
            <div className="pt-2 border-t border-rose-50">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed Sessions
              </h4>
              <div className="space-y-1.5">
                {tasksCompletedOnSelectedDate.map((t, i) => (
                  <div key={i} className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs flex justify-between">
                    <span className="font-medium text-emerald-950">{t.title}</span>
                    <span className="text-emerald-700 font-bold">{t.completionRecord.actualMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Calendar Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden text-left">
            <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />

            <h3 className="text-xl font-serif-title font-bold text-gray-900 mb-1">
              Add Schedule Block
            </h3>
            <p className="text-xs text-rose-800 mb-4">
              Date: {selectedDateStr}
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GATE Revision Sprint or Internship Review"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as Category)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as CalendarEvent['type'])}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  >
                    <option value="study">Study Block</option>
                    <option value="meeting">Meeting</option>
                    <option value="task">Task Milestone</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time (HH:MM)</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  Save Schedule Block
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
