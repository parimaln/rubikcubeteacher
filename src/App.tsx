import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { ProgressProvider } from "./store/progress";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import TimerPage from "./pages/TimerPage";
import AlgLibraryPage from "./pages/AlgLibraryPage";
import BadgesPage from "./pages/BadgesPage";

const NAV = [
  { to: "/", label: "Learn", emoji: "🗺️" },
  { to: "/timer", label: "Timer", emoji: "⏱️" },
  { to: "/algorithms", label: "Algorithms", emoji: "📖" },
  { to: "/badges", label: "Badges", emoji: "🏅" },
];

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <nav className="sticky top-0 z-40 border-b border-indigo-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
            <NavLink to="/" className="text-lg font-extrabold text-indigo-700">
              🧩 Cube Academy
            </NavLink>
            <div className="flex gap-1 sm:gap-2">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-sm font-bold transition sm:text-base ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-indigo-100"
                    }`
                  }
                >
                  <span className="sm:mr-1">{item.emoji}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <main className="min-h-screen pb-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn/:lessonId" element={<LessonPage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/algorithms" element={<AlgLibraryPage />} />
            <Route path="/badges" element={<BadgesPage />} />
          </Routes>
        </main>
      </HashRouter>
    </ProgressProvider>
  );
}
