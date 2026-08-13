# Car Sales Analytics Dashboard

> **Practical interview task** - Develop a simple data visualization dashboard using React and Redux that fetches data from a Firestore database and allows users to filter the data based on different criteria.


Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS**.

---

## What this project does (simple overview)

Imagine a used-car marketplace manager who asks:

> “How many cars did we sell? What’s our revenue? Which makes and body types sell best? How do top states compare month by month?”

This app answers those questions in one screen:

1. **Loads sales records** from Firebase Firestore (not a fake local JSON file).
2. **Lets you filter** by search, make, state, body type, price range, and sale date.
3. **Shows KPIs** (totals, averages, revenue) that update instantly when filters change.
4. **Draws interactive charts** so patterns are easy to spot.
5. **Lists every matching sale** in a searchable/sortable table, with CSV / Excel / print export.
6. Works well on **desktop and mobile** (collapsible sidebar, responsive grids, touch-friendly filters).

In short: **Firestore → Redux → Filters → KPIs + Charts + Table**.

---

## Assignment coverage

| Requirement | How it was implemented |
|-------------|------------------------|
| React dashboard | Next.js App Router + React 19 client components |
| Redux for state | Redux Toolkit (`cars`, `filters`, `theme`) |
| Fetch from Firestore | Firebase Web SDK → `car_sales` collection |
| Filter by criteria | Client-side selectors (search, multi-select, price, date, chart click) |
| Data visualization | amCharts 5 (bar, donut, multi-series area/line) |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| State | Redux Toolkit + React-Redux |
| Backend / DB | Firebase Cloud Firestore |
| Charts | amCharts 5 |
| Icons / motion | Lucide React, Framer Motion (KPI count-up) |
| Export | CSV, Excel (`xlsx`), Print |
| Dates | `react-datepicker` + `date-fns` |

---

## Features

### Admin shell
- Dark navy collapsible sidebar (`AutoAdmin`)
- Sticky top bar with export actions + dark mode toggle
- Mobile drawer menu + overlay

### Filters (all client-side on Firestore data)
- Debounced global search (make, model, state, VIN, seller, etc.)
- Multi-select for **Make**, **State**, **Body type**
- Min / max **price** range
- **Sale date** range picker
- Active filter chips + one-click reset
- Click a chart category to filter the rest of the dashboard

### KPI cards
- Total cars, total revenue, average price, highest price, total sellers, average odometer
- Animated count-up values
- Hover lift effect (KPI cards only)

### Charts
- **Sales by Make** — bar chart (click to filter)
- **Body Type Mix** — donut with radial gradient (click to filter)
- **Top 3 States — Monthly Sales Count** — multi-series smoothed line + colored area fill, legend hover highlight, months aligned for fair comparison

### Widgets & table
- Top makes, recent sales, auto-generated insights
- Sortable sales table
- Export **CSV**, **Excel**, or **Print**

### UX polish
- Until Tablet screen responsive layout
- Dark / light theme
- Loading skeleton + empty / error states
- Firestore error guidance when rules block reads

---

## Data source

Raw dataset (large):

