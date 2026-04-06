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
      },
    ),
  ),
);

export { useTokenStore };

export interface Permission {
  auditLogs: boolean;
  website: boolean;
  settings: boolean;
  moderation: boolean;
  reports: boolean;
  subscription: boolean;
  platformFeatures: boolean;
  appearance: boolean;
  domain: boolean;
  permissions: boolean;
  adminUsers: boolean;
}

export interface ModulePermission {
  module: string;
  canRead: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
}

export interface Role {
  name: string;
  description: string;
  isSystem: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: boolean;
  isSuperAdmin: boolean;
  memberStatus: string | null;
  permissions: Permission;
  modulePermissions: ModulePermission[];
  role: Role;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: "user-storage",
      },
    ),
  ),
);

interface WorkspaceState {
  isSwitching: boolean;
  targetName: string;
  setIsSwitching: (isSwitching: boolean, targetName?: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  isSwitching: false,
  targetName: "",
  setIsSwitching: (isSwitching, targetName = "") => set({ isSwitching, targetName }),
}));
