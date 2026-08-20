import { getDb, newId } from "./client";
import type { PayItem, PayItemWithAmount } from "@/types";

export async function listPayItems(
  projectId: string
): Promise<PayItemWithAmount[]> {
  const db = getDb();
  const rows = await db.select<PayItem[]>(
    "SELECT * FROM pay_items WHERE project_id = $1 ORDER BY sort_order ASC",
    [projectId]
  );
  return rows.map((r) => ({ ...r, amount: r.quantity * r.unit_price }));
}

export async function createPayItem(
  projectId: string,
  input: Omit<PayItem, "id" | "project_id" | "sort_order">,
  sortOrder: number
): Promise<string> {
  const db = getDb();
  const id = newId();
  await db.execute(
    `INSERT INTO pay_items (id, project_id, pay_item_id, description, quantity, unit, unit_price, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      projectId,
      input.pay_item_id,
      input.description,
      input.quantity,
      input.unit,
      input.unit_price,
      sortOrder,
    ]
  );
  return id;
}

export async function updatePayItem(
  id: string,
  patch: Partial<Omit<PayItem, "id" | "project_id">>
): Promise<void> {
  const db = getDb();
  const fields = Object.keys(patch);
  if (fields.length === 0) return;
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  await db.execute(`UPDATE pay_items SET ${setClause} WHERE id = $1`, [
    id,
    ...fields.map((f) => (patch as Record<string, unknown>)[f]),
  ]);
}

export async function deletePayItem(id: string): Promise<void> {
  const db = getDb();
  await db.execute("DELETE FROM pay_items WHERE id = $1", [id]);
}
