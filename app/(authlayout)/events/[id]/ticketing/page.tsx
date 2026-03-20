"use client";

import { useParams } from "next/navigation";
import EventTicketing from "@/components/events/detail/event-ticketing";

export default function TicketingPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventTicketing eventId={eventId} />
    </div>
  );
}
