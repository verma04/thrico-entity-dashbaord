"use client";

import React from "react";
import { ProfileTab } from "@/components/members/details/profile-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberProfilePage() {
  const { member } = useMemberDetails();
  
  if (!member) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <ProfileTab member={member} />
    </div>
  );
}
