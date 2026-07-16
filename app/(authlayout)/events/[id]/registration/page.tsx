"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useParams } from "next/navigation";
import EventRegistration from "@/components/events/detail/event-registration";

function RegistrationPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventRegistration eventId={eventId} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(RegistrationPage, "EVENTS", "canRead"),
  "events"
);
