"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import EventsManage from "@/components/events/manage/events-manage";

function AllEventsPage() {
  return <EventsManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(AllEventsPage, "EVENTS", "canRead"),
  "events",
);
