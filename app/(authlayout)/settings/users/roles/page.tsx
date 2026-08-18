import React, { Suspense } from "react";
import RolesTab from "@/components/settings/rebac/roles-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles & Permissions - Settings",
  description: "Manage roles and permissions.",
};

const page = () => {
  return (
    <Suspense fallback={null}>
      <RolesTab />
    </Suspense>
  );
};

export default page;
