"use client";

import React from "react";
import { ProfileTab } from "@/components/members/details/profile-tab";
import { useMemberDetails } from "@/components/members/details/member-context";
import { Customer360AiSummaryCard } from "@/components/analytics/customer-360-ai-summary-card";

export default function MemberProfilePage() {
  const { member, user } = useMemberDetails();
  const targetUserId = user?.id || member?.userId || member?.id;

  if (!member) return null;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {targetUserId && <Customer360AiSummaryCard userId={targetUserId} />}
      <ProfileTab member={member} />
    </div>
  );
}

