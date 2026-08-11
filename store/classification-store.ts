import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClassificationState {
  tabOrder: string[];
  setTabOrder: (tabs: string[]) => void;
}

export const useClassificationStore = create<ClassificationState>()(
  persist(
    (set) => ({
      tabOrder: [],
      setTabOrder: (tabs) => set({ tabOrder: tabs }),
    }),
    {
      name: 'classification-tab-order',
    }
  )
);
