"use client";

import { useParams } from "next/navigation";
import EventSettings from "@/components/events/detail/event-settings";

export default function SettingsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventSettings eventId={eventId} />
    </div>
  );
}
