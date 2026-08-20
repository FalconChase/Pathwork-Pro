import { useAppStore } from "@/store/useAppStore";
import DashboardPage from "@/pages/DashboardPage";
import ProjectPage from "@/pages/ProjectPage";

export default function App() {
  const activeProjectId = useAppStore((s) => s.activeProjectId);

  return (
    <div className="min-h-screen">
      {activeProjectId ? (
        <ProjectPage projectId={activeProjectId} />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}
