"use client";

import React from "react";
import { OffersTab } from "@/components/members/details/offers-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberOffersPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <OffersTab userId={user.id} />
    </div>
  );
}
