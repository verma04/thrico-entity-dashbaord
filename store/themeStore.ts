import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ButtonTheme {
  colorPrimary: string;
  colorText: string;
  colorBorder: string;
  borderRadius: number;
  defaultBg: string;
  defaultColor: string;
  defaultBorderColor: string;
  fontSize: number;
}

import type {
  NavigationTheme,
  SidebarTheme,
  BottomSheetTheme,
} from "./ts-types";

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  borderRadius: string;
  borderWidth: string;
  borderStyle: string;
  borderColor: string;
  inputBackground: string;
  inputBorderColor: string;
  fontSize: string;
  fontWeight: string;
  boxShadow: string;
  hoverEffect: string;
  Button: ButtonTheme;
  Navigation?: NavigationTheme;
  Sidebar?: SidebarTheme;
  BottomSheet?: BottomSheetTheme;
  setTheme: (theme: Partial<Omit<Theme, "setTheme">>) => void;
}

export const useThemeStore = create<Theme>()(
  persist(
    (set) => ({
      primaryColor: "#1890ff",
      secondaryColor: "#13c2c2",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      buttonColor: "#1890ff",
      borderRadius: "4",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#d9d9d9",
      inputBackground: "#ffffff",
      inputBorderColor: "#d9d9d9",
      fontSize: "14",
      fontWeight: "400",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      hoverEffect: "opacity: 0.85",
      Button: {
        colorPrimary: "#667eea",
        colorText: "#ffffff",
        colorBorder: "#667eea",
        borderRadius: 8,
        defaultBg: "#f0f0f0",
        defaultColor: "#000000",
        defaultBorderColor: "#d9d9d9",
        fontSize: 16,
      },
      Navigation: {
        tabBg: "#ffffff",
        tabActiveColor: "#3b82f6",
        tabActiveBg: "rgba(59, 130, 246, 0.1)",
        tabInactiveColor: "#64748b",
        tabBorderColor: "#e2e8f0",
        tabStyle: "pill",
        tabIndicatorColor: "#3b82f6",
        tabLayoutVariant: "pills",
      },
      Sidebar: {
        sidebarBg: "#ffffff",
        sidebarTextColor: "#334155",
        sidebarActiveColor: "#3b82f6",
        sidebarActiveBg: "#eff6ff",
        sidebarBorderColor: "#e2e8f0",
        sidebarHeaderBg: "#f8fafc",
      },
      BottomSheet: {
        sheetBg: "#f8fafc",
        sheetHandleColor: "#cbd5e1",
        sheetBorderRadius: 28,
        sheetHeaderBg: "#ffffff",
        sheetHeaderTextColor: "#0f172a",
        sheetBorderColor: "#f1f5f9",
      },
      setTheme: (newTheme) => set((state) => ({ ...state, ...newTheme })),
    }),
    {
      name: "theme-storage", // name in localStorage
      skipHydration: true, // Optional: skip hydration on server side if using SSR
    }
  )
);
