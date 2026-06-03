"use client";
import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const GeneralSettingsAccess = withModulePermission(Wrapper, "GENERAL_SETTINGS");
