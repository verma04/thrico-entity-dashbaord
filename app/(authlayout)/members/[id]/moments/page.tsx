"use client";

import React from "react";
import { MomentsTab } from "@/components/members/details/moments-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberMomentsPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <MomentsTab userId={user.id} />
    </div>
  );
}
