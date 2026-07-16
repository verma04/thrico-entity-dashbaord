"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import EventMedia from "@/components/events/detail/event-media";

function MediaPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventMedia eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MediaPage, "EVENTS", "canRead"),
  "events"
);
