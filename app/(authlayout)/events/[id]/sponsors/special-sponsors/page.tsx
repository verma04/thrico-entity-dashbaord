"use client";

import { useParams } from "next/navigation";
import { EventSpecialSponsorshipList } from "@/components/events/detail/event-special-sponsors";

export default function SpecialSponsorsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSpecialSponsorshipList eventId={eventId} />
    </div>
  );
}
