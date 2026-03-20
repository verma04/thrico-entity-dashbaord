"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Plus } from "lucide-react";

const roomSchema = Yup.object().shape({
  roomName: Yup.string().required("Room name is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
});

function AddVenueModal() {
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      roomName: "",
      capacity: "",
      description: "",
      facilities: "",
    },
    validationSchema: roomSchema,
    onSubmit: (values) => {
      console.log("Venue added:", values);
      setOpen(false);
      formik.resetForm();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Add a new room or hall to your venue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">
              Room Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="roomName"
              name="roomName"
              placeholder="Enter room name"
              value={formik.values.roomName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.roomName && formik.errors.roomName && (
              <p className="text-xs text-destructive">
                {formik.errors.roomName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">
              Capacity <span className="text-destructive">*</span>
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="Enter room capacity"
              value={formik.values.capacity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.capacity && formik.errors.capacity && (
              <p className="text-xs text-destructive">
                {String(formik.errors.capacity)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter room description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facilities">Facilities</Label>
            <Textarea
              id="facilities"
              name="facilities"
              placeholder="List available facilities (e.g., projector, microphone, etc.)"
              rows={3}
              value={formik.values.facilities}
              onChange={formik.handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Add Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useParams } from "next/navigation";
import { EventVenuesList } from "@/components/events/detail/event-venues";

export default function PhysicalVenuePage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="w-full">
      <EventVenuesList eventId={eventId} />
    </div>
  );
}
