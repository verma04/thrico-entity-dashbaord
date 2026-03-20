import RebacSettings from "@/components/settings/rebac/rebac-settings";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users & Persons - ReBAC",
  description: "Manage users, persons, and relationship-based access control.",
};

const page = () => {
  return <RebacSettings />;
};

export default page;
