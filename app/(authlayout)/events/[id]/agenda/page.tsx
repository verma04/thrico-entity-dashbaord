"use client";

import { useParams } from "next/navigation";
import { EventAgendaList } from "@/components/events/detail/event-agenda";

export default function AgendaPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventAgendaList eventId={eventId} />
    </div>
  );
}
