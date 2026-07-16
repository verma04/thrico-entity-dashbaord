"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import { EventSponsorshipList } from "@/components/events/detail/event-sponsors";

function EventSponsorshipTierPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSponsorshipList eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EventSponsorshipTierPage, "EVENTS", "canRead"),
  "events"
);
