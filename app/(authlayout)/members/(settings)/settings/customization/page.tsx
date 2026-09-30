import React from "react";
import MemberCustomizationSettings from "@/components/members/customization/member-customization-settings";

export const metadata = {
  title: "Member Customization & Onboarding | Entity Dashboard",
  description:
    "Configure member login methods, referral rules, and custom registration inputs.",
};

export default function MemberCustomizationPage() {
  return <MemberCustomizationSettings />;
}
