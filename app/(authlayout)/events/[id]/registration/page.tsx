"use client";

import { useParams } from "next/navigation";
import EventRegistration from "@/components/events/detail/event-registration";

export default function RegistrationPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventRegistration eventId={eventId} />
    </div>
  );
}
