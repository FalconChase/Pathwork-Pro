import { getDb, newId } from "./client";
import type { Project, ProjectStatus } from "@/types";

export async function listProjects(): Promise<Project[]> {
  const db = getDb();
  return db.select<Project[]>(
    "SELECT * FROM projects ORDER BY updated_at DESC"
  );
}

export async function getProjectContractAmount(
  projectId: string
): Promise<number> {
  const db = getDb();
  const rows = await db.select<{ total: number | null }[]>(
    "SELECT SUM(quantity * unit_price) as total FROM pay_items WHERE project_id = $1",
    [projectId]
  );
  return rows[0]?.total ?? 0;
}

export async function createProject(input: {
  title: string;
  location: string;
  contractor: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus;
  notes: string;
}): Promise<string> {
  const db = getDb();
  const id = newId();
  await db.execute(
    `INSERT INTO projects (id, title, location, contractor, start_date, end_date, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      input.title,
      input.location,
      input.contractor,
      input.start_date,
      input.end_date,
      input.status,
      input.notes,
    ]
  );
  await db.execute(
    `INSERT INTO project_settings (project_id, weight_tolerance_pct) VALUES ($1, 2)`,
    [id]
  );
  return id;
}

export async function updateProject(
  id: string,
  patch: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
): Promise<void> {
  const db = getDb();
  const fields = Object.keys(patch);
  if (fields.length === 0) return;
  const setClause = fields
    .map((f, i) => `${f} = $${i + 2}`)
    .concat("updated_at = datetime('now')")
    .join(", ");
  await db.execute(`UPDATE projects SET ${setClause} WHERE id = $1`, [
    id,
    ...fields.map((f) => (patch as Record<string, unknown>)[f]),
  ]);
}

export async function deleteProject(id: string): Promise<void> {
  const db = getDb();
  await db.execute("DELETE FROM projects WHERE id = $1", [id]);
}
