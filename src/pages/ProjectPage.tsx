import { useAppStore, ProjectTabKey } from "@/store/useAppStore";
import ProjectInfoTab from "@/pages/tabs/ProjectInfoTab";
import PayItemsTab from "@/pages/tabs/PayItemsTab";
import MonthTargetsTab from "@/pages/tabs/MonthTargetsTab";

const tabs: { key: ProjectTabKey; label: string }[] = [
  { key: "info", label: "Project" },
  { key: "payItems", label: "Pay items" },
  { key: "monthTargets", label: "Month targets" },
];

export default function ProjectPage({ projectId }: { projectId: string }) {
  const activeTab = useAppStore((s) => s.activeTab);
  const setTab = useAppStore((s) => s.setTab);
  const closeProject = useAppStore((s) => s.closeProject);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button
        onClick={closeProject}
        className="text-sm mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        ← All projects
      </button>

      <div className="flex gap-1 mb-6 border-b pb-2" style={{ borderColor: "var(--border)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="text-sm px-3 py-1.5 rounded-md border"
            style={
              activeTab === t.key
                ? { borderColor: "var(--border-accent)", color: "var(--text-accent)", background: "var(--fill-secondary)" }
                : { borderColor: "transparent" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "info" && <ProjectInfoTab projectId={projectId} />}
      {activeTab === "payItems" && <PayItemsTab projectId={projectId} />}
      {activeTab === "monthTargets" && <MonthTargetsTab projectId={projectId} />}
    </div>
  );
}
