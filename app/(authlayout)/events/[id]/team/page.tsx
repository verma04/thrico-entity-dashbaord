"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import EventTeam from "@/components/events/detail/event-team";

function TeamPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventTeam eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(TeamPage, "EVENTS", "canRead"),
  "events"
);
