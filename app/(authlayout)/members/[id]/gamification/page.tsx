"use client";

import React from "react";
import { GamificationTab } from "@/components/members/details/gamification-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberGamificationPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <GamificationTab userId={user.id} />
    </div>
  );
}
