"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import IssueCard from "@/components/IssueCard";
import { getSummary, getIssues, getLeaderboard, getCommunityInsights } from "@/lib/api";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const STATS_CONFIG = [
  { key: "total_reports", label: "Total Reports", icon: "📋", accent: "bg-[#0F2F63]" },
  { key: "open_issues", label: "Open Issues", icon: "🔴", accent: "bg-gradient-to-br from-red-500 to-orange-500" },
  { key: "in_progress", label: "In Progress", icon: "⚡", accent: "bg-gradient-to-br from-amber-500 to-yellow-500" },
  { key: "community_impact_score", label: "Impact Score", icon: "🏆", accent: "bg-gradient-to-br from-[#2563C9] to-[#5790E6]" },
];

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSummary(), getIssues(), getLeaderboard(), getCommunityInsights()])
      .then(([s, i, l, ins]) => {
        setSummary(s.summary);
        setIssues(i.issues || []);
        setLeaderboard(l.leaderboard || []);
        setInsights(Array.isArray(ins.insights) ? ins.insights : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const priorityIssues = issues.filter(i => i.severity === "critical" || i.severity === "high").slice(0, 3);
  const recentIssues = [...issues].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-[#0F2F63] rounded-2xl p-6 sm:p-8 mb-6 text-white">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#2563C9]/30 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold uppercase tracking-wider mb-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                Live monitoring
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">CivicPulse AI</h1>
              <p className="text-white/60 text-sm">AI-powered community infrastructure monitoring</p>
            </div>
            <Link
              href="/report"
              className="bg-white text-[#0F2F63] font-semibold px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors text-sm inline-flex items-center gap-2 self-start sm:self-auto"
            >
              + Report Issue
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {loading
            ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
            : STATS_CONFIG.map((stat) => (
              <div key={stat.key} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${stat.accent} flex items-center justify-center text-lg mb-3 text-white`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-[#0A0A0A] tracking-tight">{summary?.[stat.key] ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#0A0A0A] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563C9]" />
                Live Issue Map
              </h2>
              <span className="text-xs text-slate-400">{issues.length} issues mapped</span>
            </div>
            <div style={{ height: 380 }}>
              <MapView issues={issues} />
            </div>
            <div className="p-3 border-t border-slate-100 flex gap-4 text-xs text-slate-500">
              {[["🔴", "Critical"], ["🟠", "High"], ["🟡", "Medium"], ["🟢", "Low"]].map(([dot, label]) => (
                <span key={label} className="flex items-center gap-1">{dot} {label}</span>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* AI Insights */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-[#0A0A0A] flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563C9]" />
                AI Insights
              </h2>
              {loading ? (
                <div className="space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div>
              ) : insights.length > 0 ? (
                <div className="space-y-2">
                  {insights.map((insight, i) => (
                    <div key={i} className="bg-[#0F2F63]/[0.04] border border-[#0F2F63]/10 rounded-xl p-3 text-sm text-[#0F2F63]">
                      💡 {insight}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">Submit issues to generate AI insights</p>
              )}
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-[#0A0A0A] flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563C9]" />
                Community Leaders
              </h2>
              {leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((user, idx) => (
                    <div key={user.user_id} className="flex items-center gap-3">
                      <span className="text-sm font-mono text-slate-300 w-5">#{idx + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-[#0F2F63]/5 flex items-center justify-center text-xs font-semibold text-[#0F2F63]">
                        {user.name?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.reports} reports</p>
                      </div>
                      <span className="text-lg">{user.badge}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No activity yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Priority Issues */}
          <div>
            <h2 className="font-semibold text-[#0A0A0A] flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Priority Issues
            </h2>
            {loading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
            ) : priorityIssues.length > 0 ? (
              <div className="space-y-3">{priorityIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-slate-500 text-sm">No critical issues. Community is doing well!</p>
              </div>
            )}
          </div>

          {/* Recent Issues */}
          <div>
            <h2 className="font-semibold text-[#0A0A0A] flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563C9]" />
              Recent Reports
            </h2>
            {loading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
            ) : recentIssues.length > 0 ? (
              <div className="space-y-3">{recentIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-2xl mb-2">📭</p>
                <p className="text-slate-500 text-sm">No issues reported yet.</p>
                <Link href="/report" className="inline-block mt-3 text-[#2563C9] text-sm font-medium hover:underline">Report the first one →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}