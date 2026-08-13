import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MembersLayoutState {
  tabOrder: string[];
  setTabOrder: (tabs: string[]) => void;
}

export const useMembersLayoutStore = create<MembersLayoutState>()(
  persist(
    (set) => ({
      tabOrder: [],
      setTabOrder: (tabs) => set({ tabOrder: tabs }),
    }),
    {
      name: 'members-tab-order',
    }
  )
);
