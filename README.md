# 🌸 JANITH TASKS — Personal Study & Productivity Planner

> **"Small progress every day becomes a big achievement."**
> A modern, interactive study-management system and personal planner tailored for Janith Sai's Machine Learning, GATE, and Placement workflow.

---

## 📖 Overview

**JANITH TASKS** converts your ChatGPT-based task-management workflow (`janith_completed`, `janith_edit`, and smart time allocations) into a responsive, personal productivity web application.

Designed with an aesthetic planner notebook feeling—combining soft rose gradients, clean typography, subtle glassmorphism surfaces, and decorative floral ornaments with high-contrast, distraction-free productivity tooling.

---

## ✨ Core Features & Workflow

### 1. 🎯 "WHAT SHOULD I DO NOW?" AI Recommendation Engine
- **Time-Based Decision Making**: Select available study time (15m, 20m, 30m, 45m, 1h, 1.5h, 2h, or Custom minutes).
- **Multi-Factor Scoring Engine**:
  - Priority Score (+55 High, +32 Med, +15 Low)
  - Time Fit Analysis (exact slot match with zero overrun anxiety)
  - Urgency & Approaching Deadlines (+50 pts for urgent milestones)
  - Curriculum Balance (prioritizes ML Engineer core & GATE topics)
- **Transparent Rationale**: Displays exact "Why this task?" explanation before starting.
- **Cycle Alternatives**: [START TASK] launches Focus Mode; [CHOOSE ANOTHER] lets you cycle runner-up tasks.

### 2. 🛡️ Strict Task Focus Mode & Distraction Lock
- **Single-Task Focus Rule**: Only ONE active task can be in focus mode at a time.
- **Strict Locking**: While in Focus Mode, clicking any other task triggers the security barrier:
  > *"You are currently focusing on [Task]. Complete or exit the current focus session before opening another task."*
- **Live Countdown Timer**: Circular progress visualization, Pause/Resume, +5m / -5m micro-adjusters, and notes scratchpad.
- **Audio Feedback**: Synthesized Tibetan bell chimes and confetti animations on completion without external asset dependencies.

### 3. ✅ Interactive Completion Workflow (Replaces `janith_completed`)
- One-click `[✓ COMPLETE]` action with confirmation modal.
- Logs estimated vs. actual minutes spent and session accomplishment notes.
- Tasks are **NOT** permanently deleted—marked as *Completed Today* and automatically recur on future days.
- Increment streak counter and triggers celebratory visual confetti.

### 4. 🔒 Protected Edit System (Replaces `janith_edit`)
- Editing curriculum rules, modifying recurrence, deleting tasks, or system resetting is protected by **SHA-256 Passkey Verification**.
- **Default Passkey**: `janith2026` (Customizable inside Settings).
- Passkey is never exposed in plaintext and is securely hashed using browser-native Web Crypto API.

### 5. 📅 Study Calendar & Daily Time Blocking
- Month, Week, and Day views with deadline indicators and study block markers.
- **Daily Planner Wizard**: "I have 3 hours today" -> auto-generates a balanced 09:00 - 20:30 timeline across ML, GATE, Python, and Aptitude.

### 6. 📊 Visual Analytics & Streak Tracking
- Weekly study hours distribution bar chart.
- Learning category time distribution breakdown (ML, Python, GATE, Internship, Aptitude).
- Daily streak tracker (Current Streak vs. All-Time Longest Record).
- Chronological completion history with category and date filtering.

### 7. 👤 Janith Sai User Profile
- Customized for: **Machine Learning + Data Analytics + GATE + Placements**.
- Editable career goals, focus domains, bio, academic credentials, and custom avatar.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Google Fonts (*Playfair Display*, *Outfit*, *Plus Jakarta Sans*)
- **Animations & Effects**: Canvas Confetti, Web Audio API Sound Synthesizer, CSS keyframe glows
- **Icons**: Lucide React
- **Backend & Cloud (Optional)**: Supabase PostgreSQL with Row Level Security (RLS) policies

---

## 📁 Folder Structure

```text
seoarate_todo/
├── public/
│   └── rose-icon.svg             # Handcrafted floral SVG favicon
├── src/
│   ├── components/
│   │   ├── views/
│   │   │   ├── DashboardView.tsx # Main hub with metrics, quote ticker & remaining tasks
│   │   │   ├── TasksView.tsx     # Full curriculum manager with search and filters
│   │   │   ├── FocusModeView.tsx # Distraction-free timer and single-task interface
│   │   │   ├── CalendarView.tsx  # Interactive month and day schedule
│   │   │   ├── AnalyticsView.tsx # Productivity charts, hours, and category breakdown
│   │   │   ├── HistoryView.tsx   # Grouped log of completed sessions
│   │   │   ├── ProfileView.tsx   # Janith Sai profile & career goals
│   │   │   └── SettingsView.tsx  # Passkey, sound, backup export/import & Supabase SQL
│   │   ├── AddTaskModal.tsx      # Modal for creating tasks with required priority
│   │   ├── CompleteConfirmModal.tsx # Replaces janith_completed
│   │   ├── DailyPlanModal.tsx    # Daily schedule timeline generator
│   │   ├── EditTaskModal.tsx     # Rule editor (opened after passkey)
│   │   ├── FloralMotifs.tsx      # Rose corners, badges & empty states
│   │   ├── FocusLockModal.tsx    # Enforces strict anti-multitasking lock
│   │   ├── Header.tsx            # Greeting, live date, and CTA
│   │   ├── MobileNav.tsx         # Bottom navigation for phone screens
│   │   ├── ProtectedEditModal.tsx# Passkey authentication (janith_edit)
│   │   ├── RecommendationModal.tsx # "What Should I Do Now?" modal
│   │   └── Sidebar.tsx           # Desktop navigation with streak pill
│   ├── context/
│   │   └── AppContext.tsx        # Global state, focus timer, streak & recurrence logic
│   ├── lib/
│   │   ├── audio.ts              # Web Audio API bell synthesizer
│   │   ├── constants.ts          # Seed tasks (ML, GATE, Python, etc.) & default profile
│   │   ├── crypto.ts             # SHA-256 Web Crypto passkey verification
│   │   ├── recommendation.ts     # Multi-factor task recommendation algorithm
│   │   └── supabase.ts           # Supabase client & SQL schema
│   ├── types/
│   │   └── index.ts              # Strict TypeScript definitions
│   ├── App.tsx                   # Central router & modal controller
│   ├── index.css                 # Floral tokens, glassmorphism & typography
│   └── main.tsx                  # Root entry point
├── index.html                    # SEO metadata, title & Google Fonts
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** v18+ and **npm**

### 2. Installation
```powershell
npm install
```

### 3. Start Development Server
```powershell
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 4. Build for Production
```powershell
npm run build
```

---

## 🗄️ Supabase Cloud Setup (Optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Copy and run the SQL schema found in [src/lib/supabase.ts](file:///c:/Users/janit/OneDrive/Desktop/seoarate_todo/src/lib/supabase.ts) (or click **"Copy Schema SQL"** on the Settings page inside the app).
4. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

*Note: The application is 100% functional out of the box with offline-first localStorage synchronization.*

---

## 🔐 Security & Passkey Note
- **Protected Actions**: Editing curriculum rules, modifying recurrence, deleting tasks, or clearing history.
- **Default Passkey**: `janith2026`
- You can update your passkey anytime in the **Settings** tab. Passkeys are hashed with SHA-256 and never transmitted or stored in plaintext.
