import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string; // ISO
}

interface StoredProfiles {
  profiles: Profile[];
  activeId: string | null;
}

interface ProfilesContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  createProfile: (name: string, avatar: string) => void;
  switchProfile: (id: string) => void;
  updateProfile: (id: string, name: string, avatar: string) => void;
  deleteProfile: (id: string) => void;
}

const PROFILES_KEY = "cube-academy-profiles-v1";
const LEGACY_PROGRESS_KEY = "cube-academy-progress-v1";

export function progressKeyFor(profileId: string) {
  return `cube-academy-progress-v1:${profileId}`;
}

export const AVATARS = [
  "🦊", "🐼", "🦁", "🐸", "🦄", "🐙",
  "🐧", "🦖", "🐨", "🚀", "🤖", "🧙",
  "🐯", "🦉", "🐳", "⚡", "🌟", "🍕",
];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function load(): StoredProfiles {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredProfiles;
      return {
        profiles: parsed.profiles ?? [],
        activeId: parsed.activeId ?? null,
      };
    }
  } catch {
    // corrupted storage — start fresh
  }

  // First run with profiles. If progress from the pre-profile version of the
  // app exists, adopt it into a starter profile so nothing is lost.
  const legacy = localStorage.getItem(LEGACY_PROGRESS_KEY);
  if (legacy) {
    const profile: Profile = {
      id: newId(),
      name: "Cuber",
      avatar: "🧩",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(progressKeyFor(profile.id), legacy);
    localStorage.removeItem(LEGACY_PROGRESS_KEY);
    return { profiles: [profile], activeId: profile.id };
  }
  return { profiles: [], activeId: null };
}

const ProfilesContext = createContext<ProfilesContextValue | null>(null);

export function ProfilesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredProfiles>(load);

  useEffect(() => {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(state));
  }, [state]);

  const createProfile = useCallback((name: string, avatar: string) => {
    const profile: Profile = {
      id: newId(),
      name: name.trim() || "Cuber",
      avatar,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      profiles: [...s.profiles, profile],
      activeId: profile.id,
    }));
  }, []);

  const switchProfile = useCallback((id: string) => {
    setState((s) =>
      s.profiles.some((p) => p.id === id) ? { ...s, activeId: id } : s,
    );
  }, []);

  const updateProfile = useCallback(
    (id: string, name: string, avatar: string) => {
      setState((s) => ({
        ...s,
        profiles: s.profiles.map((p) =>
          p.id === id ? { ...p, name: name.trim() || p.name, avatar } : p,
        ),
      }));
    },
    [],
  );

  const deleteProfile = useCallback((id: string) => {
    localStorage.removeItem(progressKeyFor(id));
    setState((s) => {
      const profiles = s.profiles.filter((p) => p.id !== id);
      return {
        profiles,
        activeId:
          s.activeId === id ? (profiles[0]?.id ?? null) : s.activeId,
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      profiles: state.profiles,
      activeProfile:
        state.profiles.find((p) => p.id === state.activeId) ?? null,
      createProfile,
      switchProfile,
      updateProfile,
      deleteProfile,
    }),
    [state, createProfile, switchProfile, updateProfile, deleteProfile],
  );

  return (
    <ProfilesContext.Provider value={value}>
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles(): ProfilesContextValue {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error("useProfiles must be used inside ProfilesProvider");
  return ctx;
}
