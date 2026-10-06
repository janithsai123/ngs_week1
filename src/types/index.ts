export type Priority = 'high' | 'medium' | 'low';

export type Category =
  | 'Machine Learning'
  | 'Python'
  | 'Data Analytics'
  | 'Internship'
  | 'Aptitude'
  | 'GATE'
  | 'Academics'
  | 'Non-Academics'
  | 'Personal'
  | 'Other';

export type Recurrence = 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom';

export interface CompletionRecord {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  timestamp: string; // ISO string full
  actualMinutes: number;
  estimatedMinutes: number;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  status: 'active' | 'completed_today' | 'archived';
  estimatedMinutes: number;
  actualMinutes?: number;
  createdAt: string;
  lastCompletedAt?: string;
  completionHistory: CompletionRecord[];
  notes: string;
  deadline?: string;
  recurrence: Recurrence;
  scheduledTime?: string; // e.g. "09:00"
  order?: number;
}

export interface FocusSession {
  id: string;
  taskId: string;
  taskTitle: string;
  category: Category;
  startedAt: string;
  endedAt?: string;
  plannedMinutes: number;
  actualMinutes: number;
  completed: boolean;
  notes?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  academicYear: string;
  focusAreas: string[];
  goals: string[];
  avatarUrl: string;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
}

export type WallpaperPresetId =
  | 'twilight-heart-moon'
  | 'roses-bouquet'
  | 'cosmos-meadow'
  | 'sunset-dusk'
  | 'floating-petals'
  | 'soft-minimal';

export interface WallpaperPreset {
  id: WallpaperPresetId;
  name: string;
  tagline: string;
  url: string;
  thumbnail: string;
  accentColor: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'bloom' | 'system';
  wallpaper: WallpaperPresetId;
  wallpaperOverlay: number; // 0.6 to 0.95 opacity for text readability
  enableFloatingPetals: boolean;
  enableCuteStars: boolean;
  defaultDuration: number;
  defaultPriority: Priority;
  passkeyHash: string; // SHA-256 hash
  soundEnabled: boolean;
  ambientSound: 'none' | 'bell' | 'rain' | 'lofi';
  notificationsEnabled: boolean;
  dailyTargetMinutes: number;
  supabaseUrl?: string;
  supabaseKey?: string;
}

export interface CalendarEvent {
  id: string;
  taskId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  durationMinutes: number;
  category: Category;
  isCompleted: boolean;
  type: 'task' | 'meeting' | 'study' | 'deadline';
}

export interface DailyPlanItem {
  id: string;
  time: string; // HH:MM
  taskId?: string;
  title: string;
  category: Category;
  durationMinutes: number;
  isCompleted: boolean;
}

export interface RecommendationResult {
  task: Task;
  score: number;
  reasoning: string;
  details: {
    timeFit: string;
    priorityImpact: string;
    urgency: string;
    workloadContext: string;
  };
}
