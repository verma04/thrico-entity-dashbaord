"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function EditUserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(EditUserLayout, "ADMIN_USERS", "canEdit");
