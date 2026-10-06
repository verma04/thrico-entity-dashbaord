"use client";

import React from "react";
import { MemberCustomizationProvider } from "./member-customization-context";
import { MemberCustomizationLayoutShell } from "./member-customization-layout-shell";
import { CustomFieldsTabView } from "./views/custom-fields-tab-view";

export default function MemberCustomizationSettings() {
  return (
    <MemberCustomizationProvider>
      <MemberCustomizationLayoutShell>
        <CustomFieldsTabView />
      </MemberCustomizationLayoutShell>
    </MemberCustomizationProvider>
  );
}
