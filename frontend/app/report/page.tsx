"use client";
import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import AIAnalysisCard from "@/components/AIAnalysisCard";
import { analyzeImage, checkDuplicate, submitIssue } from "@/lib/api";
import { useRouter } from "next/navigation";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const CATEGORIES = [
  { value: "pothole", label: "🕳️ Pothole" },
  { value: "garbage", label: "🗑️ Garbage" },
  { value: "water_leakage", label: "💧 Water Leakage" },
  { value: "broken_streetlight", label: "💡 Broken Streetlight" },
  { value: "road_damage", label: "🛣️ Road Damage" },
  { value: "drain_blockage", label: "🚧 Drain Blockage" },
  { value: "fallen_tree", label: "🌳 Fallen Tree" },
  { value: "damaged_footpath", label: "🚶 Damaged Footpath" },
  { value: "illegal_dumping", label: "⚠️ Illegal Dumping" },
  { value: "flooding", label: "🌊 Flooding" },
];

export default function ReportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [duplicate, setDuplicate] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    issue_type: "",
    severity: "medium",
    address: "",
    lat: 17.385,
    lng: 78.4867,
  });

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setAiAnalysis(null);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    try {
      const result = await analyzeImage(imageFile);
      if (result.success && result.analysis) {
        const a = result.analysis;
        setAiAnalysis(a);
        if (a.has_civic_issue) {
          setForm(f => ({
            ...f,
            issue_type: a.issue_type || f.issue_type,
            severity: a.severity || f.severity,
            title: f.title || `${a.issue_type?.replace(/_/g, " ")} reported`,
          }));
          // Check for duplicates
          const dup = await checkDuplicate(form.lat, form.lng, a.issue_type);
          setDuplicate(dup);
        }
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setForm(f => ({ ...f, lat, lng }));
  }, []);

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setSelectedLocation({ lat, lng });
      setForm(f => ({ ...f, lat, lng }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.issue_type) return;
    setSubmitting(true);
    try {
      const result = await submitIssue({
        ...form,
        image_url: imagePreview || "",
        ai_analysis: aiAnalysis || {},
        user_name: "Citizen",
      });
      if (result.success) {
        setSuccess(result.issue_id);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Issue Reported!</h2>
          <p className="text-slate-500 mb-6">Your report has been submitted and AI agents are processing it.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push(`/issues/${success}`)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              View Issue
            </button>
            <button onClick={() => router.push("/")} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Report a Community Issue</h1>
          <p className="text-slate-500 text-sm mt-1">Upload an image and let AI analyze it for you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image + AI */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3">📸 Upload Image</h2>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />

              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={() => { setImagePreview(null); setImageFile(null); setAiAnalysis(null); }}
                    className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-slate-500 hover:text-red-500"
                  >×</button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-3xl mb-2">📷</span>
                  <span className="text-sm text-slate-500">Click to upload or take photo</span>
                  <span className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP</span>
                </button>
              )}

              {imageFile && !aiAnalysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <><span className="animate-spin">⚙️</span> Analyzing with Gemini AI...</>
                  ) : (
                    <><span>🤖</span> Analyze with AI</>
                  )}
                </button>
              )}
            </div>

            {/* AI Analysis */}
            {(analyzing || aiAnalysis) && (
              <AIAnalysisCard analysis={aiAnalysis} loading={analyzing} />
            )}

            {/* Duplicate Warning */}
            {duplicate?.has_duplicate && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 mb-1">⚠️ Similar Issue Already Reported</h3>
                <p className="text-sm text-amber-700 mb-3">{duplicate.message}</p>
                {duplicate.nearby_issues?.slice(0, 2).map((issue: any) => (
                  <a key={issue.id} href={`/issues/${issue.id}`} className="block bg-white rounded-lg border border-amber-200 p-3 mb-2 hover:border-amber-400 transition-colors">
                    <p className="text-sm font-medium text-slate-700">{issue.title}</p>
                    <p className="text-xs text-slate-500">{issue.distance_meters}m away · {issue.votes} votes</p>
                  </a>
                ))}
                <p className="text-xs text-amber-600">You can still submit your report or upvote the existing one.</p>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-semibold text-slate-800">📝 Issue Details</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <select
                  required
                  value={form.issue_type}
                  onChange={e => setForm(f => ({ ...f, issue_type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                <div className="grid grid-cols-4 gap-2">
                  {["low", "medium", "high", "critical"].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setForm(f => ({ ...f, severity: s }))}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        form.severity === s
                          ? s === "critical" ? "bg-red-500 border-red-500 text-white"
                            : s === "high" ? "bg-orange-500 border-orange-500 text-white"
                            : s === "medium" ? "bg-yellow-500 border-yellow-500 text-white"
                            : "bg-green-500 border-green-500 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Additional details about the issue..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">📍 Location</label>
                  <button type="button" onClick={handleGPS} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    📡 Use GPS
                  </button>
                </div>
                <input
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Address (optional)"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <p className="text-xs text-slate-400 mb-2">Or click on the map to drop a pin</p>
                <div className="h-44 rounded-lg overflow-hidden border border-slate-200">
                  <MapView onMapClick={handleMapClick} selectedLocation={selectedLocation} />
                </div>
                {selectedLocation && (
                  <p className="text-xs text-green-600 mt-1">📍 Location set: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !form.title || !form.issue_type}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <><span className="animate-spin">⚙️</span> Submitting...</> : "🚀 Submit Report"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}