import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  UserProfile,
  AppSettings,
  CalendarEvent,
  DailyPlanItem,
  FocusSession,
  CompletionRecord,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_PROFILE,
  INITIAL_SETTINGS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_TODAY_PLAN,
} from '../lib/constants';
import { hashPasskey, verifyPasskey as verifyCryptoPasskey } from '../lib/crypto';
import { playSuccessChime, playTimerCompleteBell, playStartFocusTone } from '../lib/audio';

interface FocusTimerState {
  isRunning: boolean;
  remainingSeconds: number;
  initialSeconds: number;
  elapsedSeconds: number;
}

interface AppContextType {
  tasks: Task[];
  profile: UserProfile;
  settings: AppSettings;
  calendarEvents: CalendarEvent[];
  dailyPlan: DailyPlanItem[];
  focusSessions: FocusSession[];
  activeFocusTask: Task | null;
  focusTimer: FocusTimerState;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completionHistory' | 'status'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, actualMinutes?: number, notes?: string) => void;
  reopenTask: (taskId: string) => void;
  triggerNewDayReset: () => void; // Manual or automated day rollover
  
  // Focus Actions
  startFocusMode: (task: Task, durationMinutes?: number) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  adjustFocusTime: (deltaSeconds: number) => void;
  exitFocusMode: () => void;
  completeActiveFocusTask: (notes?: string) => void;
  
  // Profile & Settings Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  verifyUserPasskey: (enteredKey: string) => Promise<boolean>;
  changePasskey: (newKey: string) => Promise<void>;
  
  // Calendar & Planner Actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  updateDailyPlan: (plan: DailyPlanItem[]) => void;
  addDailyPlanItem: (item: Omit<DailyPlanItem, 'id' | 'isCompleted'>) => void;
  toggleDailyPlanItem: (id: string) => void;
  
