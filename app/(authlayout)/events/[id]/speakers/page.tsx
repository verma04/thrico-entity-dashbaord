"use client";

import { useParams } from "next/navigation";
import { EventSpeakers } from "@/components/events/detail/event-speakers";

export default function EventSpeakersPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSpeakers eventId={eventId} />
    </div>
  );
}
