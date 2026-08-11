"use client";

import React from "react";
import { PollsTab } from "@/components/members/details/polls-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberPollsPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <PollsTab userId={user.id} />
    </div>
  );
}
