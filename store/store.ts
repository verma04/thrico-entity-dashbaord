import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  storeToken: (token: string | null) => void;
  removeToken: () => void;
  logout: () => void;
}

const useTokenStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        token: null,
        storeToken: (token) => {
          set(() => ({
            isAuthenticated: !!token,
            token,
          }));
        },
        removeToken: () => {
          set(() => ({
            isAuthenticated: false,
            token: null,
          }));
        },
        logout: () => {
          set(() => ({
            isAuthenticated: false,
            token: null,
          }));
        },
      }),
      {
        name: "token",
      }
    )
  )
);

export { useTokenStore };
