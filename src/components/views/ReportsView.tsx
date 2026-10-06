import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Download,
  Flame,
  PieChart,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoseCornerOrnament, RoseHeroBadge } from '../FloralMotifs';
import { CATEGORIES } from '../../lib/constants';

export const ReportsView: React.FC = () => {
  const { tasks, profile } = useApp();
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

  // Collect all completion records
  const allCompletions = useMemo(() => {
    return tasks.flatMap(t =>
      (t.completionHistory || []).map(c => ({
        ...c,
        taskTitle: t.title,
        category: t.category,
        priority: t.priority,
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [tasks]);

  // 1. Weekly Data (Last 7 Days)
  const weeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyDistribution = [
    { day: 'Mon', hours: 3.5, count: 4, label: 'ML & Internship' },
    { day: 'Tue', hours: 4.2, count: 5, label: 'GATE & Python' },
    { day: 'Wed', hours: 2.8, count: 3, label: 'Aptitude & Records' },
    { day: 'Thu', hours: 5.0, count: 6, label: 'Deep Learning & ML' },
    { day: 'Fri', hours: 3.2, count: 4, label: 'Internship Meeting' },
    { day: 'Sat', hours: 6.1, count: 7, label: 'GATE Algorithms' },
    { day: 'Sun', hours: 4.0, count: 5, label: 'Capstone & Review' },
  ];

  const weeklyTotalHours = weeklyDistribution.reduce((acc, d) => acc + d.hours, 0).toFixed(1);
  const weeklyTotalTasks = weeklyDistribution.reduce((acc, d) => acc + d.count, 0);
  const maxWeeklyHours = Math.max(...weeklyDistribution.map(d => d.hours));

  // 2. Monthly Data (30-day heatmap grid)
  const monthlyHeatmap = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const dayNum = i + 1;
      // Deterministic realistic hours for monthly heatmap
      const hours = [3.5, 4.0, 2.5, 5.2, 3.8, 6.0, 4.5, 0, 3.2, 4.8, 5.5, 3.0, 4.2, 6.5, 2.0, 4.0, 5.0, 3.5, 4.5, 6.2, 0, 3.8, 4.2, 5.0, 4.5, 6.0, 3.5, 5.2, 4.8, 5.5][i % 30];
      return {
        day: dayNum,
        hours,
        intensity: hours >= 5 ? 'high' : hours >= 3 ? 'med' : hours > 0 ? 'low' : 'none',
      };
    });
  }, []);

  const monthlyTotalHours = monthlyHeatmap.reduce((sum, d) => sum + d.hours, 0).toFixed(1);
  const monthlyActiveDays = monthlyHeatmap.filter(d => d.hours > 0).length;

  // Category Distribution
  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {
      'Machine Learning': 18.5,
      'GATE': 14.0,
      'Internship': 12.5,
      'Python': 8.0,
      'Aptitude': 6.5,
    };
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, []);

  const maxCatHours = Math.max(...categoryStats.map(c => c[1]));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RoseHeroBadge className="w-8 h-8" />
            <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight">
              Study Reports &amp; Growth
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-rose-800/80 mt-0.5">
            Comprehensive weekly &amp; monthly productivity performance reviews
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toggle Weekly / Monthly */}
          <div className="flex bg-white/90 p-1 rounded-2xl border border-rose-200 shadow-2xs text-xs font-bold">
            <button
              onClick={() => setReportType('weekly')}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                reportType === 'weekly'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Weekly Report
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                reportType === 'monthly'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly Report
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            Export
          </button>
        </div>
      </div>

      {reportType === 'weekly' ? (
        /* WEEKLY REPORT VIEW */
        <div className="space-y-6">
          {/* 4 Weekly Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-3xl flex flex-col justify-between">
              <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-500" />
                Weekly Study Time
              </div>
              <div className="text-3xl font-serif-title font-bold text-gray-900 my-2">
                {weeklyTotalHours} <span className="text-sm font-sans text-gray-400">hrs</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18% vs last week
              </div>
            </div>

            <div className="glass-card p-5 rounded-3xl flex flex-col justify-between">
              <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Tasks Completed
              </div>
              <div className="text-3xl font-serif-title font-bold text-gray-900 my-2">
                {weeklyTotalTasks}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold">
                100% curriculum targets met
              </div>
            </div>

            <div className="glass-card p-5 rounded-3xl flex flex-col justify-between">
              <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                Active Streak
              </div>
              <div className="text-3xl font-serif-title font-bold text-rose-600 my-2">
                {profile.streak.current} <span className="text-sm font-sans text-gray-400">days</span>
              </div>
              <div className="text-[11px] text-rose-800 font-bold">
                Unbroken daily momentum
              </div>
            </div>

            <div className="glass-card p-5 rounded-3xl flex flex-col justify-between">
              <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Focus Efficiency
              </div>
              <div className="text-3xl font-serif-title font-bold text-amber-800 my-2">
                94%
              </div>
              <div className="text-[11px] text-amber-900 font-bold">
                High concentration quality
              </div>
            </div>
          </div>

          {/* Weekly Day-by-Day Chart & Category Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Daily Chart */}
            <div className="glass-card rounded-3xl p-6 relative">
              <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-20 h-20" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-serif-title font-bold text-gray-900">
                    Day-by-Day Focus Hours
                  </h3>
                  <p className="text-xs text-gray-500">
                    Daily study distribution this week
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Mon — Sun
                </span>
              </div>

              <div className="h-44 flex items-end justify-between gap-3 pt-4 pb-2 border-b border-rose-100">
                {weeklyDistribution.map((d, i) => {
                  const heightPercent = Math.round((d.hours / maxWeeklyHours) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition">
                        {d.hours}h
                      </span>
                      <div className="w-full max-w-[36px] bg-rose-100/70 rounded-t-xl overflow-hidden h-full flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-xl transition-all duration-700 group-hover:from-rose-600 group-hover:to-pink-600"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{d.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-gray-600">
                <div>• Peak Day: <strong>Saturday (6.1 hrs)</strong></div>
                <div>• Daily Average: <strong>4.1 hrs/day</strong></div>
              </div>
            </div>

            {/* Weekly Category Breakdown */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-serif-title font-bold text-gray-900">
                    Weekly Subject Allocation
                  </h3>
                  <p className="text-xs text-gray-500">
                    Time invested by learning domain
                  </p>
                </div>
                <PieChart className="w-5 h-5 text-rose-500" />
              </div>

              <div className="space-y-3.5">
                {categoryStats.map(([cat, hrs]) => {
                  const pct = Math.round((hrs / maxCatHours) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-800">{cat}</span>
                        <span className="text-rose-700">{hrs} hrs</span>
                      </div>
                      <div className="w-full bg-rose-100/60 h-2.5 rounded-full overflow-hidden border border-rose-200/60">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Study Manager Review Card */}
          <div className="glass-hero p-6 rounded-3xl relative overflow-hidden">
            <Sparkles className="w-6 h-6 text-rose-600 mb-2" />
            <h3 className="text-base font-serif-title font-bold text-gray-900 mb-1">
              AI Study Coach &amp; Weekly Review
            </h3>
            <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-medium">
              &ldquo;Janith, you accomplished remarkable progress this week with <strong>{weeklyTotalHours} total hours</strong>. Your consistency in Machine Learning (Decision Trees &amp; Neural Networks) and GATE Algorithms keeps you on track for target placements. For next week, consider scheduling an extra 30-minute speed drill on Aptitude.&rdquo;
            </p>
          </div>
        </div>
      ) : (
        /* MONTHLY REPORT VIEW */
        <div className="space-y-6">
          {/* Monthly Summary Banner */}
          <div className="glass-hero p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-white/80 px-3 py-1 rounded-full border border-rose-200">
                Monthly Milestone Report • October 2026
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 mt-2">
                {monthlyTotalHours} Total Hours Dedicated
              </h3>
              <p className="text-xs sm:text-sm text-rose-900 mt-1 max-w-xl">
                Active on {monthlyActiveDays} out of 30 days with strong GATE and AI internship velocity.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/90 p-3.5 rounded-2xl border border-rose-200 text-center min-w-[90px]">
                <div className="text-2xl font-serif-title font-bold text-rose-600">{monthlyActiveDays}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Active Days</div>
              </div>
              <div className="bg-white/90 p-3.5 rounded-2xl border border-rose-200 text-center min-w-[90px]">
                <div className="text-2xl font-serif-title font-bold text-emerald-600">42</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Tasks Done</div>
              </div>
            </div>
          </div>

          {/* 30-Day Productivity Heatmap Grid */}
          <div className="glass-card rounded-3xl p-6 relative">
            <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-24 h-24" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-serif-title font-bold text-gray-900">
                  30-Day Activity Heatmap
                </h3>
                <p className="text-xs text-gray-500">
                  Daily study intensity throughout the month
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                <span>Less</span>
                <span className="w-3 h-3 rounded bg-rose-50 border border-rose-200"></span>
                <span className="w-3 h-3 rounded bg-rose-200"></span>
                <span className="w-3 h-3 rounded bg-rose-400"></span>
                <span className="w-3 h-3 rounded bg-rose-600"></span>
                <span>More</span>
              </div>
            </div>

            {/* Heatmap Grid (30 Days) */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {monthlyHeatmap.map(d => (
                <div
                  key={d.day}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer group flex flex-col justify-between ${
                    d.intensity === 'high'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                      : d.intensity === 'med'
                      ? 'bg-rose-400 text-white border-rose-500'
                      : d.intensity === 'low'
                      ? 'bg-rose-100 text-rose-900 border-rose-200'
                      : 'bg-rose-50/50 text-gray-400 border-rose-100'
                  }`}
                  title={`Day ${d.day}: ${d.hours} hours`}
                >
                  <span className="text-[10px] font-bold opacity-80">{d.day}</span>
                  <span className="text-xs font-bold mt-1">{d.hours > 0 ? `${d.hours}h` : '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Badges & Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
                🏆
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">50+ Hours ML Mastery</h4>
                <p className="text-[11px] text-rose-700 font-medium">Completed in October</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
                🎯
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">GATE Marathoner</h4>
                <p className="text-[11px] text-purple-700 font-medium">30 Algorithms Solved</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                🔥
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">14-Day Streak Champion</h4>
                <p className="text-[11px] text-amber-800 font-medium">Top Consistency Award</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
