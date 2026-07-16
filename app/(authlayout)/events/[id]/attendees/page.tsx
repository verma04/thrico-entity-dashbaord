"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import EventAttendees from "@/components/events/detail/event-attendees";

function AttendeesPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventAttendees eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(AttendeesPage, "EVENTS", "canRead"),
  "events"
);
