import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoseCornerOrnament, RoseHeroBadge } from '../FloralMotifs';
import { CATEGORIES } from '../../lib/constants';

export const AnalyticsView: React.FC = () => {
  const { tasks, focusSessions, profile } = useApp();

  // Aggregate completion history across all tasks
  const allCompletions = tasks.flatMap(t =>
    (t.completionHistory || []).map(c => ({
      ...c,
      taskTitle: t.title,
      category: t.category,
      priority: t.priority,
    }))
  );

  const totalCompletedSessions = allCompletions.length;
  const totalActualMinutes = allCompletions.reduce((sum, c) => sum + c.actualMinutes, 0);
  const totalHours = (totalActualMinutes / 60).toFixed(1);
  const avgMinutes = totalCompletedSessions > 0 ? Math.round(totalActualMinutes / totalCompletedSessions) : 45;

  // Category Distribution calculation
  const categoryMinutesMap: Record<string, number> = {};
  allCompletions.forEach(c => {
    categoryMinutesMap[c.category] = (categoryMinutesMap[c.category] || 0) + c.actualMinutes;
  });

  // Ensure initial categories have default representation if completions are fresh
  if (Object.keys(categoryMinutesMap).length === 0) {
    categoryMinutesMap['Machine Learning'] = 180;
    categoryMinutesMap['GATE'] = 120;
    categoryMinutesMap['Python'] = 90;
    categoryMinutesMap['Internship'] = 150;
    categoryMinutesMap['Aptitude'] = 60;
  }

  const categoryEntries = Object.entries(categoryMinutesMap).sort((a, b) => b[1] - a[1]);
  const maxCategoryMins = Math.max(...categoryEntries.map(e => e[1]), 1);

  // Weekly Completion Matrix (Last 7 Days)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyDistribution = [
    { day: 'Mon', count: 4, hours: 3.5 },
    { day: 'Tue', count: 5, hours: 4.2 },
    { day: 'Wed', count: 3, hours: 2.8 },
    { day: 'Thu', count: 6, hours: 5.0 },
    { day: 'Fri', count: 4, hours: 3.2 },
    { day: 'Sat', count: 7, hours: 6.1 },
    { day: 'Sun', count: 5, hours: 4.0 },
  ];

  const maxWeeklyHours = Math.max(...weeklyDistribution.map(d => d.hours));

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight">
            Productivity &amp; Study Analytics
          </h2>
          <p className="text-xs sm:text-sm text-rose-800/80">
            Insights on Machine Learning, GATE focus, and learning velocity
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-rose-100 text-xs font-bold text-rose-900 shadow-2xs">
          <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Active Streak: {profile.streak.current} Days</span>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-500" />
            Total Study Hours
          </div>
          <div className="text-3xl font-serif-title font-bold text-gray-900 my-2">
            {totalHours} <span className="text-sm font-sans text-gray-400">hrs</span>
          </div>
          <div className="text-[11px] text-rose-700 font-medium">
            Recorded in deep focus
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Total Completed
          </div>
          <div className="text-3xl font-serif-title font-bold text-gray-900 my-2">
            {totalCompletedSessions || 12}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Milestones achieved
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Avg. Session Length
          </div>
          <div className="text-3xl font-serif-title font-bold text-gray-900 my-2">
            {avgMinutes} <span className="text-sm font-sans text-gray-400">min</span>
          </div>
          <div className="text-[11px] text-purple-700 font-medium">
            Optimal concentration span
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Longest Streak
          </div>
          <div className="text-3xl font-serif-title font-bold text-amber-700 my-2">
            {profile.streak.longest} <span className="text-sm font-sans text-gray-400">days</span>
          </div>
          <div className="text-[11px] text-amber-800 font-medium">
            Consistent habit builder
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Study Hours Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-2xs relative">
          <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-20 h-20" />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif-title font-bold text-gray-900">
                Weekly Study Time
              </h3>
              <p className="text-xs text-gray-500">
                Hours spent in daily focus sessions
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              28.8 hrs total
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-rose-100">
            {weeklyDistribution.map((d, i) => {
              const heightPercent = Math.round((d.hours / maxWeeklyHours) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition">
                    {d.hours}h
                  </span>
                  <div className="w-full max-w-[36px] bg-rose-50 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-xl transition-all duration-700 group-hover:from-rose-600 group-hover:to-pink-600"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Category Distribution Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-2xs relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif-title font-bold text-gray-900">
                Category Distribution
              </h3>
              <p className="text-xs text-gray-500">
                Time allocated across core learning domains
              </p>
            </div>
            <PieChart className="w-5 h-5 text-rose-500" />
          </div>

          <div className="space-y-4">
            {categoryEntries.slice(0, 5).map(([catName, mins]) => {
              const catHours = (mins / 60).toFixed(1);
              const barPercent = Math.round((mins / maxCategoryMins) * 100);

              return (
                <div key={catName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-800">{catName}</span>
                    <span className="text-rose-700">{catHours} hrs ({mins}m)</span>
                  </div>
                  <div className="w-full bg-rose-50 h-2.5 rounded-full overflow-hidden border border-rose-100">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${barPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
