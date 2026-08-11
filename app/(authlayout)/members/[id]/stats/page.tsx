"use client";

import React from "react";
import { StatsTab } from "@/components/members/details/stats-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberStatsPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <StatsTab userId={user.id} />
    </div>
  );
}
