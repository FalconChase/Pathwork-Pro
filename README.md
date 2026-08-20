# Pathwork Pro (desktop)

Tauri 2 + React 19 + TypeScript + Tailwind + local SQLite (tauri-plugin-sql).
Same stack as RACOS. No cloud sync for now — everything is local-only.

## Prerequisites (should already be set up from RACOS)

- Node.js + npm
- Rust toolchain (`rustup`)
- Tauri CLI (`cargo install tauri-cli` or via `npx @tauri-apps/cli`)
- Platform build tools (WebView2 on Windows, Xcode CLT on macOS, `webkit2gtk` on Linux)

## Setup

```bash
npm install
npm run tauri dev
```

This launches the desktop window with hot reload. On first run, `tauri-plugin-sql`
applies `src/db/schema.sql` automatically and creates `pathwork.db` in the app's
local data directory.

## What's built so far

- **Dashboard** — list/create projects, shows derived contract amount per project
- **Project → Project tab** — title, location, contractor, dates, status, notes
- **Project → Pay items tab** — editable BOQ table (ID, description, qty, unit,
  unit price, amount, total)
- **Project → Month targets tab** — weight %/amount matrix, pay items × months
  (months auto-derived from project start/end dates), toggle between % and
  amount display, tolerance-based warning icon (tolerance stored in
  `project_settings`, editable later from a Settings tab)

## Not yet built

- Settings tab (tolerance is currently fixed at 2% per project, set at creation)
- PDM/CPM engine + PDM View, Gantt, Progress tabs — reserved table slots
  (`tasks`, `dependencies`, `suspensions`, `pdm_node_positions`) are noted in
  `schema.sql` but not yet created
- App icons — placeholder paths are referenced in `tauri.conf.json` under
  `src-tauri/icons/`; add real `.png`/`.icns`/`.ico` files there or the bundle
  step will fail (dev mode works fine without them)

## Data model

See `src/db/schema.sql` for the source of truth, and `src/types/index.ts`
for the matching TypeScript shapes. All project-scoped tables key off
`project_id`, so this is a multi-project workspace by design — see
`DashboardPage.tsx` / `ProjectPage.tsx` for the open/close pattern.
