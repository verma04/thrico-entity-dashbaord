"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import { EventVirtualVenue } from "@/components/events/detail/event-virtual-venue";

function VirtualVenuePage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventVirtualVenue eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(VirtualVenuePage, "EVENTS", "canRead"),
  "events"
);
