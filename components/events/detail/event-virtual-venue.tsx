"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, ExternalLink, Save, Info } from "lucide-react";
import { useEventById, useUpdateEvent } from "@/graphql/actions/events";
import { toast } from "sonner";

const virtualSchema = Yup.object().shape({
  platform: Yup.string().required("Platform is required"),
  meetingLink: Yup.string()
    .url("Must be a valid URL")
    .required("Meeting link is required"),
  meetingId: Yup.string(),
  password: Yup.string(),
  notes: Yup.string(),
});

export function EventVirtualVenue({ eventId }: { eventId: string }) {
  const { data, loading: fetching } = useEventById(eventId);
  const event = data?.getEventById;

  const [updateEvent, { loading: updating }] = useUpdateEvent({
    onCompleted: () => {
      toast.success("Virtual meeting details updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update virtual meeting details");
    },
  });

  const locationDetails = event?.location || {};
  const virtualDetails = locationDetails.virtual || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      platform: virtualDetails.platform || "zoom",
      meetingLink: virtualDetails.meetingLink || "",
      meetingId: virtualDetails.meetingId || "",
      password: virtualDetails.password || "",
      notes: virtualDetails.notes || "",
    },
    validationSchema: virtualSchema,
    onSubmit: (values) => {
      const updatedLocation = {
        ...locationDetails,
        virtual: {
          platform: values.platform,
          meetingLink: values.meetingLink,
          meetingId: values.meetingId,
          password: values.password,
          notes: values.notes,
        },
      };

      updateEvent({
        variables: {
          eventId,
          input: {
            title: event?.title,
            type: event?.type,
            location: updatedLocation,
          },
        },
      });
    },
  });

  if (fetching) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardContent className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">
              Loading virtual details...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Virtual Meeting Details</CardTitle>
            <CardDescription>
              Configure the digital destination for your online or hybrid event.
            </CardDescription>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formik.values.platform}
                onValueChange={(value) =>
                  formik.setFieldValue("platform", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                  <SelectItem value="microsoft-teams">
                    Microsoft Teams
                  </SelectItem>
                  <SelectItem value="webex">Cisco Webex</SelectItem>
                  <SelectItem value="custom">Custom Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingId">Meeting ID / Room Name</Label>
              <Input
                id="meetingId"
                placeholder="e.g. 123 456 7890"
                {...formik.getFieldProps("meetingId")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingLink">
              Meeting URL / Link <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/j/..."
                className="flex-1"
                {...formik.getFieldProps("meetingLink")}
              />
              {formik.values.meetingLink && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    window.open(formik.values.meetingLink, "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formik.touched.meetingLink && formik.errors.meetingLink && (
              <p className="text-xs text-destructive">
                {formik.errors.meetingLink as string}
              </p>
            )}
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="password">Meeting Password / Access Code</Label>
            <Input
              id="password"
              type="text"
              placeholder="Enter meeting password if any"
              {...formik.getFieldProps("password")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Joining Instructions</Label>
            <Textarea
              id="notes"
              placeholder="Any special notes for attendees (e.g. Join 5 mins early)"
              rows={4}
              {...formik.getFieldProps("notes")}
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              This link will be shared with registered attendees in their
              confirmation emails and calendar invites.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={updating}>
              <Save className="mr-2 h-4 w-4" />
              {updating ? "Saving Changes..." : "Save Virtual Details"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
