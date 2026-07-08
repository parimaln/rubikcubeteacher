import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { ProgressProvider, useProgress } from "./store/progress";
import {
  ProfilesProvider,
  progressKeyFor,
  useProfiles,
} from "./store/profiles";
import { conceptsToday, currentStreak } from "./lib/streak";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import TimerPage from "./pages/TimerPage";
import AlgLibraryPage from "./pages/AlgLibraryPage";
import BadgesPage from "./pages/BadgesPage";
import ChallengesPage from "./pages/ChallengesPage";
import ProfilesPage, { ProfileGate } from "./pages/ProfilesPage";

const NAV = [
  { to: "/", label: "Learn", emoji: "🗺️" },
  { to: "/challenges", label: "Challenges", emoji: "🎯" },
  { to: "/timer", label: "Timer", emoji: "⏱️" },
  { to: "/algorithms", label: "Algorithms", emoji: "📖" },
  { to: "/badges", label: "Badges", emoji: "🏅" },
];

function StreakChip() {
  const { activity } = useProgress();
  const streak = currentStreak(activity);
  const doneToday = conceptsToday(activity) > 0;
  return (
    <span
      title={
        doneToday
          ? `${streak}-day streak — today's concept done!`
          : streak > 0
            ? `${streak}-day streak — do a concept today to keep it!`
            : "Do one concept today to start a streak!"
      }
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-extrabold ${
        doneToday
          ? "bg-orange-100 text-orange-600"
          : "bg-slate-100 text-slate-400"
      }`}
    >
      🔥 {streak}
    </span>
  );
}

function Shell() {
  const { activeProfile } = useProfiles();

  if (!activeProfile) {
    return <ProfileGate />;
  }

  return (
    <ProgressProvider
      key={activeProfile.id}
      storageKey={progressKeyFor(activeProfile.id)}
    >
      <nav className="sticky top-0 z-40 border-b border-indigo-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
          <NavLink
            to="/"
            className="hidden text-lg font-extrabold text-indigo-700 md:block"
          >
            🧩 Cube Academy
          </NavLink>
          <div className="flex gap-1 sm:gap-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-xl px-2.5 py-2 text-sm font-bold transition sm:px-3 sm:text-base ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-indigo-100"
                  }`
                }
              >
                <span className="lg:mr-1">{item.emoji}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <StreakChip />
            <NavLink
              to="/profiles"
              title={`${activeProfile.name} — switch profile`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xl transition hover:scale-110 hover:bg-indigo-200"
            >
              {activeProfile.avatar}
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn/:lessonId" element={<LessonPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/algorithms" element={<AlgLibraryPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/profiles" element={<ProfilesPage />} />
        </Routes>
      </main>
    </ProgressProvider>
  );
}

export default function App() {
  return (
    <ProfilesProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </ProfilesProvider>
  );
}
