import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const DEFAULT_VISIBLE_COLUMNS: Record<string, boolean> = {
  serial: true,
  member: true,
  contact: true,
  location: true,
  industries: true,
  membershipTier: true,
  wallet: true,
  points: true,
  rank: true,
  badges: true,
  impact: true,
  status: true,
  verification: true,
  joined: true,
  source: true,
  referrer: true,
  lastSession: true,
  actions: true,
};

export interface MembersColumnsState {
  visibleColumns: Record<string, boolean>;
  toggleColumn: (key: string) => void;
  setColumnVisibility: (key: string, visible: boolean) => void;
  setAllColumns: (columns: Record<string, boolean>) => void;
  showAllColumns: () => void;
  resetColumns: () => void;
}

export const useMembersColumnsStore = create<MembersColumnsState>()(
  persist(
    (set) => ({
      visibleColumns: DEFAULT_VISIBLE_COLUMNS,

      toggleColumn: (key: string) =>
        set((state) => ({
          visibleColumns: {
            ...state.visibleColumns,
            [key]: !state.visibleColumns[key],
          },
        })),

      setColumnVisibility: (key: string, visible: boolean) =>
        set((state) => ({
          visibleColumns: {
            ...state.visibleColumns,
            [key]: visible,
          },
        })),

      setAllColumns: (columns: Record<string, boolean>) =>
        set({ visibleColumns: columns }),

      showAllColumns: () =>
        set((state) => {
          const allVisible: Record<string, boolean> = {};
          Object.keys(state.visibleColumns).forEach((k) => {
            allVisible[k] = true;
          });
          return { visibleColumns: allVisible };
        }),

      resetColumns: () =>
        set({
          visibleColumns: DEFAULT_VISIBLE_COLUMNS,
        }),
    }),
    {
      name: "thrico-members-visible-columns",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: unknown, currentState: MembersColumnsState) => {
        const persisted = persistedState as Partial<MembersColumnsState> | undefined;
        return {
          ...currentState,
          ...persisted,
          visibleColumns: {
            ...currentState.visibleColumns,
            ...(persisted?.visibleColumns || {}),
          },
        };
      },
    }
  )
);
