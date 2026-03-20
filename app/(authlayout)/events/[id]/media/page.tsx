"use client";

import { useParams } from "next/navigation";
import EventMedia from "@/components/events/detail/event-media";

export default function MediaPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventMedia eventId={eventId} />
    </div>
  );
}
