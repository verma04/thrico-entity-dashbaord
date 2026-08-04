import RolesTab from "@/components/settings/rebac/roles-tab";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles & Permissions - Settings",
  description: "Manage roles and permissions.",
};

const page = () => {
  return <RolesTab />;
};

export default page;
