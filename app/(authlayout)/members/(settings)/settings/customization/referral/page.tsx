import React from "react";
import { ReferralTabView } from "@/components/members/customization/views";

export const metadata = {
  title: "Referral & Invites | Member Customization",
  description:
    "Configure member referral loops, invite-only onboarding, and referral code helper prompts.",
};

export default function ReferralPage() {
  return <ReferralTabView />;
}
