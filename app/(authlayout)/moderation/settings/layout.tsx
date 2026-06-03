"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(SettingsLayout, "AI_MODERATION");