  // Utility & Security
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'janith_tasks_data_v2',
  PROFILE: 'janith_profile_data_v2',
  SETTINGS: 'janith_settings_data_v2',
  CALENDAR: 'janith_calendar_data_v2',
  DAILY_PLAN: 'janith_daily_plan_data_v2',
  FOCUS_SESSIONS: 'janith_focus_sessions_data_v2',
  LAST_ACTIVE_DATE: 'janith_last_active_date_v2',
};

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial State Loading
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TASKS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROFILE;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SETTINGS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CALENDAR_EVENTS;
  });

  const [dailyPlan, setDailyPlan] = useState<DailyPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_PLAN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TODAY_PLAN;
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Focus Mode State
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [focusTimer, setFocusTimer] = useState<FocusTimerState>({
    isRunning: false,
    remainingSeconds: 25 * 60,
    initialSeconds: 25 * 60,
    elapsedSeconds: 0,
  });

  // 2. Day Change & Auto-Reset Mechanism
  // This automatically resets completed tasks on a new calendar day while preserving history!
  const performDayReset = useCallback(() => {
    const today = getTodayString();
    setTasks(prevTasks =>
      prevTasks.map(t => {
        // If task was marked completed today but its recurrence is recurring (daily, weekdays, weekly), reset it!
        if (t.status === 'completed_today') {
          return {
            ...t,
            status: 'active',
          };
        }
        return t;
      })
    );

    // Also reset daily plan items for the new day
    setDailyPlan(prev => prev.map(p => ({ ...p, isCompleted: false })));
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, today);
  }, []);

  // Check on load & every minute for midnight date boundary
  useEffect(() => {
    const today = getTodayString();
    const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);

    if (lastActive && lastActive !== today) {
      performDayReset();
    } else if (!lastActive) {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, today);
    }

    const interval = setInterval(() => {
      const currentDay = getTodayString();
      const storedDay = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
      if (storedDay && storedDay !== currentDay) {
        performDayReset();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [performDayReset]);

  // Manual Trigger for Day Rollover (so user can test or start a fresh day anytime)
  const triggerNewDayReset = () => {
    performDayReset();
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#f43f5e', '#ec4899', '#38bdf8']
    });
    if (settings.soundEnabled) playSuccessChime();
  };

  // 3. Persistent LocalStorage Sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) { console.error(e); }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) { console.error(e); }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) { console.error(e); }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEvents));
    } catch (e) { console.error(e); }
  }, [calendarEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_PLAN, JSON.stringify(dailyPlan));
    } catch (e) { console.error(e); }
  }, [dailyPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(focusSessions));
    } catch (e) { console.error(e); }
  }, [focusSessions]);

  // 4. Focus Timer Interval Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (focusTimer.isRunning && focusTimer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setFocusTimer(prev => {
          if (prev.remainingSeconds <= 1) {
            if (settings.soundEnabled) playTimerCompleteBell();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#a855f7', '#f43f5e', '#ec4899', '#fb7185', '#38bdf8']
            });
            return {
              ...prev,
              isRunning: false,
              remainingSeconds: 0,
              elapsedSeconds: prev.elapsedSeconds + 1,
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
            elapsedSeconds: prev.elapsedSeconds + 1,
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isRunning, focusTimer.remainingSeconds, settings.soundEnabled]);

  // 5. Fire Confetti Helper
  const triggerConfetti = () => {
    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#a855f7', '#f43f5e', '#ec4899', '#fda4af', '#38bdf8', '#fbbf24'],
    });
  };

  // 6. Streak Management
  const registerActivityForToday = useCallback(() => {
    const today = getTodayString();
    setProfile(prev => {
      const lastActive = prev.streak.lastActiveDate;
      if (lastActive === today) {
        return prev;
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = lastActive === yesterday;
      const newCurrent = isConsecutive ? prev.streak.current + 1 : 1;
      const newLongest = Math.max(prev.streak.longest, newCurrent);

      return {
        ...prev,
        streak: {
          current: newCurrent,
          longest: newLongest,
          lastActiveDate: today,
        },
      };
    });
  }, []);

  // 7. Core Task Actions
  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completionHistory' | 'status'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      completionHistory: [],
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    );
    if (activeFocusTask && activeFocusTask.id === taskId) {
      setActiveFocusTask(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeFocusTask && activeFocusTask.id === taskId) {
      setActiveFocusTask(null);
      setFocusTimer({ isRunning: false, remainingSeconds: 0, initialSeconds: 0, elapsedSeconds: 0 });
    }
  };

  const completeTask = (taskId: string, actualMinutes?: number, notes?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const now = new Date();
    const duration = actualMinutes || task.estimatedMinutes;

    const newRecord: CompletionRecord = {
      id: `comp-${Date.now()}`,
      date: getTodayString(),
      timestamp: now.toISOString(),
      actualMinutes: duration,
      estimatedMinutes: task.estimatedMinutes,
      notes: notes || task.notes,
    };

    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed_today',
            lastCompletedAt: now.toISOString(),
            actualMinutes: duration,
            completionHistory: [newRecord, ...(t.completionHistory || [])],
          };
        }
        return t;
      })
    );

    // Also mark in daily plan if present
    setDailyPlan(prev =>
      prev.map(p => (p.title.toLowerCase().includes(task.title.toLowerCase()) ? { ...p, isCompleted: true } : p))
    );

    // Play chime & celebrate
    if (settings.soundEnabled) playSuccessChime();
    triggerConfetti();
    registerActivityForToday();

    if (activeFocusTask && activeFocusTask.id === taskId) {
      setActiveFocusTask(null);
      setFocusTimer({ isRunning: false, remainingSeconds: 0, initialSeconds: 0, elapsedSeconds: 0 });
    }
  };

  const reopenTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'active' } : t))
    );
  };

  // 8. Focus Mode Management
  const startFocusMode = (task: Task, durationMinutes?: number) => {
    const duration = durationMinutes || task.estimatedMinutes || 30;
    const totalSeconds = duration * 60;

    setActiveFocusTask(task);
    setFocusTimer({
      isRunning: true,
      remainingSeconds: totalSeconds,
      initialSeconds: totalSeconds,
      elapsedSeconds: 0,
    });

    if (settings.soundEnabled) playStartFocusTone();
  };

  const pauseFocusTimer = () => {
    setFocusTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeFocusTimer = () => {
    setFocusTimer(prev => ({ ...prev, isRunning: true }));
  };

  const adjustFocusTime = (deltaSeconds: number) => {
    setFocusTimer(prev => {
      const newRemaining = Math.max(0, prev.remainingSeconds + deltaSeconds);
      const newInitial = Math.max(newRemaining, prev.initialSeconds + (deltaSeconds > 0 ? deltaSeconds : 0));
      return {
        ...prev,
        remainingSeconds: newRemaining,
        initialSeconds: newInitial,
      };
    });
  };

  const exitFocusMode = () => {
    if (activeFocusTask && focusTimer.elapsedSeconds > 60) {
      const actualMins = Math.round(focusTimer.elapsedSeconds / 60);
      const session: FocusSession = {
        id: `focus-${Date.now()}`,
        taskId: activeFocusTask.id,
        taskTitle: activeFocusTask.title,
        category: activeFocusTask.category,
        startedAt: new Date(Date.now() - focusTimer.elapsedSeconds * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        plannedMinutes: Math.round(focusTimer.initialSeconds / 60),
        actualMinutes: actualMins,
        completed: false,
      };
      setFocusSessions(prev => [session, ...prev]);
    }
    setActiveFocusTask(null);
    setFocusTimer({ isRunning: false, remainingSeconds: 0, initialSeconds: 0, elapsedSeconds: 0 });
  };

  const completeActiveFocusTask = (notes?: string) => {
    if (!activeFocusTask) return;

    const actualMins = Math.max(1, Math.round(focusTimer.elapsedSeconds / 60));
    const session: FocusSession = {
      id: `focus-${Date.now()}`,
      taskId: activeFocusTask.id,
      taskTitle: activeFocusTask.title,
      category: activeFocusTask.category,
      startedAt: new Date(Date.now() - focusTimer.elapsedSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      plannedMinutes: Math.round(focusTimer.initialSeconds / 60),
      actualMinutes: actualMins,
      completed: true,
      notes,
    };
    setFocusSessions(prev => [session, ...prev]);

    completeTask(activeFocusTask.id, actualMins, notes);
  };

  // 9. Profile & Settings Updates
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const verifyUserPasskey = async (enteredKey: string): Promise<boolean> => {
    return await verifyCryptoPasskey(enteredKey, settings.passkeyHash);
  };

  const changePasskey = async (newKey: string): Promise<void> => {
    const newHash = await hashPasskey(newKey);
    setSettings(prev => ({ ...prev, passkeyHash: newHash }));
  };

  // 10. Calendar & Daily Plan Actions
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `cal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev =>
      prev.map(evt => (evt.id === id ? { ...evt, ...updates } : evt))
    );
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(evt => evt.id !== id));
  };

  const updateDailyPlan = (plan: DailyPlanItem[]) => {
    setDailyPlan(plan);
  };

  const addDailyPlanItem = (item: Omit<DailyPlanItem, 'id' | 'isCompleted'>) => {
    const newItem: DailyPlanItem = {
      ...item,
      id: `plan-${Date.now()}`,
      isCompleted: false,
    };
    setDailyPlan(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const toggleDailyPlanItem = (id: string) => {
    setDailyPlan(prev =>
      prev.map(item => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  // 11. Data Reset, Export & Import
  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setProfile(INITIAL_PROFILE);
    setSettings(INITIAL_SETTINGS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setDailyPlan(INITIAL_TODAY_PLAN);
    setFocusSessions([]);
    setActiveFocusTask(null);
    setFocusTimer({ isRunning: false, remainingSeconds: 0, initialSeconds: 0, elapsedSeconds: 0 });
    localStorage.clear();
  };

  const exportDataJSON = (): string => {
    const exportObj = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks,
      profile,
      settings: { ...settings, passkeyHash: '' },
      calendarEvents,
      dailyPlan,
      focusSessions,
    };
    return JSON.stringify(exportObj, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (data.profile) setProfile(prev => ({ ...prev, ...data.profile }));
      if (Array.isArray(data.calendarEvents)) setCalendarEvents(data.calendarEvents);
      if (Array.isArray(data.dailyPlan)) setDailyPlan(data.dailyPlan);
      if (Array.isArray(data.focusSessions)) setFocusSessions(data.focusSessions);
      return true;
    } catch (err) {
      console.error('Failed to import data', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        profile,
        settings,
        calendarEvents,
        dailyPlan,
        focusSessions,
        activeFocusTask,
        focusTimer,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        reopenTask,
        triggerNewDayReset,
        startFocusMode,
        pauseFocusTimer,
        resumeFocusTimer,
        adjustFocusTime,
        exitFocusMode,
        completeActiveFocusTask,
        updateProfile,
        updateSettings,
        verifyUserPasskey,
        changePasskey,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        updateDailyPlan,
        addDailyPlanItem,
        toggleDailyPlanItem,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
