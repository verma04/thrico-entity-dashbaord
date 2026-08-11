"use client";

import React from "react";
import { CommunitiesTab } from "@/components/members/details/communities-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberCommunitiesPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <CommunitiesTab userId={user.id} />
    </div>
  );
}
