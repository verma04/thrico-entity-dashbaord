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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle, Save } from "lucide-react";
import {
  useEventSettings,
  useUpsertEventSettings,
  useDeleteEvent,
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

export default function EventSettings({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { data, loading } = useEventSettings(eventId);
  const settings = data?.getEventSettings;

  const [layout, setLayout] = useState(settings?.layout || "layout-1");

  const [upsertSettings, { loading: saving }] = useUpsertEventSettings({
    onCompleted: () => {
      toast.success("Settings saved successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteEvent, { loading: deleting }] = useDeleteEvent({
    onCompleted: () => {
      toast.success("Event deleted successfully");
      router.push("/events");
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
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>
            Configure how your event appears to attendees
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Event Layout</Label>
            <Select value={layout} onValueChange={setLayout}>
              <SelectTrigger>
                <SelectValue placeholder="Select a layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="layout-1">
                  Modern Default (Layout 1)
                </SelectItem>
                <SelectItem value="layout-2">Clean List (Layout 2)</SelectItem>
                <SelectItem value="layout-3">Grid Focus (Layout 3)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground italic">
              * Changing the layout will affect the public event page.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Manage advanced configuration and danger zone actions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="danger-zone">
              <AccordionTrigger className="text-destructive hover:text-destructive/80">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong className="font-semibold block mb-1">
                      Delete Event
                    </strong>
                    Once you delete an event, there is no going back. This
                    action cannot be undone and will remove all tickets,
                    registrations, and media.
                  </AlertDescription>
                </Alert>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your event and remove all associated data from
                        our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleting ? "Deleting..." : "Confirm Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
