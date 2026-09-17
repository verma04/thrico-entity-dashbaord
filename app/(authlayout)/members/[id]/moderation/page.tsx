"use client";

import React from "react";
import { ModerationTab } from "@/components/members/details/moderation-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberModerationPage() {
  const { user, member } = useMemberDetails();
  const targetUserId = user?.id || member?.userId || member?.id;

  if (!targetUserId) return null;

  return (
    <div className="animate-in fade-in-50 duration-500">
      <ModerationTab userId={targetUserId} member={member} />
    </div>
  );
}
