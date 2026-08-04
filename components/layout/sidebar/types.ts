import React from "react";

export interface MenuItem {
  key: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  isLogout?: boolean;
  badge?: string;
  isLocked?: boolean;
}
