"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function ModulesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(ModulesLayout, "PLATFORM_FEATURES");
