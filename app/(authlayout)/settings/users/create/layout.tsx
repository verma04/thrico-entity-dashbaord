"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function CreateUserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(CreateUserLayout, "ADMIN_USERS", "canCreate");
