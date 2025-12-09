// store/layoutStore.ts
import { create } from "zustand";

type LayoutStore = {
  layoutData: string;
  setLayoutData: (data: string) => void;
};

export const useLayoutStore = create<LayoutStore>((set) => ({
  layoutData: "",
  setLayoutData: (data) => set({ layoutData: data }),
}));
