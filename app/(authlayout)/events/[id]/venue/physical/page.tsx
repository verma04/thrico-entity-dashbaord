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

function PhysicalVenuePage() {
  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50">
      <CardHeader className="bg-muted/30">
        <CardTitle>Physical Venue Details</CardTitle>
        <CardDescription>
          Configure the physical location and rooms for your event
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="venueName">Venue Name</Label>
            <Input
              id="venueName"
              defaultValue="San Francisco Convention Center"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venueHall">Hall/Room</Label>
            <Input id="venueHall" defaultValue="Grand Ballroom" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venueAddress">Address</Label>
          <Textarea
            id="venueAddress"
            rows={3}
            defaultValue="747 Howard St, San Francisco, CA 94103, United States"
          />
        </div>

        <div className="space-y-2">
          <Label>Map Location</Label>
          <div className="border-2 border-dashed rounded-lg h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <MapPin className="h-8 w-8 mb-2" />
            <p className="text-sm">Interactive map would be displayed here</p>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Venue Rooms</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Main Hall", capacity: "1000" },
              { name: "Room A", capacity: "250" },
              { name: "Room B", capacity: "250" },
              { name: "Workshop Hall", capacity: "150" },
            ].map((room) => (
              <Card key={room.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Capacity: {room.capacity}
                  </p>
                </CardContent>
              </Card>
            ))}
            <AddVenueModal />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PhysicalVenuePage;
