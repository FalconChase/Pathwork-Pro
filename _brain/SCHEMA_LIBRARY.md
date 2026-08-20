# Pathwork Pro Schema Library

Reference doc for cross-checking what's actually in the app against what's actually in the database. Organized per tab/screen. Local-only SQLite (`src/db/schema.sql`), applied via tauri-plugin-sql on startup as a single IF-NOT-EXISTS script (not yet split into versioned migrations — revisit once schema changes need to land against data that already exists).

Last compiled: 2026-08-20 (SES001), cross-checked directly against `src/db/schema.sql` and `src/types/index.ts`.

---

## Dashboard

**projects** (Local) — project cards list, create form.
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | |
| title | TEXT | |
| location | TEXT | default '' |
| contractor | TEXT | default '' |
| start_date | TEXT | ISO date |
| end_date | TEXT | ISO date |
| status | TEXT | default 'Planning'; `ProjectStatus` = Planning \| Ongoing \| On Hold \| Completed |
| notes | TEXT | default '' |
| created_at, updated_at | TEXT | default datetime('now') |

Derived: **contract_amount** — `SUM(pay_items.amount)` for the project (PPD002). Never stored on `projects`.

---

## Project tab

Same `projects` row as Dashboard — edits title/location/contractor/dates/status/notes; shows the same derived contract_amount.

---

## Pay Items tab

**pay_items** (Local) — editable BOQ table.
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | |
| project_id | TEXT FK → projects, ON DELETE CASCADE | |
| pay_item_id | TEXT | user-facing item code, not the PK |
| description | TEXT | default '' |
| quantity | REAL | default 0 |
| unit | TEXT | default '' |
| unit_price | REAL | default 0 |
| sort_order | INTEGER | default 0 |

Derived: **amount** = `quantity * unit_price`, computed in the UI/query layer, never stored (see `PayItemWithAmount` view-model type). Total row sums all rows' derived amounts.

---

## Month Targets tab

**month_targets** (Local) — pay items × months matrix.
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | |
| project_id | TEXT FK → projects, ON DELETE CASCADE | |
| pay_item_id | TEXT FK → pay_items, ON DELETE CASCADE | |
| month_index | INTEGER | 1-based, relative to project start_date |
| weight_pct | REAL | default 0, 0-100 |

UNIQUE(pay_item_id, month_index).

Derived: cell **amount** = `pay_item.amount * weight_pct / 100` (PPD003). Month columns are computed from `projects.start_date`/`end_date`, never stored as their own rows (PPD004). Monthly total row always displays as a peso amount regardless of the tab's %/amount toggle (PPD005). Row-level weight validation (weights should sum ~100% across a pay item's months) is a soft ⚠ warning only, tolerance-driven (PPD006).

**project_settings** (Local) — one row per project.
| Column | Type | Notes |
|---|---|---|
| project_id | TEXT PK, FK → projects, ON DELETE CASCADE | |
| weight_tolerance_pct | REAL | default 2 — acceptable deviation from 100% before the ⚠ warning fires; not yet editable in-app (PPT006) |

---

## Reserved (not yet created)

Noted in `schema.sql` for the PDM/CPM phase, no tables exist yet: `tasks`, `dependencies`, `suspensions`, `pdm_node_positions` — all expected to key off `project_id`, same pattern as `pay_items`.
