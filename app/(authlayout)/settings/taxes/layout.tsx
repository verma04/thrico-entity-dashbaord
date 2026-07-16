"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function TaxesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(TaxesLayout, "TAXES_AND_DUTIES");
