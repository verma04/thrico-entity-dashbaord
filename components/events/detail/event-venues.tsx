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
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, Home } from "lucide-react";

import {
  EventVenue,
  useEventVenues,
  useAddEventVenue,
  useUpdateEventVenue,
  useDeleteEventVenue,
} from "@/graphql/actions/events";

// --- Form Validation Schemas ---
const venueSchema = Yup.object().shape({
  name: Yup.string().required("Venue name is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
});

function AddVenueModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [addVenue, { loading }] = useAddEventVenue({
    onCompleted: () => {
      formik.resetForm();
      setOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      capacity: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      description: "",
      amenitiesStr: "",
    },
    validationSchema: venueSchema,
    onSubmit: (values) => {
      const amenitiesArr = values.amenitiesStr
        ? values.amenitiesStr.split(",").map((a) => a.trim())
        : [];

      addVenue({
        variables: {
          input: {
            eventId,
            name: values.name,
            capacity: parseInt(values.capacity, 10),
            address: values.address,
            city: values.city,
            state: values.state,
            country: values.country,
            zipCode: values.zipCode,
            description: values.description,
            amenities: amenitiesArr,
            status: true,
          },
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-full min-h-[140px] border-dashed gap-2 group hover:border-primary hover:bg-primary/5"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-medium text-sm">Add New Venue or Room</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Venue Room</DialogTitle>
          <DialogDescription>
            Add a new physical location, hall, or room for your event guests.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Venue / Room Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Grand Ballroom"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">
                Guest Capacity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g. 500"
                {...formik.getFieldProps("capacity")}
              />
              {formik.touched.capacity && formik.errors.capacity && (
                <p className="text-xs text-destructive">
                  {String(formik.errors.capacity)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-sm">Location Details</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              placeholder="123 Example Street"
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-xs text-destructive">
                {formik.errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="San Francisco"
                {...formik.getFieldProps("city")}
              />
              {formik.touched.city && formik.errors.city && (
                <p className="text-xs text-destructive">{formik.errors.city}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input
                id="state"
                placeholder="CA"
                {...formik.getFieldProps("state")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-destructive">*</span>
              </Label>
              <Input
                id="country"
                placeholder="USA"
                {...formik.getFieldProps("country")}
              />
              {formik.touched.country && formik.errors.country && (
                <p className="text-xs text-destructive">
                  {formik.errors.country}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code</Label>
              <Input
                id="zipCode"
                placeholder="94103"
                {...formik.getFieldProps("zipCode")}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-sm">Additional Details</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter room description"
              rows={3}
              {...formik.getFieldProps("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenitiesStr">Amenities (Comma Separated)</Label>
            <Textarea
              id="amenitiesStr"
              placeholder="Projector, PA System, WiFi"
              rows={2}
              {...formik.getFieldProps("amenitiesStr")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Venue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EventVenuesList({ eventId }: { eventId: string }) {
  const { data, loading } = useEventVenues(eventId);
  const venues: EventVenue[] = data?.getEventVenues || [];

  const [deleteVenue] = useDeleteEventVenue({
    refetchQueries: ["GetEventVenues"],
  });

  if (loading) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardContent className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">
              Loading associated venues...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle>Physical Venue Locations</CardTitle>
        <CardDescription>
          Configure the physical locations, halls, and rooms mapped to your
          event.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card
              key={venue.id}
              className="relative group overflow-hidden border shadow-sm"
            >
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-7 w-7"
                onClick={() =>
                  deleteVenue({ variables: { venueId: venue.id } })
                }
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <CardHeader className="pb-3 bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base line-clamp-1">
                      {venue.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      Capacity: {venue.capacity || "N/A"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4 space-y-4">
                <div className="flex items-start gap-2 pt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p>{venue.address}</p>
                    <p className="text-muted-foreground">
                      {venue.city}
                      {venue.state ? `, ${venue.state}` : ""} {venue.zipCode}
                    </p>
                    <p className="text-muted-foreground">{venue.country}</p>
                  </div>
                </div>

                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="space-y-1.5 border-t pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {venue.amenities.map((amenity, i) => (
                        <Badge
                          variant="secondary"
                          key={i}
                          className="text-[10px] font-normal px-2 py-0"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {venue.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 italic pt-2 border-t">
                    "{venue.description}"
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          <AddVenueModal eventId={eventId} />
        </div>
      </CardContent>
    </Card>
  );
}
