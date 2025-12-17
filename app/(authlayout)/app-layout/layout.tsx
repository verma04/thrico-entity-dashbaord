"use client";
import * as React from "react";

import PagesItemsLayout from "@/components/settings/website-admin/pages-items-layout";
import { PlanDrawer } from "@/components/layout/plan-drawer";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PlanDrawer />
      <PagesItemsLayout>{children}</PagesItemsLayout>
    </>
  );
}

export default RootLayout;
