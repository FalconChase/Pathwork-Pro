import { useEffect, useState } from "react";
import { listProjects, createProject, getProjectContractAmount } from "@/db/projects";
import { useAppStore } from "@/store/useAppStore";
import type { Project } from "@/types";

const statusStyle: Record<string, string> = {
  Ongoing: "bg-[var(--bg-accent)] text-[var(--text-accent)]",
  Planning: "bg-[var(--bg-warning)] text-[var(--text-warning)]",
  "On Hold": "bg-[var(--bg-warning)] text-[var(--text-warning)]",
  Completed: "bg-[var(--bg-success)] text-[var(--text-success)]",
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const openProject = useAppStore((s) => s.openProject);

  async function refresh() {
    const list = await listProjects();
    setProjects(list);
    const entries = await Promise.all(
      list.map(async (p) => [p.id, await getProjectContractAmount(p.id)] as const)
    );
    setAmounts(Object.fromEntries(entries));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleNewProject() {
    const title = prompt("Project title?");
    if (!title) return;
    await createProject({
      title,
      location: "",
      contractor: "",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      status: "Planning",
      notes: "",
    });
    refresh();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Projects</h1>
        <button
          onClick={handleNewProject}
          className="border rounded-md px-3 py-1.5 text-sm"
          style={{ borderColor: "var(--border-accent)", color: "var(--text-accent)" }}
        >
          + New project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => openProject(p.id)}
            className="cursor-pointer rounded-xl border p-4"
            style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium text-sm">{p.title}</p>
              <span className={`text-xs px-2.5 py-0.5 rounded whitespace-nowrap ${statusStyle[p.status]}`}>
                {p.status}
              </span>
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
              {p.location || "No location set"}
            </p>
            <div className="border-t pt-2 flex justify-between text-xs" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--text-secondary)" }}>
                {p.start_date} – {p.end_date}
              </span>
              <span className="font-medium">
                ₱{(amounts[p.id] ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-sm text-center mt-16" style={{ color: "var(--text-muted)" }}>
          No projects yet. Create one to get started.
        </p>
      )}
    </div>
  );
}
