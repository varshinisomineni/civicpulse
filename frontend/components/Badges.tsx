const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border border-red-200",
  high: "bg-orange-50 text-orange-700 border border-orange-200",
  medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  low: "bg-green-50 text-green-700 border border-green-200",
};

const STATUS_STYLES: Record<string, string> = {
  reported: "bg-slate-100 text-slate-700 border border-slate-200",
  verified: "bg-blue-50 text-blue-700 border border-blue-200",
  assigned: "bg-purple-50 text-purple-700 border border-purple-200",
  in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
  resolved: "bg-green-50 text-green-700 border border-green-200",
  closed: "bg-gray-100 text-gray-500 border border-gray-200",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SEVERITY_STYLES[severity] || SEVERITY_STYLES.low}`}>
      {severity?.toUpperCase()}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.reported}`}>
      {status?.replace("_", " ").toUpperCase()}
    </span>
  );
}

export function PriorityBar({ score }: { score: number }) {
  const color = score >= 75 ? "bg-red-500" : score >= 50 ? "bg-orange-500" : score >= 25 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-500 w-8">{score}</span>
    </div>
  );
}