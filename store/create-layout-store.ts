import { create } from "zustand";

export interface LayoutStore {
  tabOrder: string[];
  setTabOrder: (tabs: string[]) => void;
}

export const createLayoutStore = () =>
  create<LayoutStore>((set) => ({
    tabOrder: [],
    setTabOrder: (tabs) => set({ tabOrder: tabs }),
  }));
