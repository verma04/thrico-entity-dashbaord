"use client";

import React from "react";
import { ListingsTab } from "@/components/members/details/listings-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberListingsPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <ListingsTab userId={user.id} />
    </div>
  );
}
