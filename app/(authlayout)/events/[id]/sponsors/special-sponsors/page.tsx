"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import { EventSpecialSponsorshipList } from "@/components/events/detail/event-special-sponsors";

function SpecialSponsorsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSpecialSponsorshipList eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SpecialSponsorsPage, "EVENTS", "canRead"),
  "events"
);
