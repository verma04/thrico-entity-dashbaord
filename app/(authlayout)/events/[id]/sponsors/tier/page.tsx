"use client";

import { useParams } from "next/navigation";
import { EventSponsorshipList } from "@/components/events/detail/event-sponsors";

export default function EventSponsorshipTierPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSponsorshipList eventId={eventId} />
    </div>
  );
}
