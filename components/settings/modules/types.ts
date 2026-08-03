export interface ModuleItem {
  id: string;
  name: string;
  icon: string | null;
  enabled: boolean;
  required?: boolean;
  showInMobileNavigation: boolean;
  showInWebNavigation: boolean;
  isPopular: boolean;
  showInMobileNavigationSortNumber?: number;
  showInWebNavigationSortNumber?: number;
  customName?: string | null;
  customIcon?: string | null;
  subtitle?: string | null;
  isPublicFacing: boolean;
  canRename: boolean;
}

export type ActiveTab = "management" | "navigation" | "webNavigation";

export interface UpdateEntityModuleResponse {
  updateEntityModule: { success: boolean };
}
