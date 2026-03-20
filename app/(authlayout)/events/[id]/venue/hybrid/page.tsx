"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useParams } from "next/navigation";
import { EventHybridVenue } from "@/components/events/detail/event-hybrid-venue";

export default function HybridVenuePage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventHybridVenue eventId={eventId} />
    </div>
  );
}
