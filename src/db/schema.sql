-- Pathwork Pro — initial schema
-- Applied via tauri-plugin-sql migrations on startup.

CREATE TABLE IF NOT EXISTS projects (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  location      TEXT NOT NULL DEFAULT '',
  contractor    TEXT NOT NULL DEFAULT '',
  start_date    TEXT NOT NULL,
  end_date      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'Planning',
  notes         TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pay_items (
  id            TEXT PRIMARY KEY,
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pay_item_id   TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  quantity      REAL NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL DEFAULT '',
  unit_price    REAL NOT NULL DEFAULT 0,
  sort_order    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_pay_items_project ON pay_items(project_id);

CREATE TABLE IF NOT EXISTS month_targets (
  id            TEXT PRIMARY KEY,
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pay_item_id   TEXT NOT NULL REFERENCES pay_items(id) ON DELETE CASCADE,
  month_index   INTEGER NOT NULL,
  weight_pct    REAL NOT NULL DEFAULT 0,
  UNIQUE(pay_item_id, month_index)
);
CREATE INDEX IF NOT EXISTS idx_month_targets_project ON month_targets(project_id);

CREATE TABLE IF NOT EXISTS project_settings (
  project_id            TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  weight_tolerance_pct  REAL NOT NULL DEFAULT 2
);

-- Reserved for the PDM/CPM engine (next phase):
-- tasks, dependencies, suspensions, pdm_node_positions
-- all keyed by project_id, following the same pattern as pay_items.
