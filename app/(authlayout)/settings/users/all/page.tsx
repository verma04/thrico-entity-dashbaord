import UsersTab from "@/components/settings/rebac/users-tab";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members - Settings",
  description: "Manage team members.",
};

const page = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage team members and their status.</p>
      </div>
      <UsersTab />
    </div>
  );
};

export default page;
