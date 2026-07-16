"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import EventAnalytics from "@/components/events/detail/event-analytics";

function AnalyticsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventAnalytics eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(AnalyticsPage, "EVENTS", "canRead"),
  "events"
);
