# 🏙️ NammaFix v2.0
### Real-Time Civic Issue Reporting & Municipal Dispatch Platform

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express%204.21-000000?logo=express)](https://expressjs.com/)
[![MapLibre GL](https://img.shields.io/badge/GIS-MapLibre%20GL%20JS-396B94?logo=maplibre&logoColor=white)](https://maplibre.org/)
[![MapTiler](https://img.shields.io/badge/Tiles-MapTiler%20Streets%20v2-0052FF?logo=maptiler&logoColor=white)](https://www.maptiler.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Single Port](https://img.shields.io/badge/Host-Unified%20Localhost%3A5000-A88462)](#-single-port-unified-architecture)

**NammaFix** is an urban infrastructure reporting and resolution platform designed for citizens and municipal field teams. Built as a **unified single-host web application**, it combines real-time GPS location tracking, GPU-accelerated MapLibre vector cartography, an animated preface intro experience, and an executive municipal admin operations desk.

---

## ⚡ Highlights & Key Capabilities

- **Unified Single-Port Localhost**: No more separate frontend and backend terminal windows. Running `npm start` automatically builds the React SPA and serves both the client application and all `/api/*` endpoints from a single host: **`http://localhost:5000`**.
- **GPU Vector Maps (MapLibre + MapTiler)**: High-performance vector tiles powered by **MapTiler Streets v2**, featuring 3D perspective pitch, status-coded civic marker pins, interactive popups, and smooth panning.
- **Continuous Real-Time GPS Tracking**: Integrated `navigator.geolocation.watchPosition` tracking engine with a pulsing beacon, accuracy radius, heading orientation, and dynamic Haversine distance calculations (e.g., *"140m away"*, *"1.2km away"*) on nearby incident cards.
- **Animated Preface Experience (`/preface`)**: Cinematic entrance sequence with dynamic concentric radar ring animations, simulated sensor handshake telemetry, and fast routing into Citizen or Admin portals.
- **Municipal Admin Operations Desk (`/admin`)**: Real-time SLA urgency tracking, tactical MapLibre dispatch radar, live verification queues, department routing, and audit history.
- **Editorial Design System on Pure White**: Clean, bright white background (`#FFFFFF`) accented with an art-directed warm palette:
  - **Deep Espresso (`#1A120E`)**: High-contrast, crystal-clear typography.
  - **Caramel (`#A88462`)**: Primary interactive triggers and focus rings.
  - **Umber (`#6B4A2E`) & Sandstone (`#E8E2D9`)**: Structured cards and borders.
- **Resilient Error Handling & Offline Shield**: React Error Boundary to eliminate blank-screen crashes, network offline status banner, and automatic fallback between live backend APIs and local seed datasets.

---

## 🗺️ Application Portals & Routes

| Path | View | Description |
|---|---|---|
| `/` | **Citizen Home** | Real-time neighborhood incident radar, live civic counters, quick report CTA, and nearby incident feed. |
| `/preface` | **Animated Preface** | System telemetry scan, city mesh connection sequence, and portal selector. |
| `/nearby` | **Map & Grid Mesh** | Interactive MapLibre full-viewport map with category filter pills, radius slider, and GPS pinpointing. |
| `/report` | **Incident Reporting** | Multi-step form with camera photo upload, drag-and-drop MapLibre location picker, and reverse geocoding. |
| `/issue/:id` | **Issue Lifecycle** | Detailed ticket overview with confirmation tally, photo evidence, and resolution timeline. |
| `/my-reports`| **Citizen History** | Triage tracker for complaints submitted by the logged-in citizen. |
| `/admin` | **Operations Desk** | Municipal dispatch command center with incident density map and KPI telemetry cards. |
| `/admin/issues` | **Triage Ledger** | Split-screen ticket inspection, one-click verification, department dispatch, and status updates. |

---

## 🛠️ Tech Stack & Architecture

```
nammafix/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── config/           # MongoDB (Local / Atlas / Embedded Memory) & Cloudinary
│   │   ├── controllers/      # Issue, Admin, Auth, Help controllers
│   │   ├── middleware/       # Rate limiting, Auth, Error handler
│   │   ├── models/           # Mongoose Schemas (Issue, Department, User, etc.)
│   │   ├── routes/           # REST endpoints mounted at /api
│   │   ├── services/         # Seed data, ID generator, notification engine
│   │   └── server.js         # Unified server (serves API + static frontend build)
│   └── package.json
│
├── frontend/                 # React 19 + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Button, Card, Badge, Input, Modal, ErrorBoundary
│   │   │   ├── layout/       # Header, BottomNav, CitizenLayout, AdminSidebar
│   │   │   ├── map/          # IssueMap (MapLibre), LocationPicker (Pin-drop)
│   │   │   └── issues/       # IssueCard, PhotoUpload, CategoryPicker, StatusTimeline
│   │   ├── hooks/            # useGeolocation (continuous GPS), useAuth
│   │   ├── pages/            # Citizen & Admin portal views, Preface.jsx
│   │   ├── services/         # API HTTP client with automatic mock fallback
│   │   └── styles/           # Design tokens and custom map styles
│   ├── .env                  # MapTiler API Key & API route config
│   └── package.json
│
├── package.json              # Root unified orchestrator scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- *(Optional)* Local MongoDB running on `mongodb://127.0.0.1:27017` (If not present, the backend automatically boots an **Embedded In-Memory MongoDB Server**).

### 2. Environment Configuration
The MapTiler API key is already configured in `frontend/.env`:
```env
VITE_API_URL=/api
VITE_MAPTILER_API_KEY=Np5vEGIEYhxnnSS00NKc
```

### 3. Run the Application

#### Option A: Unified Production Mode (Recommended — Single Port 5000)
Compiles the frontend bundle and launches the unified server:
```bash
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser. Both the web UI and the API are served together from this single port.

#### Option B: Hot-Reloading Development Mode
Runs both backend and Vite dev server concurrently with live reloading:
```bash
npm run dev
```
- Frontend dev server: `http://localhost:3000` (auto-proxies `/api` to port 5000)
- Backend server: `http://localhost:5000`

---

## 📡 API Reference Overview

All backend endpoints are prefixed with `/api`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and service status probe |
| `GET` | `/api/issues` | Fetch all public issues (supports category, status, search) |
| `POST` | `/api/issues` | Create a new incident with geocoded coordinates & photo URL |
| `GET` | `/api/issues/nearby` | Query issues within a radial distance from lat/lng |
| `GET` | `/api/issues/:id` | Fetch detailed single issue data and audit history |
| `GET` | `/api/admin/stats` | Retrieve municipal KPI metrics and resolution percentages |
| `PATCH` | `/api/admin/issues/:id/status` | Advance resolution status (`verified`, `in_progress`, `resolved`) |
| `POST` | `/api/admin/issues/:id/assign` | Assign incident to a specific municipal department |

---

## 🎨 Design System Variables

Defined in `frontend/src/styles/tokens.css`:
- **Surface**: Pure White `#FFFFFF` / Subtle Canvas `#FBF9F6`
- **Border**: Sandstone Line `#E8E2D9`
- **Typography Primary**: Deep Espresso `#1A120E`
- **Typography Secondary**: Warm Umber `#6B4A2E`
- **Brand Action**: Caramel `#A88462` (Hover: `#8F6D4C`)
- **Status Amber (Reported)**: `#D97706`
- **Status Cobalt (Verified)**: `#2563EB`
- **Status Orange (In-Progress)**: `#EA580C`
- **Status Emerald (Resolved)**: `#059669`

---

## 🛡️ License

Developed for the NammaFix civic problem reporting initiative. Open-source under the [MIT License](LICENSE).
