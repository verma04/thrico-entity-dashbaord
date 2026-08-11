"use client";

import React from "react";
import { ForumsTab } from "@/components/members/details/forums-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberForumsPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <ForumsTab userId={user.id} />
    </div>
  );
}