**[Vehicle Sales Data on Kaggle](https://www.kaggle.com/datasets/syedanwarafridi/vehicle-sales-data)**

### Why a smaller subset was uploaded to Firebase

The full Kaggle file is very large. Firebase’s **free Spark plan** has daily limits for **reads and writes**. Uploading / reading hundreds of thousands of documents would:

- Burn through the free quota quickly
- Make first load slow for a demo / interview review

So a **cleaned, smaller sample** (`my-app/car_prices_clean.csv`, ~298 records) was prepared and uploaded to the Firestore collection **`car_sales`**.

That keeps the demo:

- Fast to load
- Safe on free-tier limits
- Still rich enough for real filters, KPIs, and charts

> The architecture is the same as production: swap in a larger collection (or paid plan) and the UI keeps working — filtering stays client-side on whatever was fetched.

---

## Project structure

```text
.
├── README.md                 ← you are here
└── my-app/                   ← Next.js application
    ├── .env.example          ← copy to .env and fill Firebase keys
    ├── car_prices_clean.csv  ← cleaned sample used for upload
    ├── package.json
    ├── scripts/
    │   └── uploadToFirestore.mjs
    └── src/
        ├── app/              ← layout, page, global styles
        ├── components/
        │   ├── charts/       ← amCharts visualizations
        │   ├── dashboard/    ← main dashboard composition
        │   ├── filters/      ← filter bar, multi-select, date field
        │   ├── kpi/          ← KPI cards
        │   ├── layout/       ← admin shell + sidebar
        │   ├── table/        ← sales table
        │   ├── ui/           ← skeleton / empty states
        │   └── widgets/      ← side widgets
        ├── hooks/
        ├── lib/              ← firebase, firestore, export, states map
        ├── store/            ← Redux store, slices, selectors
        └── types/
```

---

## Environment variables

1. Copy the example file:

```bash
cd my-app
cp .env.example .env
```

On Windows (PowerShell):

```powershell
cd my-app
Copy-Item .env.example .env
```

2. Open [Firebase Console](https://console.firebase.google.com/) → your project → **Project settings** → **Your apps** → copy the web config into `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> `.env` is gitignored. Never commit real keys to GitHub.

### Firestore rules (for local / interview demo)

Allow read access on `car_sales` while reviewing (tighten for production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /car_sales/{docId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Project setup

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm**
- A Firebase project with **Firestore** enabled

### Install & run

```bash
# 1) Go into the app folder
cd my-app

# 2) Install dependencies
npm install

# 3) Create env file (see section above)
cp .env.example .env

# 4) Start the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**.

### Other scripts

```bash
npm run build    # production build
npm run start    # run production build
npm run lint     # ESLint
```

### Optional: re-upload CSV → Firestore

If you need to seed / refresh data:

1. Put your cleaned CSV at `my-app/car_prices_clean.csv`
2. Ensure Firebase config in `scripts/uploadToFirestore.mjs` (or better: load from env) matches your project
3. Temporarily allow writes in Firestore rules
4. Run:

```bash
cd my-app
node scripts/uploadToFirestore.mjs
```

5. Lock writes again after upload

---

## Architecture (how data flows)

```text
┌─────────────────┐     fetch once      ┌──────────────────┐
│ Cloud Firestore │ ──────────────────► │ Redux carsSlice  │
│  car_sales      │                     │  (raw records)   │
└─────────────────┘                     └────────┬─────────┘
                                                 │
                                        filtersSlice state
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │ Memoized         │
                                        │ selectors        │
                                        │ (filtered cars,  │
                                        │  KPIs, chart     │
                                        │  series)         │
                                        └────────┬─────────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────────┐
                     ▼                           ▼                           ▼
               KPI cards                    Charts                     Table / Export
```

**Design choice:** fetch from Firestore, then **filter in Redux selectors**. That matches an interactive dashboard where users change many filters quickly without firing a new Firestore query for every click.

---

## How to review (for interviewers)

1. Clone the repo and follow **Project setup**.
2. Confirm `.env` points at a Firestore project that already has `car_sales` data (or run the upload script).
3. Open the dashboard and try:
   - Multi-select filters + date range
   - Click a make bar / body slice → table updates
   - Collapse the sidebar / resize to mobile width
   - Toggle dark mode
   - Export CSV / Excel / Print
4. Optional code tour:
   - `src/store/selectors.ts` — filtering + KPI + chart data
   - `src/components/dashboard/Dashboard.tsx` — UI composition
   - `src/lib/firestore.ts` — Firestore read layer
   - `src/components/charts/*` — amcharts setup

---

## Responsive design

- Collapsible desktop sidebar; hamburger drawer on small screens
- KPI grid: 1 → 2 → 3 → 6 columns by breakpoint
- Charts stack on mobile, sit side-by-side on large screens
- Filter controls wrap cleanly; table scrolls horizontally when needed

---

## What I focused on for this task

- Clear **admin product feel**, not a bare chart demo
- Correct **Redux Toolkit** patterns (slices + memoized selectors)
- Real **Firestore** integration with honest free-tier data sizing
- Interactive **charts that drive filters**
- **Responsive** layout and dark mode
- Clean structure so another engineer can extend it quickly

---

## Author

**Abhishek Vithani**  
Interview practical

---

## License / data credit

- Application code: project submission for the assigned practical task.
- Dataset origin: [Vehicle Sales Data (Kaggle)](https://www.kaggle.com/datasets/syedanwarafridi/vehicle-sales-data).
