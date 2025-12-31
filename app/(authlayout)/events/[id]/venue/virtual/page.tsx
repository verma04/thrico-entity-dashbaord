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

function VirtualMeetingDetails() {
  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50">
      <CardHeader className="bg-muted/30">
        <CardTitle>Virtual Meeting Details</CardTitle>
        <CardDescription>
          Configure virtual meeting platform and access details
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input id="platform" defaultValue="Zoom" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meetingId">Meeting ID</Label>
            <Input id="meetingId" defaultValue="123 456 7890" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingLink">Meeting Link</Label>
          <Input id="meetingLink" defaultValue="https://zoom.us/j/1234567890" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingPassword">Password</Label>
          <Input
            id="meetingPassword"
            type="password"
            defaultValue="techconf2023"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingNotes">Additional Notes</Label>
          <Textarea
            id="meetingNotes"
            rows={4}
            placeholder="Any additional information about the virtual meeting..."
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default VirtualMeetingDetails;
