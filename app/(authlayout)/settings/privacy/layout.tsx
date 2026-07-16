"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(PrivacyLayout, "CUSTOMER_PRIVACY");
