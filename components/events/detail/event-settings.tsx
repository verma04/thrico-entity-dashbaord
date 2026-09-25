"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, Sparkles, Layout, Settings } from "lucide-react";
import {
  useEventSettings,
  useUpsertEventSettings,
  useDeleteEvent,
  useEventById,
} from "@/graphql/actions/events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ReusableDangerZone } from "@/components/shared/reusable-danger-zone";
import { Users, Calendar, Ticket, Mic } from "lucide-react";

export default function EventSettings({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { data, loading } = useEventSettings(eventId);
  const { data: eventData } = useEventById(eventId);
  const event = eventData?.getEventById;
  const settings = data?.getEventSettings;

  const [layout, setLayout] = useState(settings?.layout || "layout-1");

  const [upsertSettings, { loading: saving }] = useUpsertEventSettings({
    onCompleted: () => {
      toast.success("Event settings saved successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteEvent, { loading: deleting }] = useDeleteEvent({
    onCompleted: () => {
      toast.success("Event deleted successfully");
      router.push("/events/all");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSave = () => {
    upsertSettings({
      variables: {
        input: {
          eventId,
          layout,
        },
      },
    });
  };

  const handleDelete = () => {
    deleteEvent({ variables: { eventId } });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Top Header Strip ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Event Display &amp; Configuration
            </h2>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              Preferences
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure attendee-facing presentation layouts and manage destructive operations.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="h-8 text-xs font-semibold gap-1.5 rounded-lg shadow-2xs bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving…" : "Save Display Settings"}
        </Button>
      </div>

      {/* ── Display Settings Card ────────────────────────────────────────── */}
      <Card className="border border-border/60 shadow-2xs rounded-xl overflow-hidden bg-card">
        <CardHeader className="bg-muted/30 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Layout className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Public Event Page Layout
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Configure how your event schedule and speaker cards appear on public member portals
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="max-w-md space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Layout Style
            </Label>
            <Select value={layout} onValueChange={setLayout}>
              <SelectTrigger className="h-8 text-xs rounded-lg border-border/60 bg-background shadow-2xs">
                <SelectValue placeholder="Select a layout" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="layout-1">
                  Modern Hero Focus (Layout 1)
                </SelectItem>
                <SelectItem value="layout-2">
                  Clean Agenda List (Layout 2)
                </SelectItem>
                <SelectItem value="layout-3">
                  Media &amp; Grid Focus (Layout 3)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Controls visual positioning of schedule tracks, speakers roster, and ticket checkout cards.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Reusable Danger Zone Section ─────────────────────────────────── */}
      <div className="pt-2">
        <ReusableDangerZone
          entityName="Event"
          entityTitle={event?.title || `Event #${eventId}`}
          entityId={eventId}
          onDelete={handleDelete}
          loading={deleting}
          holdTime={2000}
          requireTypeMatch={true}
          warningDescription="Deleting this event will immediately cancel all attendee tickets, remove all scheduled speaker sessions, wipe sponsor linkages, and delete check-in telemetry."
          impactMetrics={[
            {
              label: "Registered Attendees",
              value: event?.attendeeCount || 0,
              icon: Users,
              description: "Tickets revoked immediately",
            },
            {
              label: "Speakers Scheduled",
              value: event?.speakers?.length || 0,
              icon: Mic,
              description: "Agenda slots erased",
            },
            {
              label: "Schedule Status",
              value: event?.startDate ? "Scheduled" : "Draft",
              icon: Calendar,
              description: "Calendar slots cleared",
            },
          ]}
        />
      </div>
    </div>
  );
}
