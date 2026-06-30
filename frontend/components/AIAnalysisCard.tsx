"use client";
import { SeverityBadge, PriorityBar } from "./Badges";

interface AIAnalysis {
  has_civic_issue: boolean;
  issue_type: string;
  confidence_score: number;
  severity: string;
  priority_score: number;
  estimated_impact: string;
  reasoning: string;
  recommended_department: string;
  suggested_resolution: string;
  estimated_resolution_time: string;
  tags?: string[];
  location_risk?: string;
}

interface Props {
  analysis: AIAnalysis;
  loading?: boolean;
}

export default function AIAnalysisCard({ analysis, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    );
  }

  if (!analysis?.has_civic_issue) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
        <div className="text-3xl mb-2">🔍</div>
        <p className="font-semibold text-slate-700">No Civic Issue Detected</p>
        <p className="text-sm text-slate-500 mt-1">The AI couldn't identify a reportable infrastructure issue. Try uploading a clearer image.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">AI</div>
          <h3 className="font-bold text-slate-800">AI Analysis</h3>
        </div>
        <SeverityBadge severity={analysis.severity} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <p className="text-xs text-slate-500 mb-1">Issue Type</p>
          <p className="font-semibold text-slate-800 text-sm capitalize">{analysis.issue_type?.replace("_", " ")}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <p className="text-xs text-slate-500 mb-1">Confidence</p>
          <p className="font-semibold text-slate-800 text-sm">{Math.round((analysis.confidence_score || 0) * 100)}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-blue-100 col-span-2">
          <p className="text-xs text-slate-500 mb-1">Priority Score</p>
          <PriorityBar score={analysis.priority_score || 0} />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">AI Reasoning</p>
          <p className="text-sm text-slate-700 bg-white rounded-lg p-3 border border-blue-100">{analysis.reasoning}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Estimated Impact</p>
          <p className="text-sm text-slate-700">{analysis.estimated_impact}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Dept. Assigned</p>
            <p className="text-sm text-blue-700 font-medium">{analysis.recommended_department}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Resolution Time</p>
            <p className="text-sm text-slate-700">{analysis.estimated_resolution_time}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Suggested Fix</p>
          <p className="text-sm text-slate-700">{analysis.suggested_resolution}</p>
        </div>
        {analysis.tags && analysis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {analysis.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}