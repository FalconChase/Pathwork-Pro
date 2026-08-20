export type ProjectStatus = "Planning" | "Ongoing" | "On Hold" | "Completed";

export interface Project {
  id: string;
  title: string;
  location: string;
  contractor: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  status: ProjectStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PayItem {
  id: string;
  project_id: string;
  pay_item_id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  sort_order: number;
}

// amount is always derived (quantity * unit_price) — computed in the UI/query
// layer, never stored redundantly out of sync with its inputs.

export interface MonthTarget {
  id: string;
  project_id: string;
  pay_item_id: string;
  month_index: number; // 1-based, relative to project start_date
  weight_pct: number; // 0-100
}

export interface ProjectSettings {
  project_id: string;
  weight_tolerance_pct: number; // acceptable deviation from 100% before a soft warning
}

// Derived/view-model helpers, not stored directly
export interface PayItemWithAmount extends PayItem {
  amount: number;
}

export interface MonthColumn {
  index: number;
  label: string; // e.g. "Jun 2026"
}
