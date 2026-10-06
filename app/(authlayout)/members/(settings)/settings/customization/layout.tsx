"use client";

import React, { ReactNode } from "react";
import { MemberCustomizationProvider } from "@/components/members/customization/member-customization-context";
import { MemberCustomizationLayoutShell } from "@/components/members/customization/member-customization-layout-shell";

export default function MemberCustomizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MemberCustomizationProvider>
      <MemberCustomizationLayoutShell>
        {children}
      </MemberCustomizationLayoutShell>
    </MemberCustomizationProvider>
  );
}
