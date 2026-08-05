import type { Metadata } from "next";
import BillingDetails from "@/components/settings/billing/billing-details";

export const metadata: Metadata = {
  title: "Billing Details",
  description: "View and manage your billing details and tax information.",
};

const page = () => {
  return <BillingDetails />;
};

export default page;
