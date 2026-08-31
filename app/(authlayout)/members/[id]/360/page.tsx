"use client";

import React from "react";
import { MemberCustomer360Card } from "@/components/analytics/customer-360-card";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function Member360IntelligencePage() {
  const { user, member } = useMemberDetails();
  const targetUserId = user?.id || member?.userId || member?.id;

  if (!targetUserId) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <MemberCustomer360Card userId={targetUserId} />
    </div>
  );
}
