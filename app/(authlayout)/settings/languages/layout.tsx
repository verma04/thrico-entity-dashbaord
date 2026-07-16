"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function LanguagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withModulePermission(LanguagesLayout, "LANGUAGES");
