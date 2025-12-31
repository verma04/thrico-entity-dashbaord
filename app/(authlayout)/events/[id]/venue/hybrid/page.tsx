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

function HybridVenuePage() {
  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50">
      <CardHeader className="bg-muted/30">
        <CardTitle>Hybrid Event Mapping</CardTitle>
        <CardDescription>
          Configure both physical and virtual components for your hybrid event
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Physical Component</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="physicalVenue">Venue Name</Label>
              <Input
                id="physicalVenue"
                defaultValue="San Francisco Convention Center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalCapacity">Physical Capacity</Label>
              <Input id="physicalCapacity" type="number" defaultValue="500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Virtual Component</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="virtualPlatform">Platform</Label>
              <Input id="virtualPlatform" defaultValue="Zoom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="virtualCapacity">Virtual Capacity</Label>
              <Input id="virtualCapacity" type="number" defaultValue="1000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="virtualLink">Meeting Link</Label>
            <Input
              id="virtualLink"
              defaultValue="https://zoom.us/j/1234567890"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hybridNotes">Hybrid Event Notes</Label>
          <Textarea
            id="hybridNotes"
            rows={4}
            placeholder="Any special instructions for hybrid attendees..."
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default HybridVenuePage;
