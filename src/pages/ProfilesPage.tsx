import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AVATARS, useProfiles, type Profile } from "../store/profiles";
import { useProgress } from "../store/progress";

function AvatarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (avatar: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {AVATARS.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChange(a)}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition hover:scale-110 ${
            value === a
              ? "bg-indigo-600 ring-4 ring-indigo-300"
              : "bg-slate-100 hover:bg-indigo-100"
          }`}
        >
          {a}
        </button>
      ))}
    </div>
  );
}

function CreateProfileForm({ onDone }: { onDone?: () => void }) {
  const { createProfile } = useProfiles();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        createProfile(name, avatar);
        onDone?.();
      }}
      className="space-y-4"
    >
      <div>
        <label className="mb-1 block text-sm font-bold text-slate-500">
          What's your name?
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="Type your name..."
          autoFocus
          className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg font-bold text-slate-800 outline-none focus:border-indigo-400"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-500">
          Pick your buddy
        </label>
        <AvatarPicker value={avatar} onChange={setAvatar} />
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full rounded-2xl bg-indigo-600 px-6 py-3 text-lg font-extrabold text-white shadow-md transition hover:bg-indigo-500 disabled:opacity-40"
      >
        {avatar} Let's cube!
      </button>
    </form>
  );
}

/** Full-screen first-run experience shown when no profile exists yet. */
export function ProfileGate() {
  const { profiles, switchProfile } = useProfiles();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-pop-in rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-extrabold text-slate-900">
          🧩 Cube Academy
        </h1>
        <p className="mb-6 mt-2 text-center font-semibold text-slate-500">
          {profiles.length > 0
            ? "Who's cubing today?"
            : "Create your cuber profile to start the adventure!"}
        </p>

        {profiles.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => switchProfile(p.id)}
                className="flex flex-col items-center rounded-2xl border-2 border-slate-200 p-4 transition hover:scale-105 hover:border-indigo-400 hover:bg-indigo-50"
              >
                <span className="text-4xl">{p.avatar}</span>
                <span className="mt-1 font-extrabold text-slate-800">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {profiles.length > 0 && (
          <p className="mb-3 text-center text-sm font-bold text-slate-400">
            — or make a new profile —
          </p>
        )}
        <CreateProfileForm />
      </div>
    </div>
  );
}

function ProfileCard({ profile }: { profile: Profile }) {
  const { activeProfile, switchProfile, updateProfile, deleteProfile } =
    useProfiles();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const isActive = activeProfile?.id === profile.id;

  if (editing) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-md ring-2 ring-indigo-200">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="mb-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2 font-bold text-slate-800 outline-none focus:border-indigo-400"
        />
        <AvatarPicker value={avatar} onChange={setAvatar} />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              updateProfile(profile.id, name, avatar);
              setEditing(false);
            }}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500"
          >
            Save
          </button>
          <button
            onClick={() => {
              setName(profile.name);
              setAvatar(profile.avatar);
              setEditing(false);
            }}
            className="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-3xl bg-white p-5 shadow-md ${
        isActive ? "ring-2 ring-indigo-400" : ""
      }`}
    >
      <span className="text-4xl">{profile.avatar}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-extrabold text-slate-800">
          {profile.name}
          {isActive && (
            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-600">
              playing now
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        {!isActive && (
          <button
            onClick={() => switchProfile(profile.id)}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500"
          >
            Play
          </button>
        )}
        <button
          onClick={() => setEditing(true)}
          className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200"
        >
          ✏️
        </button>
        <button
          onClick={() => {
            if (
              window.confirm(
                `Delete ${profile.name}'s profile? All their progress, badges and streaks will be gone forever.`,
              )
            ) {
              deleteProfile(profile.id);
            }
          }}
          className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-400 hover:bg-red-50 hover:text-red-500"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default function ProfilesPage() {
  const { profiles, activeProfile } = useProfiles();
  const { resetAll } = useProgress();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-slate-900">
        👥 Profiles
      </h1>
      <p className="mb-6 text-center font-semibold text-slate-500">
        Everyone gets their own progress, streaks and badges.
      </p>

      <div className="space-y-3">
        {profiles.map((p) => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>

      {adding ? (
        <div className="mt-4 rounded-3xl bg-white p-5 shadow-md">
          <CreateProfileForm onDone={() => setAdding(false)} />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 w-full rounded-3xl border-2 border-dashed border-slate-300 py-4 font-extrabold text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600"
        >
          ➕ Add a new cuber
        </button>
      )}

      {activeProfile && (
        <div className="mt-8 rounded-3xl bg-white p-5 text-center shadow-md">
          <p className="mb-3 text-sm font-semibold text-slate-500">
            Want a fresh start for {activeProfile.name}? This erases lessons,
            solves, XP, streaks and badges — but keeps the profile.
          </p>
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Reset ALL of ${activeProfile.name}'s progress? This cannot be undone.`,
                )
              ) {
                resetAll();
                navigate("/");
              }
            }}
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-100"
          >
            Reset {activeProfile.name}'s progress
          </button>
        </div>
      )}
    </div>
  );
}
