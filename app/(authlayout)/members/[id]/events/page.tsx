"use client";

import { EventsTab } from "@/components/members/details/events-tab";
import { useMemberDetails } from "@/components/members/details/member-context";

export default function MemberEventsPage() {
  const { user } = useMemberDetails();

  if (!user) return null;

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden min-h-[500px] p-6 shadow-sm">
      <EventsTab userId={user.id} />
    </div>
  );
}
