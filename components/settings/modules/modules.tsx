"use client";

import React from "react";
import { ModulesProvider } from "./modules-context";
import { ModulesLayoutShell } from "./modules-layout-shell";
import RegistryTab from "./registry-tab";

export default function ModuleManagement() {
  return (
    <ModulesProvider>
      <ModulesLayoutShell>
        <RegistryTab />
      </ModulesLayoutShell>
    </ModulesProvider>
  );
}
