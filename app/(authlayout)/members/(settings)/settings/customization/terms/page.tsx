import React from "react";
import { TermsTabView } from "@/components/members/customization/views";

export const metadata = {
  title: "Terms & Conditions | Member Customization",
  description:
    "Configure custom Terms and Conditions rich text, mandatory agreement checkbox, and compliance settings for member onboarding.",
};

export default function MemberTermsPage() {
  return <TermsTabView />;
}
