"use client";

import { useParams } from "next/navigation";
import { EventVirtualVenue } from "@/components/events/detail/event-virtual-venue";

export default function VirtualVenuePage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventVirtualVenue eventId={eventId} />
    </div>
  );
}
