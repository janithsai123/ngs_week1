import React, { useState } from 'react';
import {
  User,
  Edit3,
  Flame,
  Award,
  BookOpen,
  Target,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoseCornerOrnament, RoseHeroBadge } from '../FloralMotifs';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, tasks } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [academicYear, setAcademicYear] = useState(profile.academicYear);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [goals, setGoals] = useState<string[]>(profile.goals);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>(profile.focusAreas);
  const [newFocusInput, setNewFocusInput] = useState('');

  const completedCount = tasks.flatMap(t => t.completionHistory || []).length +
    tasks.filter(t => t.status === 'completed_today').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      academicYear: academicYear.trim(),
      avatarUrl: avatarUrl.trim(),
      goals,
      focusAreas,
    });
    setIsEditing(false);
  };

  const handleAddGoal = () => {
    if (newGoalInput.trim()) {
      setGoals([...goals, newGoalInput.trim()]);
      setNewGoalInput('');
    }
  };

  const handleRemoveGoal = (idx: number) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  const handleAddFocus = () => {
    if (newFocusInput.trim()) {
      setFocusAreas([...focusAreas, newFocusInput.trim()]);
      setNewFocusInput('');
    }
  };

  const handleRemoveFocus = (idx: number) => {
    setFocusAreas(focusAreas.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Profile Header Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-rose-200 shadow-sm p-6 sm:p-8">
        <RoseCornerOrnament position="top-right" className="absolute top-0 right-0 w-32 h-32" />
        <RoseCornerOrnament position="bottom-left" className="absolute bottom-0 left-0 w-24 h-24" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-rose-200 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-sm">
                <Flame className="w-4 h-4 fill-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900">
                  {profile.name}
                </h2>
                <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  Pro
                </span>
              </div>
              <p className="text-sm font-semibold text-rose-700 mt-0.5">
                {profile.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {profile.academicYear}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setName(profile.name);
              setTitle(profile.title);
              setBio(profile.bio);
              setAcademicYear(profile.academicYear);
              setAvatarUrl(profile.avatarUrl);
              setGoals(profile.goals);
              setFocusAreas(profile.focusAreas);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-5 border-t border-rose-100">
          <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1.5">
            About Me / Mission
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-rose-500" />
          </div>
          <div className="text-2xl font-serif-title font-bold text-gray-900">
            {profile.streak.current} Days
          </div>
          <div className="text-xs text-gray-500 font-medium">Current Streak</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif-title font-bold text-gray-900">
            {completedCount}
          </div>
          <div className="text-xs text-gray-500 font-medium">Total Tasks Completed</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-2xs text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif-title font-bold text-gray-900">
            {profile.streak.longest} Days
          </div>
          <div className="text-xs text-gray-500 font-medium">Longest Streak Record</div>
        </div>
      </div>

      {/* 2-Column Focus & Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Focus Domains */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-serif-title font-bold text-gray-900">
              Core Focus Domains
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.focusAreas.map((f, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 text-rose-800 font-semibold text-xs border border-rose-200"
              >
                🎯 {f}
              </span>
            ))}
          </div>
        </div>

        {/* Career Goals Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-serif-title font-bold text-gray-900">
              Main Career Goals
            </h3>
          </div>
          <div className="space-y-2.5">
            {profile.goals.map((g, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100 text-xs font-medium text-gray-800 flex items-center gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {i + 1}
                </span>
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden text-left max-h-[90vh] overflow-y-auto">
            <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />

            <h3 className="text-xl font-serif-title font-bold text-gray-900 mb-4">
              Edit User Profile
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Professional Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year / Branch</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Profile Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                />
              </div>

              {/* Goals Editor */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Career Goals</label>
                <div className="space-y-1.5 mb-2">
                  {goals.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-rose-50/50 rounded-lg text-xs">
                      <span>{g}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new goal..."
                    value={newGoalInput}
                    onChange={e => setNewGoalInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-rose-200 focus:outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGoal}
                    className="px-3 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-semibold"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Focus Areas Editor */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Focus Areas</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {focusAreas.map((f, idx) => (
                    <span key={idx} className="px-2 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs flex items-center gap-1">
                      {f}
                      <button type="button" onClick={() => handleRemoveFocus(idx)} className="text-rose-600 font-bold ml-1">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a focus area..."
                    value={newFocusInput}
                    onChange={e => setNewFocusInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-rose-200 focus:outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFocus}
                    className="px-3 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-semibold"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium transition cursor-pointer"
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
