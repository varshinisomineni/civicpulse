"use client";
import Link from "next/link";
import { SeverityBadge, StatusBadge, PriorityBar } from "./Badges";

const ISSUE_ICONS: Record<string, string> = {
  pothole: "🕳️", garbage: "🗑️", water_leakage: "💧", broken_streetlight: "💡",
  road_damage: "🛣️", drain_blockage: "🚧", fallen_tree: "🌳",
  damaged_footpath: "🚶", illegal_dumping: "⚠️", flooding: "🌊", none: "📋"
};

interface Issue {
  id: string;
  title: string;
  description: string;
  issue_type: string;
  severity: string;
  status: string;
  priority_score: number;
  votes: number;
  location?: { address?: string };
  created_at: string;
  image_url?: string;
  recommended_department?: string;
}

export default function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0">
            {ISSUE_ICONS[issue.issue_type] || "📋"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-blue-700 transition-colors">
                {issue.title}
              </h3>
              <SeverityBadge severity={issue.severity} />
            </div>
            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{issue.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={issue.status} />
              {issue.recommended_department && (
                <span className="text-xs text-slate-400">{issue.recommended_department}</span>
              )}
            </div>
            <PriorityBar score={issue.priority_score || 0} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400 truncate">
                📍 {issue.location?.address || "Location not specified"}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                👍 {issue.votes || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}