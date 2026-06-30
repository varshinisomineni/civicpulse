"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AIAnalysisCard from "@/components/AIAnalysisCard";
import { SeverityBadge, StatusBadge, PriorityBar } from "@/components/Badges";
import { getIssue, voteIssue, addComment } from "@/lib/api";

const STATUS_STEPS = ["reported", "verified", "assigned", "in_progress", "resolved", "closed"];

export default function IssueDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [voting, setVoting] = useState(false);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    if (id) {
      getIssue(id as string).then(r => {
        setIssue(r.issue);
        setLoading(false);
      });
    }
  }, [id]);

  const handleVote = async () => {
    if (!issue) return;
    setVoting(true);
    const r = await voteIssue(issue.id);
    if (r.success) setIssue((i: any) => ({ ...i, votes: r.votes }));
    setVoting(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommenting(true);
    const r = await addComment(issue.id, comment, "Citizen");
    if (r.success) {
      setIssue((i: any) => ({ ...i, comments: [...(i.comments || []), r.comment] }));
      setComment("");
    }
    setCommenting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!issue) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Issue not found.</p>
        <button onClick={() => router.push("/")} className="mt-4 text-blue-600 hover:underline">← Back to Dashboard</button>
      </div>
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(issue.status);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back */}
        <button onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1">
          ← Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800 mb-2">{issue.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <SeverityBadge severity={issue.severity} />
                <StatusBadge status={issue.status} />
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{issue.issue_type?.replace(/_/g, " ")}</span>
              </div>
              <p className="text-slate-600 text-sm">{issue.description}</p>
            </div>
            {issue.image_url && (
              <img src={issue.image_url} alt="Issue" className="w-32 h-24 object-cover rounded-lg flex-shrink-0" />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Department</p>
              <p className="text-sm font-semibold text-blue-700">{issue.recommended_department}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{issue.location?.address || `${issue.location?.lat?.toFixed(4)}, ${issue.location?.lng?.toFixed(4)}`}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Reported</p>
              <p className="text-sm font-semibold text-slate-700">{new Date(issue.created_at).toLocaleDateString()}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Priority</p>
              <PriorityBar score={issue.priority_score || 0} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">📅 Status Timeline</h2>
            <div className="relative">
              {STATUS_STEPS.map((step, idx) => (
                <div key={step} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    idx < currentStep ? "bg-green-500 text-white"
                    : idx === currentStep ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-400"
                  }`}>
                    {idx < currentStep ? "✓" : idx + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold capitalize ${idx <= currentStep ? "text-slate-800" : "text-slate-400"}`}>
                      {step.replace("_", " ")}
                    </p>
                    {issue.timeline?.find((t: any) => t.status === step) && (
                      <p className="text-xs text-slate-500">{issue.timeline.find((t: any) => t.status === step)?.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Actions */}
          <div className="space-y-4">
            {/* Vote */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3">👥 Community</h2>
              <button
                onClick={handleVote}
                disabled={voting}
                className="w-full py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                👍 Upvote · {issue.votes || 0} votes
              </button>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3">💬 Comments ({issue.comments?.length || 0})</h2>
              <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                {issue.comments?.length > 0 ? issue.comments.map((c: any) => (
                  <div key={c.id} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-600">{c.user_name}</p>
                    <p className="text-sm text-slate-700">{c.text}</p>
                  </div>
                )) : <p className="text-sm text-slate-400 text-center py-2">No comments yet</p>}
              </div>
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" disabled={commenting || !comment.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {issue.ai_analysis && issue.ai_analysis.has_civic_issue && (
          <div className="mt-4">
            <h2 className="font-semibold text-slate-800 mb-3">🤖 AI Analysis</h2>
            <AIAnalysisCard analysis={issue.ai_analysis} />
          </div>
        )}
      </div>
    </div>
  );
}
