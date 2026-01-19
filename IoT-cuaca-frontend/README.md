# IoT Cuaca Frontend

React + Vite rewrite of the original vanilla HTML dashboard for monitoring IoT weather sensors.

## Features

- 🔐 Token-based authentication with persistent session storage
- 📊 Real-time charts powered by Chart.js + react-chartjs-2
- ♻️ Automatic polling (5s) with graceful loading/error states
- 🎨 Tailwind CSS styling with responsive layouts

## Prerequisites

- Node.js 18+
- An accessible backend exposing:
  - `POST /login` returning `{ token }`
  - `GET /api/dashboard/stats` returning an array of records `{ temp, rain_level, wind_speed, created_at }`

## Environment

Create a `.env` file (or `.env.local`) when you need to override the default API base URL:

```
VITE_API_URL=http://localhost:3000
```

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:5173 to use the app. The dashboard is protected; you will be redirected to `/login` until you authenticate.

## Production Build

```bash
npm run build
npm run preview
```

This produces static assets under `dist/` that you can serve with any static host.

## Project Structure

```
src/
├─ App.jsx                # Routes + providers
├─ components/
│  ├─ MetricChart.jsx     # Reusable Chart.js wrapper
│  └─ ProtectedRoute.jsx  # Auth gate
├─ context/
│  └─ AuthContext.jsx     # Token state + interceptor
├─ hooks/
│  ├─ useAuth.js          # Context helper
│  └─ useDashboardData.js # Polling + data shaping
├─ routes/
│  ├─ Dashboard.jsx       # Main dashboard view
│  └─ Login.jsx           # Authentication form
├─ services/
│  └─ api.js              # Axios instance + helpers
└─ styles/
   └─ index.css           # Tailwind entry
```

## Next Steps

- Add automated tests (e.g., Vitest + React Testing Library)
- Introduce refresh-token workflow or OAuth provider
- Containerize with Docker for simplified deployment
