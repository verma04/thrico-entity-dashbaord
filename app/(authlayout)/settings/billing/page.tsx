import React from "react";
import type { Metadata } from "next";
import Billing from "@/components/settings/billing/Billing";

export const metadata: Metadata = {
  title: "Billing Details",
  description:
    "View and manage your billing information, history, and invoices.",
};

const page = () => {
  return <Billing />;
};

export default page;
