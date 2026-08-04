import type { Metadata } from "next";
import Billing from "@/components/settings/billing/Billing";
import { GeneralSettingsLayout } from "@/components/settings/general/general-settings-layout";

export const metadata: Metadata = {
  title: "Billing Details",
  description:
    "View and manage your billing information, history, and invoices.",
};

const page = () => {
  return <Billing />;
};

export default page;
