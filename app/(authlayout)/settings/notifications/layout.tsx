"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(NotificationsLayout, "GENERAL_SETTINGS");
