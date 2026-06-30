"use client";

interface LeaderboardUser {
  user_id: string;
  name: string;
  reports: number;
  score: number;
  badge: string;
}

interface Props {
  users: LeaderboardUser[];
  loading?: boolean;
}

export default function Leaderboard({ users, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="skeleton h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4">
        No community activity yet. Be the first to report an issue!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {users.slice(0, 10).map((user, idx) => (
        <div
          key={user.user_id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <span
            className={`text-sm font-mono w-6 text-center ${
              idx === 0
                ? "text-yellow-500 font-bold"
                : idx === 1
                ? "text-slate-400 font-bold"
                : idx === 2
                ? "text-orange-400 font-bold"
                : "text-slate-400"
            }`}
          >
            #{idx + 1}
          </span>
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
            {user.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{user.name}</p>
            <p className="text-xs text-slate-400">{user.reports} report{user.reports !== 1 ? "s" : ""} · {user.score} pts</p>
          </div>
          <span className="text-lg flex-shrink-0">{user.badge}</span>
        </div>
      ))}
    </div>
  );
}