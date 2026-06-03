"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function McpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(McpLayout, "PLATFORM_FEATURES");
