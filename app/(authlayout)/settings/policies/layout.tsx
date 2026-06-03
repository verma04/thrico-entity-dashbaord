"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(PoliciesLayout, "POLICIES");
