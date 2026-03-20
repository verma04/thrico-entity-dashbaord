"use client";

import { useParams } from "next/navigation";
import EventAnalytics from "@/components/events/detail/event-analytics";

export default function AnalyticsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventAnalytics eventId={eventId} />
    </div>
  );
}
