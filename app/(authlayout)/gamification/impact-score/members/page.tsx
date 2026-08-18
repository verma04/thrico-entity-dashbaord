"use client";

import React, { Suspense } from "react";
import { ImpactMembersManager } from "@/components/impact/members/impact-members-manager";

export default function ImpactMembersPage() {
  return (
    <Suspense fallback={null}>
      <ImpactMembersManager />
    </Suspense>
  );
}
