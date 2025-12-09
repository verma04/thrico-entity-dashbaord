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
      setTheme: (newTheme) => set((state) => ({ ...state, ...newTheme })),
    }),
    {
      name: "theme-storage", // name in localStorage
      skipHydration: true, // Optional: skip hydration on server side if using SSR
    }
  )
);
