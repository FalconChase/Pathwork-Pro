# PATHWORK.md
# Project brain for Pathwork Pro. Hard ceiling: 120 lines. Amendment threshold: 100 lines.
# v0.1 — retroactive catch-up entry, seeded from prior chat handover + live repo check.
---
## PROJECT
NAME        : Pathwork Pro
DESCRIPTION : Desktop project-management app for construction/engineering scheduling — PDM/CPM analysis, pay item (BOQ) tracking, month-by-month progress targets. Rebuild-from-scratch of a prior Vite+React+Firebase web app.
ONBOARDED   : 2026-08-20 (brain system adopted; app build started earlier, exact date not logged)

---
## STACK
- Tauri 2 + React 19 + TypeScript + Tailwind CSS (same stack as RACOS)
- Local SQLite via tauri-plugin-sql — offline-first, no cloud sync for now (Supabase sync considered for later, not decided)
- Zustand for UI state

---
## INFRA
| ITEM        | VALUE |
|-------------|-------|
| Repo path   | C:\Users\ACER\Desktop\CORELOGIX\PATHWORK PRO\ (local only, no git repo initialized yet, not pushed anywhere) |
| Local DB    | tauri-plugin-sql applies /src/db/schema.sql on startup; creates pathwork.db in the app's local data dir |
| Migrations  | Currently a single schema.sql (IF NOT EXISTS style), not yet split into versioned migration files the way RACOS does — revisit once schema starts changing after data exists |

---
## PHASE
Phase 0 build. Full scaffold in place and running (`npm install && npm run tauri dev`). Dashboard (project list/create, derived contract amount), Project page shell with tab switcher, Project tab (title/location/contractor/dates/status/notes), Pay Items tab (editable BOQ table, live amount calc, total row), and Month Targets tab (pay items × auto-derived months matrix, %/amount toggle, tolerance warning icons, always-peso monthly total row) are all built and working. A missing src-tauri/icons/* set crashed cargo build on Windows — fixed with placeholder icons and removing the macOS-only icon.icns reference. PDM/CPM engine, Settings tab, and everything past Month Targets is not yet started.

---
## STATE

### ACTIVE
| ID | PRIORITY | ITEM             | BLOCKED BY |
|----|----------|------------------|------------|
| —  | —        | No active items  | —          |

### BLOCKED
| ID | PRIORITY | ITEM | BLOCKED BY |
|----|----------|------|------------|
| —  | —        | None | —          |

### NEXT
| ID | PRIORITY | ITEM | BLOCKED BY |
|----|----------|------|------------|
| PPT006 | MED | Settings tab — make `project_settings.weight_tolerance_pct` editable per project (currently fixed at 2% at creation) | — |
| PPT007 | HIGH | PDM/CPM scheduling engine — forward/backward pass, float calc, FS/SS/FF/SF relationship types; needs `tasks`/`dependencies` tables first | — |
Falcon hasn't decided which of PPT006/PPT007 to pick up first — both open.

### DONE
| ID | PRIORITY | ITEM | SESSION |
|----|----------|------|---------|
| PPT001 | HIGH | Tauri 2 + React 19 + TS + Tailwind scaffold; SQLite schema (projects/pay_items/month_targets/project_settings) + tauri-plugin-sql wiring | SES001 |
| PPT002 | HIGH | Dashboard — project cards, create project, derived contract amount (SUM of pay_items.amount) | SES001 |
| PPT003 | MED | Project page shell + tab switcher; Project tab (title/location/contractor/dates/status/notes, derived contract amount) | SES001 |
| PPT004 | HIGH | Pay Items tab — editable BOQ table, live amount calc (qty × unit_price), total row | SES001 |
| PPT005 | HIGH | Month Targets tab — pay items × auto-derived-from-dates months matrix, weight_pct stored/amount derived, %/amount toggle per cell, tolerance soft-warning icon, monthly total row always in peso | SES001 |

---
## DECISIONS
| ID     | STATUS | DECISION |
|--------|--------|----------|
| PPD001 | LOCKED | Multi-project workspace — Dashboard lists all projects; opening one scopes everything else via `project_id` |
| PPD002 | LOCKED | `contract_amount` is never stored on `projects` — always derived as `SUM(pay_items.amount)` for that project |
| PPD003 | LOCKED | Month Targets grid cells store `weight_pct` only; `amount` is always derived (`item.amount * weight_pct / 100`), never stored redundantly |
| PPD004 | LOCKED | Month columns in Month Targets are auto-calculated from the project's `start_date`/`end_date` — never manually configured |
| PPD005 | LOCKED | Month Targets' monthly total row always displays as a peso amount regardless of the %/amount toggle above it — feeds a future S-curve, and averaging % across different pay items isn't meaningful |
| PPD006 | LOCKED | Row-level weight validation (should sum to 100% across months) is a soft warning (⚠ icon), never a hard block; tolerance is per-project (`project_settings.weight_tolerance_pct`, fixed at 2% at project creation until PPT006 ships) |

---
## FILES
| FILE | LOCATION |
|------|----------|
| PATHWORK.md | /PATHWORK PRO/_brain/PATHWORK.md |
| SESSIONS.md | /PATHWORK PRO/_brain/SESSIONS.md |
| BUGS.md | /PATHWORK PRO/_brain/BUGS.md |
| FIXES.md | /PATHWORK PRO/_brain/FIXES.md |
| PLANS.md | /PATHWORK PRO/_brain/PLANS.md |
| TEMPORARIES.md | /PATHWORK PRO/_brain/TEMPORARIES.md |
| SCHEMA_LIBRARY.md | /PATHWORK PRO/_brain/SCHEMA_LIBRARY.md — cross-check reference (columns/formulas per tab); updated at session close or on explicit request, not after every change |

---
# Lines: 78 / 120 — Budget remaining: 42
