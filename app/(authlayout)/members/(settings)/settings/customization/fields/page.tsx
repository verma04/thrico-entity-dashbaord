import React from "react";
import { CustomFieldsTabView } from "@/components/members/customization/views";

export const metadata = {
  title: "Registration Inputs | Member Customization",
  description:
    "Configure custom member registration fields, validation regex, and CSV rosters.",
};

export default function CustomFieldsPage() {
  return <CustomFieldsTabView />;
}
