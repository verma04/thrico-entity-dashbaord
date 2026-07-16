"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import { EventSpeakers } from "@/components/events/detail/event-speakers";

function EventSpeakersPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSpeakers eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EventSpeakersPage, "EVENTS", "canRead"),
  "events"
);
