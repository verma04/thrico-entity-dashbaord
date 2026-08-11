"use client";

import React from "react";
import { ReferralsTab } from "@/components/members/details/referrals-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberReferralsPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <ReferralsTab userId={user.id} />
    </div>
  );
}
