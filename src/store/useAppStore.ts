import { create } from "zustand";

export type ProjectTabKey = "info" | "payItems" | "monthTargets";

interface AppState {
  activeProjectId: string | null;
  activeTab: ProjectTabKey;
  openProject: (id: string) => void;
  closeProject: () => void;
  setTab: (tab: ProjectTabKey) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeProjectId: null,
  activeTab: "info",
  openProject: (id) => set({ activeProjectId: id, activeTab: "info" }),
  closeProject: () => set({ activeProjectId: null }),
  setTab: (tab) => set({ activeTab: tab }),
}));
