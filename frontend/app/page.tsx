"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

const ISSUE_TYPES = [
  { icon: "🕳️", label: "Pothole detected", dept: "Road Maintenance", severity: "high" },
  { icon: "💧", label: "Water leakage", dept: "Water Supply", severity: "critical" },
  { icon: "💡", label: "Streetlight outage", dept: "Electrical Dept.", severity: "medium" },
  { icon: "🗑️", label: "Garbage accumulation", dept: "Sanitation", severity: "low" },
];

const STEPS = [
  { n: "01", title: "Snap a photo", body: "Point your camera at the pothole, the leak, the downed branch. No forms, no category-guessing." },
  { n: "02", title: "AI reads the scene", body: "Gemini Vision identifies the issue, scores severity, and writes the report for you in seconds." },
  { n: "03", title: "It's routed instantly", body: "The right department is notified automatically, with priority set by real risk, not queue position." },
  { n: "04", title: "Track it to resolved", body: "Status updates flow back to you and your neighbors, from reported to fixed, in the open." },
];

const STATS = [
  { value: 5, suffix: "", label: "AI Agents Working" },
  { value: 100, suffix: "%", label: "Reports AI-Triaged" },
  { value: 60, suffix: "s", label: "Avg. Analysis Time" },
  { value: 7, suffix: "", label: "Issue Categories" },
];

export default function WelcomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [feedIndex, setFeedIndex] = useState(0);
  const statsBlock = useInView();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setFeedIndex((i) => (i + 1) % ISSUE_TYPES.length), 2600);
    return () => clearInterval(id);
  }, []);

  const counts = STATS.map((s) => useCountUp(s.value, 1400, statsBlock.inView));

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#0A0A0A]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur border-b border-slate-200" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5790E6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2563C9]"></span>
            </span>
            <span className={`font-bold text-lg tracking-tight ${scrolled ? "text-[#0F2F63]" : "text-white"}`}>
              CivicPulse <span className="text-[#5790E6]">AI</span>
            </span>
          </Link>
          <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? "text-slate-600" : "text-white/85"}`}>
            <a href="#how" className="hover:opacity-70 transition-opacity">How it works</a>
            <a href="#agents" className="hover:opacity-70 transition-opacity">AI Agents</a>
            <a href="#stats" className="hover:opacity-70 transition-opacity">By the numbers</a>
          </nav>
          <Link
            href="/dashboard"
            className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all ${
              scrolled ? "bg-[#0F2F63] text-white hover:bg-[#16397d]" : "bg-white text-[#0F2F63] hover:bg-blue-50"
            }`}
          >
            Open Dashboard →
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0F2F63] text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <svg className="absolute bottom-0 left-0 w-full h-32 opacity-30" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,60 L200,60 L230,20 L260,100 L290,60 L1200,60" fill="none" stroke="#5790E6" strokeWidth="2" />
        </svg>
        <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-[#2563C9]/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-40 pb-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            Live · AI agents online
          </div>

          <h1 className="font-bold tracking-tight leading-[0.95] max-w-4xl" style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)" }}>
            Your city,<br />
            <span className="text-[#5790E6]">reading its own</span><br />
            pulse.
          </h1>

          <p className="mt-8 max-w-xl text-lg text-white/70 leading-relaxed">
            Snap a photo of a pothole, a leak, a broken light. CivicPulse AI sees it, scores it,
            and routes it to the right department — before you've finished typing a report.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/report"
              className="px-7 py-3.5 rounded-full bg-white text-[#0F2F63] font-semibold text-sm hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Report an issue
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-7 py-3.5 rounded-full border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              View live dashboard
            </Link>
          </div>

          <div className="mt-16 max-w-md bg-white/[0.07] border border-white/15 rounded-2xl backdrop-blur p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">AI agent feed</span>
              <span className="text-xs text-white/40">simulated preview</span>
            </div>
            <div className="flex items-center gap-3 transition-all duration-500" key={feedIndex}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {ISSUE_TYPES[feedIndex].icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{ISSUE_TYPES[feedIndex].label}</p>
                <p className="text-xs text-white/50">Routed to {ISSUE_TYPES[feedIndex].dept}</p>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                  ISSUE_TYPES[feedIndex].severity === "critical" ? "bg-red-500/20 text-red-300"
                  : ISSUE_TYPES[feedIndex].severity === "high" ? "bg-orange-500/20 text-orange-300"
                  : ISSUE_TYPES[feedIndex].severity === "medium" ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-green-500/20 text-green-300"
                }`}
              >
                {ISSUE_TYPES[feedIndex].severity}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-[#FAFBFC] py-28 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563C9] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563C9]" />
              How it works
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A]">
              From sighting to<br />resolution, four steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
            {STEPS.map((step) => (
              <div key={step.n} className="bg-white p-8 sm:p-10 hover:bg-slate-50 transition-colors">
                <span className="text-sm font-mono text-slate-400">{step.n}</span>
                <h3 className="text-xl font-bold mt-3 mb-2 text-[#0A0A0A]">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" className="bg-white py-28 px-6 sm:px-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2563C9] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563C9]" />
              Under the hood
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A]">
              Five agents,<br />one civic brain.
            </h2>
            <p className="mt-5 text-slate-500 leading-relaxed">
              Each report passes through a coordinated pipeline of specialized AI agents —
              not one model trying to do everything, but a system built like a real city department.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "👁️", name: "Vision Agent", desc: "Reads the uploaded image and detects the civic issue type with Gemini Vision." },
              { icon: "🏷️", name: "Categorization Agent", desc: "Assigns category, subcategory, severity, and descriptive tags." },
              { icon: "⚡", name: "Priority Agent", desc: "Scores urgency 0–100 using severity, location risk, and community votes." },
              { icon: "🧭", name: "Routing Agent", desc: "Matches the issue to the correct department automatically, no manual triage." },
              { icon: "🔍", name: "Duplicate Detection", desc: "Checks nearby reports within a radius so the same pothole isn't logged five times." },
              { icon: "📊", name: "Insights Agent", desc: "Surfaces ward-level trends, like rising pothole counts, on the live dashboard." },
            ].map((agent) => (
              <div key={agent.name} className="rounded-2xl border border-slate-200 p-6 hover:border-[#5790E6]/40 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#0F2F63]/5 flex items-center justify-center text-xl mb-4">
                  {agent.icon}
                </div>
                <h3 className="font-bold text-[#0A0A0A] mb-1.5">{agent.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" ref={statsBlock.ref} className="bg-[#0F2F63] text-white py-24 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="border-t border-white/20 pt-5">
                <p className="text-5xl sm:text-6xl font-bold tracking-tight">
                  {counts[i]}
                  {stat.suffix}
                </p>
                <p className="text-sm text-white/60 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAFBFC] py-28 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] mb-5">
            Spot something?<br />Tell the city.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-10">
            It takes one photo. The AI handles the rest, from category to department to priority.
          </p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0F2F63] text-white font-semibold hover:bg-[#16397d] transition-colors"
          >
            Report an issue now
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <footer className="bg-[#0F2F63] text-white/60 py-10 px-6 sm:px-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-[#5790E6]" />
            <span className="font-semibold">CivicPulse AI</span>
          </div>
          <p>Built for civic good · AI-powered infrastructure monitoring</p>
        </div>
      </footer>
    </div>
  );
}