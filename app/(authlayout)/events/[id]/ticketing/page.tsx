"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import EventTicketing from "@/components/events/detail/event-ticketing";

function TicketingPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventTicketing eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(TicketingPage, "EVENTS", "canRead"),
  "events"
);
