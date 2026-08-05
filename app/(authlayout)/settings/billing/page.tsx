import type { Metadata } from "next";
import Billing from "@/components/settings/billing/Billing";

export const metadata: Metadata = {
  title: "Billing History",
  description:
    "View and manage your billing history and invoices.",
};

const page = () => {
  return <Billing />;
};

export default page;
