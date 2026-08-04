// import UsersTab from "@/components/settings/rebac/users-tab";

import UsersTab from "@/components/settings/rebac/users-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members - Settings",
  description: "Manage team members.",
};
const page = () => {
  return <UsersTab />;
};

export default page;
