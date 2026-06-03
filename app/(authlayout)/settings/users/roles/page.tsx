import RolesTab from "@/components/settings/rebac/roles-tab";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles & Permissions - Settings",
  description: "Manage roles and permissions.",
};

const page = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage workspace roles and their access levels.</p>
      </div>
      <RolesTab />
    </div>
  );
};

export default page;
