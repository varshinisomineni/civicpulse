"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { SeverityBadge, StatusBadge } from "@/components/Badges";
import { getIssues, getSummary, updateStatus } from "@/lib/api";

const STATUSES = ["reported", "verified", "assigned", "in_progress", "resolved", "closed"];
const ADMIN_PASSWORD = "civicpulse2026"; // change this to whatever you want

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const [issues, setIssues] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("civicpulse_admin");
    if (stored === "true") setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    Promise.all([getIssues(), getSummary()]).then(([i, s]) => {
      setIssues(i.issues || []);
      setSummary(s.summary);
      setLoading(false);
    });
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("civicpulse_admin", "true");
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("civicpulse_admin");
    setAuthenticated(false);
    setPasswordInput("");
  };

  const handleStatusChange = async (issueId: string, status: string) => {
    setUpdating(issueId);
    await updateStatus(issueId, status);
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status } : i));
    setUpdating(null);
  };

  const filtered = filter === "all" ? issues : issues.filter(i => i.status === filter);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-sm mx-auto px-4 py-24">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-2xl mx-auto mb-4">
              🔒
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">Admin Access</h1>
            <p className="text-sm text-slate-500 mb-6">Enter the admin password to continue</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                autoFocus
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setAuthError(false); }}
                placeholder="Password"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  authError ? "border-red-300 focus:ring-red-400" : "border-slate-200 focus:ring-blue-500"
                }`}
              />
              {authError && <p className="text-xs text-red-500 text-left">Incorrect password. Try again.</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors"
              >
                Unlock Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">⚙️ Admin Dashboard</h1>
            <p className="text-slate-300 text-sm">Manage and update community issue reports</p>
          </div>
          <button onClick={handleLogout} className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
            Log Out
          </button>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total", value: summary.total_reports, color: "blue" },
              { label: "Open", value: summary.open_issues, color: "red" },
              { label: "In Progress", value: summary.in_progress, color: "amber" },
              { label: "Resolved", value: summary.resolved_issues, color: "green" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{s.value ?? 0}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Issue</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Severity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Votes</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="skeleton h-8 rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No issues found</td></tr>
              ) : (
                filtered.map(issue => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <a href={`/issues/${issue.id}`} className="font-medium text-slate-700 hover:text-blue-600 line-clamp-1 block max-w-xs">
                        {issue.title}
                      </a>
                      <p className="text-xs text-slate-400">{new Date(issue.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{issue.issue_type?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={issue.severity} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{issue.recommended_department}</td>
                    <td className="px-4 py-3 text-slate-600">{issue.votes || 0}</td>
                    <td className="px-4 py-3"><StatusBadge status={issue.status} /></td>
                    <td className="px-4 py-3">
                      <select
                        value={issue.status}
                        disabled={updating === issue.id}
                        onChange={e => handleStatusChange(issue.id, e.target.value)}
                        className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}