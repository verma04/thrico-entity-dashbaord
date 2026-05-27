"use client";

import { useParams } from "next/navigation";
import EventTeam from "@/components/events/detail/event-team";

export default function TeamPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventTeam eventId={eventId} />
    </div>
  );
}
