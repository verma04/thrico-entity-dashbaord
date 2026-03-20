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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, Trash2 } from "lucide-react";
import {
  EventSponsorship,
  EventSponsor,
  useEventSponsorships,
  useAddEventSponsorship,
  useDeleteEventSponsorship,
  useAddEventSponsor,
  useDeleteEventSponsor,
} from "@/graphql/actions/events";
import { Textarea } from "@/components/ui/textarea";

// --- Form Validation Schemas ---
const tierSchema = Yup.object().shape({
  sponsorType: Yup.string().required("Tier Name is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  currency: Yup.string().required("Currency is required"),
  benefitsStr: Yup.string().required(
    "Provide at least one benefit (comma separated)",
  ),
});

const sponsorSchema = Yup.object().shape({
  sponsorName: Yup.string().required("Sponsor Name is required"),
});

function AddSponsorshipTierModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [addSponsorship, { loading }] = useAddEventSponsorship({
    onCompleted: () => {
      formik.resetForm();
      setOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      sponsorType: "", // e.g., Platinum
      price: 0,
      currency: "USD",
      benefitsStr: "", // Comma separated string
    },
    validationSchema: tierSchema,
    onSubmit: (values) => {
      const benefitsArr = values.benefitsStr.split(",").map((b) => b.trim());

      addSponsorship({
        variables: {
          input: {
            eventId,
            sponsorType: values.sponsorType,
            price: values.price,
            currency: values.currency,
            showPrice: true,
            content: { benefits: benefitsArr },
          },
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Sponsorship Tier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Tier</DialogTitle>
          <DialogDescription>
            Create a new sponsorship package.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sponsorType">Tier Name</Label>
            <Input
              id="sponsorType"
              placeholder="e.g. Gold"
              {...formik.getFieldProps("sponsorType")}
            />
            {formik.touched.sponsorType && formik.errors.sponsorType && (
              <p className="text-xs text-destructive">
                {String(formik.errors.sponsorType)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                {...formik.getFieldProps("price")}
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-xs text-destructive">
                  {String(formik.errors.price)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" {...formik.getFieldProps("currency")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefitsStr">Benefits (comma separated)</Label>
            <Textarea
              id="benefitsStr"
              placeholder="Logo on website, 5 VIP Tickets"
              {...formik.getFieldProps("benefitsStr")}
            />
            {formik.touched.benefitsStr && formik.errors.benefitsStr && (
              <p className="text-xs text-destructive">
                {String(formik.errors.benefitsStr)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Tier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddSponsorModal({
  eventId,
  sponsorShipId,
  tierName,
}: {
  eventId: string;
  sponsorShipId: string;
  tierName: string;
}) {
  const [open, setOpen] = useState(false);
  const [addSponsor, { loading }] = useAddEventSponsor({
    onCompleted: () => {
      formik.resetForm();
      setOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      sponsorName: "",
    },
    validationSchema: sponsorSchema,
    onSubmit: (values) => {
      addSponsor({
        variables: {
          input: {
            eventId,
            sponsorShipId,
            sponsorName: values.sponsorName,
            sponsorLogo: "/placeholder.svg", // Default for now
            sponsorUserName: "",
            sponsorUserDesignation: "",
            isApproved: true,
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
          size="icon"
          className="h-16 w-16 rounded-full border-dashed hover:border-primary shrink-0"
        >
          <Plus className="h-6 w-6 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {tierName} Sponsor</DialogTitle>
          <DialogDescription>
            Add a new company/sponsor to this tier.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sponsorName">Sponsor Name</Label>
            <Input
              id="sponsorName"
              placeholder="e.g. TechCorp"
              {...formik.getFieldProps("sponsorName")}
            />
            {formik.touched.sponsorName && formik.errors.sponsorName && (
              <p className="text-xs text-destructive">
                {String(formik.errors.sponsorName)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Sponsor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EventSponsorshipList({ eventId }: { eventId: string }) {
  const { data, loading } = useEventSponsorships(eventId);
  const tiers: EventSponsorship[] = data?.getEventSponsorships || [];

  const [deleteTier] = useDeleteEventSponsorship({
    refetchQueries: ["GetEventSponsorships"],
  });

  const [deleteSponsor] = useDeleteEventSponsor({
    refetchQueries: ["GetEventSponsorships"],
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">
            Loading sponsorships...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sponsorship Tiers</h2>
        <AddSponsorshipTierModal eventId={eventId} />
      </div>

      {tiers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed">
          <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No Sponsorships Yet</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
            Create tiers like "Platinum" or "Gold" to offer packages to
            partnering companies.
          </p>
        </Card>
      ) : (
        tiers.map((tier) => (
          <Card
            key={tier.id}
            className="border-none shadow-sm ring-1 ring-border/50 relative overflow-hidden group"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
              onClick={() =>
                deleteTier({ variables: { sponsorshipId: tier.id } })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {tier.sponsorType} Tier
                    {tier.showPrice && (
                      <span className="text-lg font-normal text-muted-foreground">
                        - {tier.currency} {tier.price}
                      </span>
                    )}
                  </CardTitle>
                </div>
                <Badge variant="secondary">
                  {tier.sponsors?.length || 0} Sponsors
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border-r border-border pr-4">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                  Benefits
                </h4>
                <ul className="space-y-2">
                  {tier.content?.benefits?.map(
                    (benefit: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm flex items-start gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="leading-snug">{benefit}</span>
                      </li>
                    ),
                  )}
                  {(!tier.content?.benefits ||
                    tier.content?.benefits.length === 0) && (
                    <p className="text-xs text-muted-foreground italic">
                      No benefits listed
                    </p>
                  )}
                </ul>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                  Current Sponsors
                </h4>
                <div className="flex flex-wrap gap-4 items-center">
                  {tier.sponsors?.map((sponsor: EventSponsor) => (
                    <div
                      key={sponsor.id}
                      className="flex flex-col items-center gap-2 group/sponsor relative"
                    >
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-5 w-5 rounded-full absolute -top-2 -right-2 opacity-0 group-hover/sponsor:opacity-100 z-10 transition-opacity"
                        onClick={() =>
                          deleteSponsor({
                            variables: { sponsorId: sponsor.id },
                          })
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Avatar className="h-16 w-16 border bg-background">
                        <AvatarImage
                          src={sponsor.sponsorLogo}
                          alt={sponsor.sponsorName}
                        />
                        <AvatarFallback>
                          <Building className="h-6 w-6 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center max-w-[80px] truncate">
                        {sponsor.sponsorName}
                      </span>
                    </div>
                  ))}

                  <AddSponsorModal
                    eventId={eventId}
                    sponsorShipId={tier.id}
                    tierName={tier.sponsorType}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
