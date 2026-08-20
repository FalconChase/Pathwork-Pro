import { getDb, newId } from "./client";
import type { MonthTarget, MonthColumn, Project } from "@/types";

/** Derives month columns spanning a project's start_date..end_date, inclusive. */
export function deriveMonthColumns(project: Project): MonthColumn[] {
  const start = new Date(project.start_date);
  const end = new Date(project.end_date);
  const cols: MonthColumn[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  let index = 1;
  while (cursor <= end) {
    cols.push({
      index,
      label: cursor.toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      }),
    });
    cursor.setMonth(cursor.getMonth() + 1);
    index += 1;
  }
  return cols;
}

export async function listMonthTargets(
  projectId: string
): Promise<MonthTarget[]> {
  const db = getDb();
  return db.select<MonthTarget[]>(
    "SELECT * FROM month_targets WHERE project_id = $1",
    [projectId]
  );
}

/** Upserts a single cell's weight_pct (pay_item_id x month_index). */
export async function setMonthTargetWeight(
  projectId: string,
  payItemId: string,
  monthIndex: number,
  weightPct: number
): Promise<void> {
  const db = getDb();
  const existing = await db.select<{ id: string }[]>(
    "SELECT id FROM month_targets WHERE pay_item_id = $1 AND month_index = $2",
    [payItemId, monthIndex]
  );
  if (existing.length > 0) {
    await db.execute("UPDATE month_targets SET weight_pct = $1 WHERE id = $2", [
      weightPct,
      existing[0].id,
    ]);
  } else {
    await db.execute(
      `INSERT INTO month_targets (id, project_id, pay_item_id, month_index, weight_pct)
       VALUES ($1, $2, $3, $4, $5)`,
      [newId(), projectId, payItemId, monthIndex, weightPct]
    );
  }
}

/** Sum of weight_pct across all months for one pay item — used for the tolerance check. */
export function sumWeightForItem(
  targets: MonthTarget[],
  payItemId: string
): number {
  return targets
    .filter((t) => t.pay_item_id === payItemId)
    .reduce((sum, t) => sum + t.weight_pct, 0);
}
