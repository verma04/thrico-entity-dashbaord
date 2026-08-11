"use client";

import React from "react";
import { JobsTab } from "@/components/members/details/jobs-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberJobsPage() {
  const { user } = useMemberDetails();
  
  if (!user) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <JobsTab userId={user.id} />
    </div>
  );
}
