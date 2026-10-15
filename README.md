# SENTINEL NIDS — Network Intrusion Detection System Dashboard

Production-quality frontend for the Network Intrusion Detection System (NIDS) BCA Semester 7 Academic Project. Designed as an authentic Security Operations Center (SOC) dashboard inspired by enterprise SIEM and observability platforms.

---

## Architecture & Technology Stack

- **Core**: React 19, TypeScript (Strict Mode), Vite 8.
- **Routing**: React Router v7 (`createBrowserRouter`, layout routes, nested feature routes).
- **Styling**: SCSS & CSS Modules (`.module.scss`), CSS Custom Properties design system with complete Dark / Light theme tokens.
- **Server State Management**: TanStack Query (React Query v5) with centralized cache management, automatic stale times, background refetching, and query invalidation.
- **HTTP Client**: Centralized Axios client (`src/lib/axios.ts`) with request/response interceptors, typed error handling, and timeout safeguards.
- **Runtime Validation**: Zod schemas for environment variables, API payloads, form inputs, and domain contracts.
- **Client State**: Zustand for lightweight UI state (collapsible sidebar, responsive drawer, mock mode toggle).
- **Data Visualizations**: Recharts (multi-series Area charts, stacked Bar charts, and horizontal progress meters).
- **UI Components & Icons**: Lucide React icons, custom accessible UI primitives (`Button`, `Input`, `Select`, `Badge`, `Card`, `Modal`, `Skeleton`, `EmptyState`, `ErrorState`).
- **Notifications**: Sonner toast system with theme awareness.
- **Testing & Mocking**: Vitest, React Testing Library, and Mock Service Worker (MSW v2) for network interception.

---

## Folder Structure

```
frontend/ (workspace root)
├── public/
│   └── favicon.svg                  # Security shield vector icon
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Root app component
│   │   ├── router.tsx               # Client router definitions
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx  # Sidebar, topbar, search, notifications
│   │   │   └── DashboardLayout.module.scss
│   │   ├── pages/
│   │   │   ├── NotFoundPage.tsx     # 404 error page
│   │   │   └── NotFoundPage.module.scss
│   │   └── providers/
│   │       ├── AppProviders.tsx     # Combined query, theme & toast providers
│   │       ├── QueryProvider.tsx    # TanStack Query client provider
│   │       └── ThemeProvider.tsx    # Dark/Light theme provider with localStorage
│   ├── components/
│   │   └── ui/                      # Reusable design system primitives
│   │       ├── Badge/               # Severity & status indicators
│   │       ├── Button/              # Accessible button with loading states
│   │       ├── Card/                # Metric cards & content wrappers
│   │       ├── EmptyState/          # Zero-data visual placeholders
│   │       ├── ErrorState/          # Network error recovery with retry
│   │       ├── Input/               # Form text inputs with labels & icons
│   │       ├── Modal/               # Keyboard-accessible dialogs with backdrops
│   │       ├── Select/              # Standardized dropdown selects
│   │       ├── Skeleton/            # Shimmer loading placeholders
│   │       └── index.ts
│   ├── features/
│   │   ├── dashboard/               # SOC Overview page, KPI stats, charts
│   │   ├── traffic/                 # Packet stream table, filtering, deep inspection
│   │   ├── alerts/                  # Incident triage, severity filters, resolution
│   │   ├── detection/               # Pipeline statuses, signature counts, ML benchmarks
│   │   ├── analytics/               # Volumetric trends, time ranges, JSON export
│   │   ├── settings/                # Themes, API health probe, planned settings
│   │   └── system/                  # Django /api/health/ schema and hook
│   ├── lib/
│   │   ├── axios.ts                 # Centralized Axios instance with typed errors
│   │   ├── env.ts                   # Zod-validated environment configuration
│   │   └── queryClient.ts           # Configured TanStack QueryClient
│   ├── stores/
│   │   └── useAppStore.ts           # Zustand store (sidebar, mock toggle)
│   ├── styles/
│   │   ├── abstracts/               # SCSS variables, mixins, breakpoints
│   │   ├── base/                    # CSS reset, typography, global scrollbars
│   │   ├── themes/                  # _dark.scss and _light.scss color tokens
│   │   └── main.scss                # Stylesheet entry point
│   ├── test/
│   │   ├── setup.ts                 # Vitest test setup with MSW and matchMedia mocks
│   │   ├── mocks/
│   │   │   ├── handlers.ts          # MSW HTTP route handlers
│   │   │   ├── server.ts            # MSW Node test server
│   │   │   └── fixtures/            # Realistic cybersecurity demo fixtures
│   │   ├── unit/                    # Zod schema validation tests
│   │   ├── components/              # UI primitive component tests
│   │   └── features/                # Feature and MSW integration tests
│   ├── main.tsx                     # Vite React entrypoint
│   └── vite-env.d.ts                # TypeScript environment definitions
├── .env.example
├── .env
├── .prettierrc
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```

Environment variables:
| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base endpoint URL for the Django REST backend | `http://127.0.0.1:8000/api` |
| `VITE_USE_MOCK_DATA` | Toggle development demo mode with realistic fixtures | `true` |
| `VITE_API_TIMEOUT_MS` | Network timeout for Axios requests in milliseconds | `10000` |

### 3. Running the Development Server
```bash
npm run dev
```
By default, the Vite dev server starts on [http://localhost:5173/](http://localhost:5173/).

### 4. Running the Test Suite
Run all unit, component, and MSW integration tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### 5. Linting and Formatting
```bash
npm run lint
npm run format
```

### 6. Production Build
Type-check and bundle the production assets:
```bash
npm run build
```

---

## Mock Mode vs. Live Django Backend Mode

To support evaluation and demonstration both before and after full backend endpoint deployment, SENTINEL NIDS includes an explicit **Mock Telemetry Mode**:

1. **Toggle in the UI**:
   - The top navigation bar contains a dedicated button (**Mock Mode: ON / Live API Mode**).
   - The **Settings (`/settings`)** page features a dedicated toggle and a **Probe Health** button.
2. **Clear Labelling**:
   - When Mock Mode is active, all simulated metrics, packets, and alerts are explicitly tagged with a yellow `DEMO DATA` badge to avoid misrepresentation.
3. **Real Health Checking**:
   - The backend connection indicator polls the real Django endpoint `GET /api/health/`.
   - If the backend is offline, the status indicator gracefully displays `Backend Offline / Disconnected` without crashing or inventing fake online status.

---

## Backend Integration Status & Contracts

| Endpoint | Method | Expected Payload / Response | Frontend Status |
|---|---|---|---|
| `/api/health/` | `GET` | `{ "status": "ok", "service": "NIDS API", "database": "connected" }` | **Implemented & Verified** |
| `/api/dashboard/summary/` | `GET` | Aggregated packet counts, anomalies, top IPs, protocol distribution | **Ready for Backend** |
| `/api/traffic/` | `GET` | Paginated packet records with query filters (`protocol`, `classification`, `search`, `page`) | **Ready for Backend** |
| `/api/alerts/` | `GET` | Paginated security incidents (`severity`, `status`, `search`, `page`) | **Ready for Backend** |
| `/api/alerts/:id/` | `PATCH` | `{ "status": "ACKNOWLEDGED" \| "RESOLVED" }` | **Ready for Backend** |
| `/api/detection/overview/` | `GET` | Rule counts, active engine pipelines, ML model metadata | **Ready for Backend** |
| `/api/analytics/summary/` | `GET` | Time-series throughput and incident trend arrays (`range=24h`) | **Ready for Backend** |
