"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import EventSettings from "@/components/events/detail/event-settings";

function SettingsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSettings eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SettingsPage, "EVENTS", "canEdit"),
  "events"
);
