"use client";
import * as React from "react";

import PagesItemsLayout from "@/components/settings/website-admin/pages-items-layout";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PagesItemsLayout>{children}</PagesItemsLayout>
    </>
  );
}

export default RootLayout;
