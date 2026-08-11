"use client";

import React from "react";
import { FeedTab } from "@/components/members/details/feed-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberFeedPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <FeedTab userId={user.id} />
    </div>
  );
}
