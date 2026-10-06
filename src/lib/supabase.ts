import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SUPABASE_SQL_SCHEMA = `-- JANITH TASKS - SUPABASE DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor (https://app.supabase.com)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Janith Sai',
  title TEXT DEFAULT 'Aspiring Machine Learning Engineer & Data Analyst',
  bio TEXT,
  academic_year TEXT,
  focus_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  goals TEXT[] DEFAULT ARRAY[]::TEXT[],
  avatar_url TEXT,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed_today', 'archived')),
  estimated_minutes INT NOT NULL DEFAULT 45,
  actual_minutes INT DEFAULT 0,
  notes TEXT DEFAULT '',
  deadline DATE,
  recurrence TEXT DEFAULT 'none' CHECK (recurrence IN ('none', 'daily', 'weekdays', 'weekly', 'custom')),
  scheduled_time TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_completed_at TIMESTAMPTZ
);

-- 3. Task Completions Table
CREATE TABLE IF NOT EXISTS public.task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completion_date DATE DEFAULT CURRENT_DATE,
  actual_minutes INT NOT NULL,
  estimated_minutes INT NOT NULL,
  notes TEXT
);

-- 4. Focus Sessions Table
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_title TEXT NOT NULL,
  category TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  planned_minutes INT NOT NULL,
  actual_minutes INT NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- 5. Calendar Events Table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  duration_minutes INT DEFAULT 30,
  category TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  event_type TEXT DEFAULT 'task' CHECK (event_type IN ('task', 'meeting', 'study', 'deadline')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own completions" ON public.task_completions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own focus sessions" ON public.focus_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own calendar events" ON public.calendar_events
  FOR ALL USING (auth.uid() = user_id);
`;
