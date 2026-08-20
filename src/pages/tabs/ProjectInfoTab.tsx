import { useEffect, useState } from "react";
import { getDb } from "@/db/client";
import { updateProject, getProjectContractAmount } from "@/db/projects";
import type { Project, ProjectStatus } from "@/types";

const statuses: ProjectStatus[] = ["Planning", "Ongoing", "On Hold", "Completed"];

export default function ProjectInfoTab({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [amount, setAmount] = useState(0);

  async function load() {
    const db = getDb();
    const rows = await db.select<Project[]>("SELECT * FROM projects WHERE id = $1", [projectId]);
    setProject(rows[0] ?? null);
    setAmount(await getProjectContractAmount(projectId));
  }

  useEffect(() => {
    load();
  }, [projectId]);

  async function handleChange<K extends keyof Project>(field: K, value: Project[K]) {
    if (!project) return;
    setProject({ ...project, [field]: value });
    await updateProject(projectId, { [field]: value } as Partial<Project>);
  }

  if (!project) return null;

  const field = "w-full rounded-md border px-3 py-2 text-sm bg-transparent";
  const fieldStyle = { borderColor: "var(--border)" };
  const label = "text-xs font-medium mb-1 block";
  const labelStyle = { color: "var(--text-secondary)" };

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className={label} style={labelStyle}>Title</label>
        <input
          className={field}
          style={fieldStyle}
          value={project.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div>
        <label className={label} style={labelStyle}>Location</label>
        <input
          className={field}
          style={fieldStyle}
          value={project.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>

      <div>
        <label className={label} style={labelStyle}>Contractor</label>
        <input
          className={field}
          style={fieldStyle}
          value={project.contractor}
          onChange={(e) => handleChange("contractor", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} style={labelStyle}>Start date</label>
          <input
            type="date"
            className={field}
            style={fieldStyle}
            value={project.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
          />
        </div>
        <div>
          <label className={label} style={labelStyle}>End date</label>
          <input
            type="date"
            className={field}
            style={fieldStyle}
            value={project.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={label} style={labelStyle}>Status</label>
        <select
          className={field}
          style={fieldStyle}
          value={project.status}
          onChange={(e) => handleChange("status", e.target.value as ProjectStatus)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} style={labelStyle}>Notes</label>
        <textarea
          className={field}
          style={fieldStyle}
          rows={3}
          value={project.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      <div className="rounded-md p-3 flex justify-between text-sm" style={{ background: "var(--surface-1)" }}>
        <span style={{ color: "var(--text-secondary)" }}>Contract amount (from Pay items)</span>
        <span className="font-medium">₱{amount.toLocaleString()}</span>
      </div>
    </div>
  );
}
