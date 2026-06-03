"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function AllUsersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(AllUsersLayout, "ADMIN_USERS");
