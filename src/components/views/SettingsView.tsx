import React, { useState } from 'react';
import {
  Shield,
  Download,
  Upload,
  RotateCcw,
  Database,
  Copy,
  Check,
  Sparkles,
  Image,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured } from '../../lib/supabase';
import { WALLPAPER_PRESETS } from '../../lib/constants';
import { Priority } from '../../types';

interface SettingsViewProps {
  onRequestProtectedReset: () => void;
  onOpenWallpaperModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRequestProtectedReset, onOpenWallpaperModal }) => {
  const {
    settings,
    updateSettings,
    verifyUserPasskey,
    changePasskey,
    exportDataJSON,
    importDataJSON,
  } = useApp();

  // Passkey change state
  const [currentPasskey, setCurrentPasskey] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [passkeyMsg, setPasskeyMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // SQL Copy state
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handlePasskeyChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasskey || !newPasskey) {
      setPasskeyMsg({ type: 'error', text: 'Please fill in all passkey fields.' });
      return;
    }
    if (newPasskey !== confirmPasskey) {
      setPasskeyMsg({ type: 'error', text: 'New passkeys do not match.' });
      return;
    }
    if (newPasskey.length < 4) {
      setPasskeyMsg({ type: 'error', text: 'Passkey must be at least 4 characters.' });
      return;
    }

    const isCurrentValid = await verifyUserPasskey(currentPasskey);
    if (!isCurrentValid) {
      setPasskeyMsg({ type: 'error', text: 'Current passkey is incorrect.' });
      return;
    }

    await changePasskey(newPasskey);
    setCurrentPasskey('');
    setNewPasskey('');
    setConfirmPasskey('');
    setPasskeyMsg({ type: 'success', text: 'Passkey successfully updated!' });
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `janith-tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportStatus('Data backup successfully restored!');
        } else {
          setImportStatus('Failed to parse backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-gray-900 tracking-tight">
            Application Settings
          </h2>
          <p className="text-xs sm:text-sm text-rose-800/80">
            Customize floral background imagery, security passkeys, and cloud database sync
          </p>
        </div>
      </div>

      {/* Wallpaper Themes Showcase Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-rose-200/80 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-serif-title font-bold text-gray-900">
              Background Floral Wallpapers
            </h3>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            5 Presets Available
          </span>
        </div>

        <p className="text-xs text-gray-600">
          Select high-resolution floral wallpaper inspired by your reference photography:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {WALLPAPER_PRESETS.map(preset => {
            const isSelected = settings.wallpaper === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => updateSettings({ wallpaper: preset.id })}
                className={`relative rounded-2xl overflow-hidden border-2 text-center p-2 transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-300 shadow-md'
                    : 'border-rose-100 bg-white hover:border-rose-300'
                }`}
              >
                <div className="w-full h-16 rounded-xl overflow-hidden relative">
                  {preset.url ? (
                    <img src={preset.thumbnail} alt={preset.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-rose-500" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-gray-800 line-clamp-1">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wallpaper Controls */}
        <div className="pt-3 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-rose-500" />
              Translucency: {Math.round(settings.wallpaperOverlay * 100)}%
            </span>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={settings.wallpaperOverlay}
              onChange={e => updateSettings({ wallpaperOverlay: parseFloat(e.target.value) })}
              className="accent-rose-600 cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-semibold">
            <input
              type="checkbox"
              checked={settings.enableFloatingPetals}
              onChange={e => updateSettings({ enableFloatingPetals: e.target.checked })}
              className="w-4 h-4 accent-rose-600 rounded"
            />
            <span>Floating Petals Animation</span>
          </label>
        </div>
      </div>

      {/* Grid Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Productivity Preferences */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-rose-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-50 pb-3">
            <Sparkles className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-serif-title font-bold text-gray-900">
              Productivity Defaults
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Default Task Duration (Minutes)
            </label>
            <input
              type="number"
              min="10"
              max="240"
              step="5"
              value={settings.defaultDuration}
              onChange={e => updateSettings({ defaultDuration: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Default Priority Level
            </label>
            <select
              value={settings.defaultPriority}
              onChange={e => updateSettings({ defaultPriority: e.target.value as Priority })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none bg-white"
            >
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟠 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-semibold text-gray-800">Sound Effects &amp; Bell Chimes</div>
              <div className="text-[11px] text-gray-500">Play audio when focus completes or timer rings</div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={e => updateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Card 2: Security & Passkey Management (janith_edit) */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-rose-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-50 pb-3">
            <Shield className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-serif-title font-bold text-gray-900">
              Security Passkey (janith_edit)
            </h3>
          </div>

          <p className="text-xs text-gray-500">
            Protected actions (editing task rules, recurring settings, and deletions) require your SHA-256 verified passkey.
          </p>

          {passkeyMsg && (
            <div
              className={`p-2.5 rounded-xl text-xs font-medium ${
                passkeyMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {passkeyMsg.text}
            </div>
          )}

          <form onSubmit={handlePasskeyChange} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Current Passkey</label>
              <input
                type="password"
                placeholder="Default: janith2026"
                value={currentPasskey}
                onChange={e => setCurrentPasskey(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-rose-200 focus:outline-none bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">New Passkey</label>
                <input
                  type="password"
                  value={newPasskey}
                  onChange={e => setNewPasskey(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-rose-200 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Confirm Passkey</label>
                <input
                  type="password"
                  value={confirmPasskey}
                  onChange={e => setConfirmPasskey(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-rose-200 focus:outline-none bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition cursor-pointer"
            >
              Update Security Passkey
            </button>
          </form>
        </div>

        {/* Card 3: Data Backup & Reset */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-rose-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-rose-50 pb-3">
            <Download className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-serif-title font-bold text-gray-900">
              Data Backup &amp; Reset
            </h3>
          </div>

          <p className="text-xs text-gray-500">
            Export all tasks, completion records, calendar blocks, and statistics into a standalone JSON file.
          </p>

          {importStatus && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
              {importStatus}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs border border-rose-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export JSON Backup
            </button>

            <label className="flex-1 py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200 flex items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-rose-50 flex items-center justify-between">
            <span className="text-xs text-gray-500">Reset to Initial Seed Tasks</span>
            <button
              onClick={onRequestProtectedReset}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Card 4: Supabase Database Integration & SQL Schema */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-rose-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-50 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-serif-title font-bold text-gray-900">
                Supabase Cloud SQL
              </h3>
            </div>
            <button
              onClick={handleCopySQL}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSQL ? 'Copied SQL!' : 'Copy Schema SQL'}
            </button>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Run the pre-configured SQL schema in your Supabase SQL editor to enable cloud synchronization with Row Level Security (RLS).
          </p>

          <pre className="bg-gray-900 text-rose-300 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36">
            {SUPABASE_SQL_SCHEMA.slice(0, 450)}...
          </pre>
        </div>
      </div>
    </div>
  );
};
