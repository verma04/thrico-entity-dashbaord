"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
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
import { Switch } from "@/components/ui/switch";
import { Upload, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import GooglePlacesInput from "@/components/layout/google-place-input";

const eventSchema = Yup.object().shape({
  title: Yup.string().required("Event title is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.mixed().required("Location is required"),
  seats: Yup.number().min(1, "Must have at least 1 seat"),
});

export default function EventGeneralInfo() {
  const [eventType, setEventType] = useState("physical");
  const [registrationOpen, setRegistrationOpen] = useState(true);

  const formik = useFormik({
    initialValues: {
      title: "Tech Conference 2023",
      description:
        "Join us for the premier tech conference of the year, featuring industry leaders, workshops, and networking opportunities.",
      location: "",
      seats: 1500,
      timezone: "pst",
      eventType: "physical",
      startDate: "",
      endDate: "",
      startTime: "",
    },
    validationSchema: eventSchema,
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="bg-muted/30">
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Basic information about your event
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Event Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter event title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.title &&
                        formik.errors.title &&
                        "border-destructive"
                    )}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-xs text-destructive">
                      {String(formik.errors.title)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <GooglePlacesInput
                    id="location"
                    name="location"
                    onBlur={formik.handleBlur}
                    placeholder="Select event location"
                    className={cn(
                      formik.touched.location &&
                        formik.errors.location &&
                        "border-destructive"
                    )}
                    onChange={(loc) =>
                      formik.setFieldValue("location", loc.address || loc.name)
                    }
                  />
                  {formik.touched.location && formik.errors.location && (
                    <p className="text-xs text-destructive">
                      {String(formik.errors.location)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Select the event location
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter event description"
                  className={cn(
                    "min-h-[120px] resize-none",
                    formik.touched.description &&
                      formik.errors.description &&
                      "border-destructive"
                  )}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs text-destructive">
                    {String(formik.errors.description)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      className="pl-10"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="pl-10"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium">
                    Start Time
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      className="pl-10"
                      value={formik.values.startTime}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium">
                    Timezone
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      formik.setFieldValue("timezone", value)
                    }
                    value={formik.values.timezone}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="utc">
                        Coordinated Universal Time (UTC)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium">
                  Event Type
                </Label>
                <Select
                  onValueChange={(value) => {
                    setEventType(value);
                    formik.setFieldValue("eventType", value);
                  }}
                  value={formik.values.eventType}
                >
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="seats" className="text-sm font-medium">
                    Seat Limit
                  </Label>
                  <Input
                    id="seats"
                    name="seats"
                    type="number"
                    value={formik.values.seats}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.seats &&
                        formik.errors.seats &&
                        "border-destructive"
                    )}
                  />
                  {formik.touched.seats && formik.errors.seats && (
                    <p className="text-xs text-destructive">
                      {String(formik.errors.seats)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="registration" className="text-sm font-medium">
                    Registration Open
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow attendees to register for this event
                  </p>
                </div>
                <Switch
                  id="registration"
                  checked={registrationOpen}
                  onCheckedChange={setRegistrationOpen}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE - Cover Image */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm ring-1 ring-border/50 sticky top-6">
            <CardHeader className="bg-muted/30">
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                Upload an eye-catching cover for your event
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative aspect-video border-2 border-dashed rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  alt="Event Cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                  <Button variant="secondary" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Cover Image
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Recommended size: 1200x630px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
