"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import { EventAgendaList } from "@/components/events/detail/event-agenda";

function AgendaPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventAgendaList eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(AgendaPage, "EVENTS", "canRead"),
  "events"
);
