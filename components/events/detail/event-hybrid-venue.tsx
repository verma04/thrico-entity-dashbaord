"use client";

import { EventVenuesList } from "./event-venues";
import { EventVirtualVenue } from "./event-virtual-venue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Video, Network } from "lucide-react";

export function EventHybridVenue({ eventId }: { eventId: string }) {
  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Network className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Hybrid Event Management</h3>
          <p className="text-sm text-muted-foreground max-w-2xl">
            This event has both physical and virtual components. Manage your
            in-person locations/rooms and your online meeting links below.
          </p>
        </div>
      </div>

      <Tabs defaultValue="physical" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="physical" className="gap-2">
            <MapPin className="h-4 w-4" />
            Physical Rooms
          </TabsTrigger>
          <TabsTrigger value="virtual" className="gap-2">
            <Video className="h-4 w-4" />
            Virtual Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="space-y-4">
          <EventVenuesList eventId={eventId} />
        </TabsContent>

        <TabsContent value="virtual" className="space-y-4">
          <EventVirtualVenue eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
