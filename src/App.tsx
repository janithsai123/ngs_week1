import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar, ViewType } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Header } from './components/Header';
import { FloralBackground } from './components/FloralBackground';
import { WallpaperSelector } from './components/WallpaperSelector';
import { DashboardView } from './components/views/DashboardView';
import { TasksView } from './components/views/TasksView';
import { FocusModeView } from './components/views/FocusModeView';
import { CalendarView } from './components/views/CalendarView';
import { ReportsView } from './components/views/ReportsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { HistoryView } from './components/views/HistoryView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { RecommendationModal } from './components/RecommendationModal';
import { AddTaskModal } from './components/AddTaskModal';
import { DailyPlanModal } from './components/DailyPlanModal';
import { FocusLockModal } from './components/FocusLockModal';
import { ProtectedEditModal } from './components/ProtectedEditModal';
import { EditTaskModal } from './components/EditTaskModal';
import { CompleteConfirmModal } from './components/CompleteConfirmModal';
import { Task } from './types';

export const MainApp: React.FC = () => {
  const {
    activeFocusTask,
    startFocusMode,
    completeTask,
    deleteTask,
    resetToDefaults,
    exitFocusMode,
  } = useApp();

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Modal Open States
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDailyPlanOpen, setIsDailyPlanOpen] = useState(false);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);

  // Focus Lock Modal State
  const [isFocusLockOpen, setIsFocusLockOpen] = useState(false);
  const [pendingTargetTask, setPendingTargetTask] = useState<Task | null>(null);

  // Complete Confirmation State
  const [completeTargetTask, setCompleteTargetTask] = useState<Task | null>(null);

  // Protected Edit States
  const [isProtectedAuthOpen, setIsProtectedAuthOpen] = useState(false);
  const [protectedActionType, setProtectedActionType] = useState<'edit' | 'delete' | 'reset'>('edit');
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Safe Request to Focus on a Task
  const handleRequestFocus = (task: Task) => {
    if (activeFocusTask && activeFocusTask.id !== task.id) {
      setPendingTargetTask(task);
      setIsFocusLockOpen(true);
      return;
    }
    startFocusMode(task);
    setCurrentView('focus');
  };

  // Safe Request to Edit a Task (Protected by Passkey)
  const handleRequestEdit = (task: Task) => {
    setSelectedTaskForEdit(task);
    setProtectedActionType('edit');
    setIsProtectedAuthOpen(true);
  };

  const handleRequestDelete = (taskId: string) => {
    const t = selectedTaskForEdit || ({ id: taskId, title: 'Task' } as Task);
    setSelectedTaskForEdit(t);
    setProtectedActionType('delete');
    setIsProtectedAuthOpen(true);
  };

  const handleRequestReset = () => {
    setProtectedActionType('reset');
    setIsProtectedAuthOpen(true);
  };

  // After successful passkey auth
  const handleProtectedAuthSuccess = () => {
    if (protectedActionType === 'edit' && selectedTaskForEdit) {
      setIsEditModalOpen(true);
    } else if (protectedActionType === 'delete' && selectedTaskForEdit) {
      deleteTask(selectedTaskForEdit.id);
      setSelectedTaskForEdit(null);
    } else if (protectedActionType === 'reset') {
      resetToDefaults();
    }
  };

  return (
    <div className="relative flex min-h-screen text-[#2b171e]">
      {/* Background Floral Image & Ambient Effects */}
      <FloralBackground />

      {/* Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenRecommend={() => setIsRecommendOpen(true)}
        onOpenWallpaper={() => setIsWallpaperOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenRecommend={() => setIsRecommendOpen(true)}
          onOpenAddTask={() => setIsAddTaskOpen(true)}
          onOpenWallpaper={() => setIsWallpaperOpen(true)}
          onNavigateFocus={() => setCurrentView('focus')}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {currentView === 'dashboard' && (
            <DashboardView
              onOpenRecommend={() => setIsRecommendOpen(true)}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onOpenDailyPlan={() => setIsDailyPlanOpen(true)}
              onRequestFocus={handleRequestFocus}
              onRequestComplete={task => setCompleteTargetTask(task)}
              onSelectTaskToEdit={handleRequestEdit}
              onNavigateTasks={() => setCurrentView('tasks')}
              onNavigateCalendar={() => setCurrentView('calendar')}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              onOpenAddTask={() => setIsAddTaskOpen(true)}
              onRequestFocus={handleRequestFocus}
              onRequestComplete={task => setCompleteTargetTask(task)}
              onSelectTaskToEdit={handleRequestEdit}
            />
          )}

          {currentView === 'focus' && (
            <FocusModeView
              onOpenRecommend={() => setIsRecommendOpen(true)}
              onNavigateTasks={() => setCurrentView('tasks')}
            />
          )}

          {currentView === 'calendar' && <CalendarView />}

          {currentView === 'reports' && <ReportsView />}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'history' && <HistoryView />}

          {currentView === 'profile' && <ProfileView />}

          {currentView === 'settings' && (
            <SettingsView
              onRequestProtectedReset={handleRequestReset}
              onOpenWallpaperModal={() => setIsWallpaperOpen(true)}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav currentView={currentView} onSelectView={setCurrentView} />
      </div>

      {/* Modals Container */}
      <WallpaperSelector
        isOpen={isWallpaperOpen}
        onClose={() => setIsWallpaperOpen(false)}
      />

      <RecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        onStartFocus={(task, mins) => {
          if (activeFocusTask && activeFocusTask.id !== task.id) {
            setPendingTargetTask(task);
            setIsFocusLockOpen(true);
          } else {
            startFocusMode(task, mins);
            setCurrentView('focus');
          }
        }}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <DailyPlanModal
        isOpen={isDailyPlanOpen}
        onClose={() => setIsDailyPlanOpen(false)}
      />

      <FocusLockModal
        isOpen={isFocusLockOpen}
        onClose={() => {
          setIsFocusLockOpen(false);
          setPendingTargetTask(null);
        }}
        targetTaskTitle={pendingTargetTask?.title}
        onExitFocus={() => {
          exitFocusMode();
          if (pendingTargetTask) {
            startFocusMode(pendingTargetTask);
            setCurrentView('focus');
            setPendingTargetTask(null);
          }
        }}
      />

      <ProtectedEditModal
        isOpen={isProtectedAuthOpen}
        onClose={() => {
          setIsProtectedAuthOpen(false);
          setSelectedTaskForEdit(null);
        }}
        title={
          protectedActionType === 'edit'
            ? 'Protected Task Edit (janith_edit)'
            : protectedActionType === 'delete'
            ? 'Protected Task Deletion'
            : 'Protected System Reset'
        }
        description={
          protectedActionType === 'edit'
            ? 'Modifying curriculum rules or recurrence requires passkey authorization.'
            : protectedActionType === 'delete'
            ? `Deleting "${selectedTaskForEdit?.title}" requires security verification.`
            : 'Resetting all records to default seed tasks requires security authorization.'
        }
        onSuccess={handleProtectedAuthSuccess}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTaskForEdit(null);
        }}
        task={selectedTaskForEdit}
        onDeleteRequest={handleRequestDelete}
      />

      <CompleteConfirmModal
        isOpen={Boolean(completeTargetTask)}
        onClose={() => setCompleteTargetTask(null)}
        task={completeTargetTask}
        onConfirm={(taskId, actualMins, notes) => completeTask(taskId, actualMins, notes)}
      />
    </div>
  );
};

export default function App() {
  return <MainApp />;
}
