<div align="center">

# 🩺 CivicPulse AI

### Your city, reading its own pulse.

Snap a photo of a pothole, a leak, a broken light — CivicPulse AI sees it, scores it, and routes it to the right department before you've finished typing a report.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Vision%20%2B%20Language-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Status](https://img.shields.io/badge/status-active%20development-orange)]()

[Overview](#-overview) • [Features](#-features) • [Architecture](#-system-architecture) • [AI Agents](#-the-five-ai-agents) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Roadmap](#-roadmap)

</div>

<br />

<div align="center">
  <img src="docs/screenshots/01-landing-hero.png" alt="CivicPulse AI landing page" width="100%" />
</div>

<br />

## 📖 Overview

Municipal issue reporting is broken in the same way everywhere: a citizen spots a pothole, opens a clunky form, guesses at a category from a dropdown, writes a vague description, and submits it into a queue with no visible priority and no guarantee it reaches the right desk.

**CivicPulse AI** replaces the form with a camera. A citizen takes one photo — a multi-agent AI pipeline built on **Google Gemini** identifies the issue, scores its severity and urgency, checks whether it's already been reported nearby, assigns it to the correct municipal department, and puts it on a live public map — all in the time it takes to type a sentence.

It's built like a real city department: instead of one model trying to do everything, each report passes through a coordinated pipeline of five specialized agents, each with a single, well-defined job.

<br />

## ✨ Features

- **📸 Photo-first reporting** — No category-guessing, no long forms. Upload an image and GPS location; the AI does the rest.
- **🧠 Multi-agent AI pipeline** — Five purpose-built agents (vision, categorization, priority, routing, duplicate detection) coordinate on every single report.
- **⚡ Real-time severity scoring** — A 0–100 priority score blends AI-assessed severity, estimated location risk, and community votes.
- **🗺️ Live public issue map** — Every report appears instantly on a city-wide map via Google Maps, with status and severity at a glance.
- **🔁 Automatic duplicate detection** — Haversine-distance geospatial matching prevents the same pothole from being logged five times.
- **🏛️ Auto-routing to departments** — Reports are matched to the correct department (Road Maintenance, Sanitation, Water Supply, Drainage, Electrical, Parks & Recreation) with no manual triage.
- **📊 Status timeline** — Every issue is tracked through six lifecycle stages: `Reported → Verified → Assigned → In Progress → Resolved → Closed`.
- **🗳️ Community voting & comments** — Citizens can upvote issues and discuss them, surfacing the most urgent problems organically.
- **🏆 Leaderboard & impact score** — Gamified civic participation rewards active reporters.
- **🛠️ Admin dashboard** — A dedicated panel for municipal staff to filter, triage, and update issue status across the city.
- **🤖 AI-generated community insights** — Gemini summarizes recent activity into short, ward-level trend insights (e.g. rising pothole counts).

<br />

## 🖼️ Screenshots

### Public marketing site

| Hero | How it works |
|---|---|
| ![Hero](docs/screenshots/01-landing-hero.png) | ![How it works](docs/screenshots/02-how-it-works.png) |

| Five AI agents | By the numbers |
|---|---|
| ![AI Agents](docs/screenshots/03-ai-agents.png) | ![By the numbers](docs/screenshots/04-by-the-numbers.png) |

### Citizen app

| Live dashboard & map | Report an issue → instant AI analysis |
|---|---|
| ![Dashboard](docs/screenshots/05-live-dashboard.png) | ![Report issue](docs/screenshots/06-report-issue-ai-analysis.png) |

| Issue detail & status timeline | Community discussion |
|---|---|
| ![Issue detail](docs/screenshots/07-issue-detail-timeline.png) | ![Issue comments](docs/screenshots/08-issue-detail-comments.png) |

### Admin panel

| Admin access | Triage dashboard |
|---|---|
| ![Admin login](docs/screenshots/09-admin-login.png) | ![Admin dashboard](docs/screenshots/10-admin-dashboard.png) |

<br />

## 🏗️ System Architecture

```mermaid
flowchart TD
    A["📷 Citizen uploads photo + location\n(Next.js — /report)"] --> B["FastAPI · POST /api/issues/analyze"]
    B --> C["🧠 Vision Agent\nGemini 2.5 Flash"]
    C --> D["🏷️ Categorization\n(issue type, tags, confidence)"]
    D --> E["⚡ Priority Agent\nseverity + AI score + votes → 0–100"]
    E --> F["🧭 Routing Agent\nmaps issue type → department"]
    F --> G["🔍 Duplicate Detection\nhaversine radius check"]
    G --> H["FastAPI · POST /api/issues/submit"]
    H --> I[("🔥 Firestore\nissues collection")]
    I --> J["📊 Live Dashboard\n& Public Map"]
    I --> K["🛠️ Admin Panel\nstatus management"]
    I --> L["📈 Insights Agent\nGemini-generated trends"]
```

**Request flow at a glance:**

1. The Next.js frontend uploads an image to the FastAPI backend.
2. The **Vision Agent** calls Gemini 2.5 Flash with a structured-JSON prompt and gets back issue type, severity, confidence, reasoning, and a suggested fix.
3. The **Priority Agent** blends that into a 0–100 urgency score and assigns a department.
4. The **Duplicate Agent** checks Firestore for existing open issues of the same type within a configurable radius (default 100m).
5. The finished report — image, AI analysis, score, department, and routing note — is written to **Cloud Firestore**.
6. The public dashboard, map, and admin panel all read from the same live collection.

<br />

## 🤖 The Five AI Agents

> *"Each report passes through a coordinated pipeline of specialized agents — not one model trying to do everything, but a system built like a real city department."*

| # | Agent | Source | What it does |
|---|-------|--------|---------------|
| 01 | **Vision Agent** | [`backend/agents/vision_agent.py`](backend/agents/vision_agent.py) | Sends the uploaded image to **Gemini 2.5 Flash** and gets back a structured JSON verdict: issue type, confidence score, severity, estimated impact, and a suggested fix. |
| 02 | **Categorization Agent** | inside the Vision Agent's structured output | Assigns category, descriptive tags, and a department hint in the same Gemini pass — no separate classification step or manual tagging needed. |
| 03 | **Priority Agent** | [`backend/agents/priority_agent.py`](backend/agents/priority_agent.py) | Computes a final 0–100 priority score from severity weight, the AI's own confidence-weighted score, and a community-vote boost (capped at +20). |
| 04 | **Routing Agent** | [`backend/agents/routing_agent.py`](backend/agents/routing_agent.py) | Matches the issue type to the correct municipal department via `DEPARTMENT_MAP`, flags high/critical issues as urgent, and exposes per-department workload for load-balancing. |
| 05 | **Duplicate Detection Agent** | [`backend/agents/duplicate_agent.py`](backend/agents/duplicate_agent.py) | Runs a Haversine great-circle distance check against open issues of the same type so the same pothole isn't logged five times. |
| — | **Insights Agent** | `get_community_insights()` in [`priority_agent.py`](backend/agents/priority_agent.py) | A sixth, lighter-weight Gemini call that summarizes the last 20–30 reports into 2–3 short, ward-level community insights for the dashboard. |

**Supported issue types** (detected by the Vision Agent): `pothole` · `road_damage` · `damaged_footpath` · `garbage` · `illegal_dumping` · `water_leakage` · `flooding` · `drain_blockage` · `broken_streetlight` · `fallen_tree`

**Departments** (assigned by the Routing Agent): Road Maintenance · Sanitation Department · Water Supply Department · Drainage Authority · Electrical Department · Parks & Recreation · Municipal Corporation

<br />

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Lucide Icons |
| **Maps** | Google Maps JavaScript API (`@googlemaps/js-api-loader`) |
| **Backend** | FastAPI · Uvicorn · Pydantic |
| **AI / ML** | Google Gemini (`google-generativeai`) — vision + language reasoning |
| **Database** | Cloud Firestore (via `firebase-admin` on the backend, `firebase` SDK on the frontend) |
| **Auth (planned)** | Firebase Authentication (Google scaffold already wired in `lib/firebase.ts`) |
| **Image handling** | Pillow (server-side), native `File`/`FormData` (client-side) |

<br />

## 📂 Project Structure

```
civicpulse-main/
├── backend/
│   ├── agents/
│   │   ├── vision_agent.py        # Gemini Vision → issue detection & categorization
│   │   ├── priority_agent.py      # Priority scoring + community insights
│   │   ├── routing_agent.py       # Department routing & urgency flagging
│   │   └── duplicate_agent.py     # Geospatial duplicate detection
│   ├── routes/
│   │   ├── issues.py              # Issue CRUD, voting, comments, status, analysis
│   │   └── analytics.py           # Summary stats & leaderboard
│   ├── firebase_config.py         # Firestore client bootstrap
│   ├── main.py                    # FastAPI app entrypoint
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Marketing landing page
│   │   ├── dashboard/page.tsx     # Live public dashboard & map
│   │   ├── report/page.tsx        # Report an issue (photo → AI analysis → submit)
│   │   ├── issues/[id]/page.tsx   # Issue detail, timeline, votes, comments
│   │   └── admin/page.tsx         # Password-gated admin triage panel
│   ├── components/                # Navbar, IssueCard, MapView, AIAnalysisCard, Badges, Leaderboard
│   ├── lib/
│   │   ├── api.ts                 # Typed fetch wrappers for the FastAPI backend
│   │   └── firebase.ts            # Firebase client SDK bootstrap
│   └── package.json
│
├── docs/screenshots/              # README assets
└── README.md
```

<br />

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.18+ and npm
- **Python** 3.10+
- A **Firebase** project with Firestore enabled
- A **Google Gemini API key** ([Google AI Studio](https://aistudio.google.com/app/apikey))
- A **Google Maps JavaScript API key** with Maps + Places enabled

### 1 · Clone the repo

```bash
git clone https://github.com/<your-username>/civicpulse-ai.git
cd civicpulse-ai
```

### 2 · Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FRONTEND_URL=http://localhost:3000
```

Download your Firebase **service account key** (Project Settings → Service Accounts → Generate new private key) and save it as `backend/serviceAccountKey.json`. This file is already excluded via `.gitignore` — never commit it.

Run the API:

```bash
uvicorn main:app --reload --port 8000
```

The API is now live at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`.

### 3 · Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Run the app:

```bash
npm run dev
```

Visit `http://localhost:3000`.

<br />

## 🔑 Environment Variables Reference

**Backend** (`backend/.env`)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key for Google Gemini (vision + language calls) |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to the Firebase Admin SDK service account JSON |
| `FRONTEND_URL` | Allowed CORS origin for the deployed frontend |

**Frontend** (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Web SDK config (API key, auth domain, project ID, storage bucket, sender ID, app ID, measurement ID) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key used by `MapView.tsx` |

<br />

## 📡 API Reference

Base URL: `http://localhost:8000` · Interactive Swagger docs at `/docs`

### Issues — `/api/issues`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Upload an image; runs the Vision Agent and returns structured AI analysis |
| `POST` | `/check-duplicate` | Checks for nearby open issues of the same type within a radius |
| `POST` | `/submit` | Creates a new issue: runs Priority + Routing agents and writes to Firestore |
| `GET` | `/` | List issues, optionally filtered by `status` / `issue_type`, sorted by priority |
| `GET` | `/{issue_id}` | Fetch a single issue by ID |
| `POST` | `/{issue_id}/vote` | Upvote an issue (boosts its priority score) |
| `POST` | `/{issue_id}/comment` | Add a citizen comment to an issue |
| `PATCH` | `/{issue_id}/status` | Update issue status and append a timeline entry |
| `GET` | `/insights/community` | AI-generated community insight summaries (Insights Agent) |

### Analytics — `/api/analytics`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/summary` | Total / open / in-progress / resolved counts, breakdowns by category, severity, and status |
| `GET` | `/leaderboard` | Top citizen reporters ranked by score, with badge tiers |

### Issue lifecycle

```
Reported → Verified → Assigned → In Progress → Resolved → Closed
```

Every transition is appended to the issue's `timeline` array with a timestamp and note, so the full audit trail is visible on both the public issue page and the admin panel.

<br />

## 🛠️ Admin Panel

The admin panel (`/admin`) is gated behind a password prompt for early-stage development and demos.

> ⚠️ **Security notice:** Admin access currently uses a single hardcoded password (`civicpulse2026`, set in `frontend/app/admin/page.tsx`) checked client-side, with the unlocked state stored in `sessionStorage`. **This is a placeholder, not production authentication** — it does not protect the underlying API routes, which currently accept status updates from any caller. Before deploying publicly:
> - Change the default password immediately.
> - Replace it with real Firebase Authentication + role-based custom claims (the client SDK and provider are already scaffolded in `lib/firebase.ts`).
> - Add server-side auth checks to the admin-facing FastAPI routes (`/status`, future delete/assign endpoints).

This is tracked under [Roadmap](#-roadmap) below.

<br />

## 🗺️ Roadmap

- [ ] Replace hardcoded admin password with Firebase Authentication + role-based access control
- [ ] Server-side authorization on admin/state-changing API routes
- [ ] Image upload to Firebase Storage / Cloud Storage (currently expects a hosted `image_url`)
- [ ] Push/email notifications on status changes
- [ ] Department-specific dashboards and SLA tracking
- [ ] Public API rate limiting
- [ ] Automated tests (backend: pytest, frontend: Playwright/RTL)
- [ ] CI/CD pipeline (GitHub Actions → Vercel + Render/Cloud Run)

<br />

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br />

## 📄 License

No license has been set for this project yet. Until one is added, all rights are reserved by default — add a `LICENSE` file (MIT is a common choice for open-source civic-tech projects) before accepting outside contributions or publishing more broadly.

<br />

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for multimodal vision and language reasoning
- [Firebase](https://firebase.google.com/) for real-time data and hosting infrastructure
- [Next.js](https://nextjs.org/) and [FastAPI](https://fastapi.tiangolo.com/) for the application framework
- Built for civic good — AI-powered infrastructure monitoring for cities and communities

<br />

<div align="center">

**CivicPulse AI** · Built for civic good

</div>
