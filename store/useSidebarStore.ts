import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

const ALL_SECTIONS = [
  "home",
  "community",
  "moderation",
  "gamification",
  "modules",
  "settings",
] as const;

type SectionKey = (typeof ALL_SECTIONS)[number] | string;

/** Default: all sections open */
const DEFAULT_COLLAPSED: SectionKey[] = [];

interface SidebarSectionState {
  collapsedSections: SectionKey[];
  isSectionOpen: (key: SectionKey) => boolean;
  toggleSection: (key: SectionKey) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

export const useSidebarSectionStore = create<SidebarSectionState>()(
  devtools(
    persist(
      (set, get) => ({
        collapsedSections: DEFAULT_COLLAPSED,

        isSectionOpen: (key) => !get().collapsedSections.includes(key),

        toggleSection: (key) => {
          set((state) => {
            const collapsed = state.collapsedSections;
            return {
              collapsedSections: collapsed.includes(key)
                ? collapsed.filter((k) => k !== key) // remove → open it
                : [...collapsed, key], // add → close it
            };
          });
        },

        expandAll: () => set({ collapsedSections: [] }),
        collapseAll: () => set({ collapsedSections: [...ALL_SECTIONS] }),
      }),
      {
        name: "sidebar-sections-v4", // bumped to v4 → all sections open by default
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ collapsedSections: state.collapsedSections }),
        version: 1,
        migrate: (persisted: any) => {
          // If the stored data doesn't look right, reset to default
          if (!Array.isArray(persisted?.collapsedSections)) {
            return { collapsedSections: DEFAULT_COLLAPSED };
          }
          return persisted;
        },
      },
    ),
    { name: "SidebarSections" },
  ),
);
