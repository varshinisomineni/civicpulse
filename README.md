# 🚀 CivicPulse AI
### AI-Powered Hyperlocal Civic Issue Reporting Platform

> **Your city, reading its own pulse.**

CivicPulse AI is an intelligent civic reporting platform that enables citizens to report infrastructure issues simply by uploading an image. Instead of filling lengthy forms, users capture a photo and AI automatically identifies the issue, estimates severity, assigns priority, routes it to the appropriate department, and tracks the issue until resolution.

Built with a multi-agent AI architecture, CivicPulse transforms traditional civic reporting into an automated, intelligent workflow.

---

## 🌐 Live Demo

**Frontend:** https://civicpulse-ow6u.vercel.app/

> **Note:**  
> The AI analysis service runs on the FastAPI backend. Since the backend is currently not deployed, AI-powered image analysis is available only when running locally.

---

# ✨ Features

## 🤖 AI-Powered Issue Detection

Upload a photo and CivicPulse AI automatically:

- Detects the civic issue
- Classifies issue category
- Estimates confidence score
- Calculates priority score
- Explains AI reasoning
- Predicts impact
- Suggests resolution
- Routes to the responsible government department

No manual categorization required.

---

## 🧠 Multi-Agent AI System

Instead of using one AI model, CivicPulse coordinates multiple specialized agents.

### 👁 Vision Agent

- Reads uploaded images
- Detects issue type using Gemini Vision
- Extracts visual context

---

### 🏷 Categorization Agent

Automatically determines:

- Category
- Subcategory
- Tags
- Severity

---

### ⚡ Priority Agent

Calculates urgency using:

- Severity
- Public safety
- Infrastructure risk
- Community impact

Returns a priority score from 0–100.

---

### 🗺 Routing Agent

Automatically routes reports to departments like:

- Road Maintenance
- Water Department
- Sanitation
- Electrical Department
- Parks Department

---

### 🔍 Duplicate Detection Agent

Prevents duplicate reports by checking nearby incidents within a defined radius.

---

### 📊 Community Insights Agent

Analyzes:

- Ward-level trends
- Issue distribution
- Popular issue categories
- Community statistics

---

# 🖥 User Experience

Citizens can:

✅ Upload issue photos

✅ Receive instant AI analysis

✅ Add issue details

✅ Mark exact location on Google Maps

✅ Submit reports

✅ Track issue lifecycle

✅ Upvote community reports

✅ Participate through comments

---

# 🛠 Admin Dashboard

A secure admin panel allows administrators to:

- View all reports
- Filter by status
- Update issue lifecycle
- Monitor active issues
- Track resolved reports
- Manage community workflow

Current admin authentication uses a password-based login.

Future versions will include:

- User Authentication
- Role-based access
- Government accounts
- Citizen accounts

---

# 📍 Issue Tracking

Every issue progresses through a transparent lifecycle:

```
Reported
      ↓
Verified
      ↓
Assigned
      ↓
In Progress
      ↓
Resolved
      ↓
Closed
```

Users can follow the complete status of every report.

---

# 💬 Community Engagement

Citizens can:

- Upvote issues
- Comment
- Track progress
- View AI insights

This encourages collaborative civic participation.

---

# 📷 Screenshots

## Landing Page
<img width="1906" height="843" alt="Screenshot 2026-07-01 004644" src="https://github.com/user-attachments/assets/f5b3971b-15c2-4a6b-9eb8-e85005a14c95" />


---

## How It Works

<img width="1911" height="863" alt="Screenshot 2026-07-01 004737" src="https://github.com/user-attachments/assets/c76eb6d1-1df2-4b0c-9e55-73bcf228f979" />

---

## AI Multi-Agent Architecture

<img width="1918" height="845" alt="Screenshot 2026-07-01 004901" src="https://github.com/user-attachments/assets/7f02c757-8a32-46b5-b1a7-3cd2181caee0" />
<img width="1913" height="873" alt="Screenshot 2026-07-01 004937" src="https://github.com/user-attachments/assets/d80b6a5a-daac-4862-93b6-2dce3422b537" />

---

## AI Report Generation

![AI Analysis](<img width="1771" height="870" alt="Screenshot 2026-07-01 013152" src="https://github.com/user-attachments/assets/b373c6ac-acba-4c39-b470-64a305011f67" />
)

---

## Issue Details

![Issue Details](<img width="1913" height="867" alt="Screenshot 2026-07-01 013244" src="https://github.com/user-attachments/assets/ce697c79-b2e1-42ac-93f0-a01bf6861c85" />
)

---

## Community Discussion

![Community](<img width="1578" height="858" alt="Screenshot 2026-07-01 013401" src="https://github.com/user-attachments/assets/b1b28158-10f3-4104-bd83-78d8da2432bf" />
)

---

## Admin Login

![Admin Login](<img width="1456" height="698" alt="Screenshot 2026-07-01 013503" src="https://github.com/user-attachments/assets/146ea6b3-4617-428e-a051-06fcf6e250f9" />)


---

## Admin Dashboard

![Admin Dashboard](<img width="1542" height="802" alt="Screenshot 2026-07-01 013635" src="https://github.com/user-attachments/assets/9a7924f2-3e87-44a9-98a1-d227f821418e" />
)

---

# 🏗 Architecture

```
Citizen
    │
    ▼
Upload Image
    │
    ▼
Vision Agent
    │
    ▼
Categorization Agent
    │
    ▼
Priority Agent
    │
    ▼
Routing Agent
    │
    ▼
Duplicate Detection
    │
    ▼
Firebase Database
    │
    ▼
Dashboard
```

---

# ⚙ Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Google Maps API

---

## Backend

- FastAPI
- Python
- Firebase Firestore
- Gemini API
- REST APIs

---

## AI

- Gemini Vision API
- Multi-Agent Architecture

---

## Database

- Firebase Firestore

---

## Deployment

Frontend

- Vercel

Backend

- FastAPI (Local)
- Ready for Render deployment

---

# 📂 Project Structure

```
CivicPulse/
│
├── backend/
│   ├── agents/
│   ├── routes/
│   ├── firebase_config.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
└── README.md
```

---

# 🚀 Running Locally

## Clone

```bash
git clone https://github.com/varshinisomineni/civicpulse.git
cd civicpulse
```

---

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Runs at

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs at

```
http://localhost:3000
```

---

# 🔐 Environment Variables

Backend

```
GEMINI_API_KEY=

GOOGLE_MAPS_API_KEY=

FIREBASE_SERVICE_ACCOUNT_PATH=

FRONTEND_URL=http://localhost:3000
```

---

# 📈 Future Improvements

- User Authentication
- Government Officer Portal
- Email Notifications
- Duplicate Image Matching
- AI Chat Assistant
- Predictive Infrastructure Analytics
- Mobile App
- Push Notifications
- GIS Heatmaps
- Smart Civic Analytics

---

# 💡 Why CivicPulse AI?

Traditional civic reporting often requires citizens to manually identify issue categories, determine responsible departments, and repeatedly follow up.

CivicPulse AI simplifies this process by combining computer vision, AI reasoning, automated routing, and community collaboration into a single intelligent platform that enables faster reporting and more efficient resolution of civic issues.

---

# 👩‍💻 Developed By

**Varshini Somineni**

GitHub:
https://github.com/varshinisomineni

---

## ⭐ If you found this project interesting, consider giving it a star!
