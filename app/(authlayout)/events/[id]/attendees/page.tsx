"use client";

import { useParams } from "next/navigation";
import EventAttendees from "@/components/events/detail/event-attendees";

export default function AttendeesPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventAttendees eventId={eventId} />
    </div>
  );
}
