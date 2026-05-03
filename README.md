# 〰 OverFlow — Agentic Premier League

> **Stadium crowd intelligence, built at GDG Cloud New Delhi — Build With AI :: Agentic Premier League (May 2026)**

A real-time stadium operations console that uses AI-powered crowd analysis to prevent gate congestion before it becomes dangerous. Built in 3 hours as a live hackathon submission for Problem Statement 3 of the GDG APL event.

🔗 **Live Demo:** [build-with-ai-liart.vercel.app](https://build-with-ai-liart.vercel.app)  
📁 **Repo:** [github.com/paarthbhatt/BuildWithAI](https://github.com/paarthbhatt/BuildWithAI)

---

## 🏟️ What It Does

OverFlow is a matchday control surface for stadium organizers and stewards. Instead of reacting to overcrowding after it happens, the system uses **Gemini Vision AI** to analyze gate camera images and proactively issue crowd advisories — redirecting fans to less congested entry points in real time.

It has five core sections:

| Section | Purpose |
|---|---|
| **Overview** | Stadium-wide command view with gate coverage summary |
| **Match Center** | Live simulated cricket scorecard with ball-by-ball feed |
| **Gate Operations** | Per-gate crowd pressure, queue status, and steward recommendations |
| **AI Insights** | Upload a gate camera image → Gemini returns a crowd density advisory |
| **Community** | Shared operational feed for organizer broadcasts and fan updates |

---

## ✨ Key Features

- **Gemini Vision crowd analysis** — upload any gate camera image and receive an AI-generated advisory with density rating and recommended action
- **Graceful fallback system** — if the AI is unavailable, the system returns safe pre-computed advisories so operations never go dark
- **Live telemetry with 5s polling** — gate statuses refresh automatically; no manual refresh needed
- **Simulated real-time match engine** — ball-by-ball cricket scorecard keeps IPL energy alive on the operations console
- **Community broadcast feed** — organizers post directives, fans post gate updates; both streams visible on one screen
- **8-gate monitoring** — North, East, South, and West stands each have dedicated gate tracking with fill %, wait time, and status classification (Clear / Moderate / Busy / Critical)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (TypeScript) |
| Backend | Python (FastAPI) |
| AI | Google Gemini Vision API |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Styling | CSS Modules |
| Data | Live telemetry + pseudo-data continuity fallback |

---

## 📁 Project Structure

```
BuildWithAI/
├── frontend/          # Next.js app (TypeScript)
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── overview/            # Stadium command overview
│   │   ├── match-center/        # Live cricket scorecard
│   │   ├── operations/          # Gate pressure & queue control
│   │   ├── insights/            # Gemini vision advisory + match data
│   │   └── community/           # Organizer + fan feed
│   └── public/                  # Static images (stadium, gates, crowd)
├── backend/           # Python FastAPI server
│   └── main.py                  # API routes, Gemini integration
├── render.yaml        # Render deployment config (backend)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)

### 1. Clone the repo

```bash
git clone https://github.com/paarthbhatt/BuildWithAI.git
cd BuildWithAI
```

### 2. Set up the backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
GEMINI_API_KEY=your_google_ai_studio_key_here
```

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 How the AI Works

The AI Insights page accepts an image upload from a gate camera (JPG or PNG). The image is sent to the backend, which calls the **Gemini Vision API** with the following prompt structure:

```
Analyze this crowd image from a cricket stadium gate.
Return:
- crowd_density: "low" | "moderate" | "high" | "critical"
- estimated_wait_minutes: number
- advisory: one clear sentence recommending action to fans
- confidence: 0.0–1.0
```

Gemini returns a structured advisory which is displayed on screen. If the API is unreachable or rate-limited, the system falls back to a safe pre-computed advisory so operations are never disrupted.

---

## 📡 Deployment

### Frontend (Vercel)

The `frontend/` folder is connected to Vercel for automatic deployments on every push to `main`.

Set the following environment variable in Vercel:
```
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
```

### Backend (Render)

The `render.yaml` file configures the backend as a Render web service. Set the following secret in Render:
```
GEMINI_API_KEY=your_key_here
```

---

## 🎯 Problem Statement

Built for **Problem Statement 3** of the GDG APL hackathon:

> *"An application to issue advisories on which gates of the stadium are overcrowded and which gates people should use preferably, with live updates. People can also post, and the organizers can post updates for the cricket match."*

---

## 🏆 Evaluation Criteria

This project was evaluated on:

- **Innovation** — AI-first approach using Gemini Vision for real-world crowd safety
- **Impact** — Addresses a genuine safety and logistics problem at large IPL stadiums
- **Execution** — Fully functional prototype with live deployment, working AI integration, and graceful fallbacks

---

## 👤 Author

**Paarth Bhatt**  
Built solo at GDG Cloud New Delhi — Build With AI :: Agentic Premier League  
May 3, 2026 · 2:00 PM – 8:00 PM IST

---

## 📄 License

MIT — feel free to fork, extend, and deploy your own stadium intelligence console.
