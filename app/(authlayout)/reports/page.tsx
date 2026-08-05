"use client";

import React from "react";
import Reports from "../../../components/reports/Reports";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

export default function ReportsPage() {
  return (
    <MenuItemsLayout hideTabs={true}>
      <Reports breadcrumbs={[{ label: "Content" }, { label: "Reports" }]} />
    </MenuItemsLayout>
  );
}
