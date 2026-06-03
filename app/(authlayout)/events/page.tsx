"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import * as React from "react";
import EventsAnalytics from "@/components/events/dashboard/events-analytics";

function EventsPage() {
  return <EventsAnalytics />;
}

export default withSubscriptionCheck(
  withModulePermission(EventsPage, "EVENTS", "canRead"),
  "events"
);
