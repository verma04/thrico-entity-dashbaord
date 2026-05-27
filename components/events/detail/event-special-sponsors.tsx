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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, Trash2, Upload } from "lucide-react";
import {
  EventSpecialSponsorship,
  EventSpecialSponsor,
  useEventSpecialSponsorships,
  useAddEventSpecialSponsorship,
  useDeleteEventSpecialSponsorship,
  useAddEventSpecialSponsor,
  useDeleteEventSpecialSponsor,
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
  sponsorUrl: Yup.string().url("Must be a valid URL"),
  sponsorDescription: Yup.string(),
});

function AddSpecialSponsorshipTierModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [addSponsorship, { loading }] = useAddEventSpecialSponsorship({
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
          Add Special Sponsorship Tier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Special Tier</DialogTitle>
          <DialogDescription>
            Create a new special sponsorship package.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sponsorType">Tier Name</Label>
            <Input
              id="sponsorType"
              placeholder="e.g. Platinum Partner"
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
              placeholder="Main Stage Logo, Full access pass"
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
              {loading ? "Adding..." : "Add Special Tier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddSpecialSponsorModal({
  eventId,
  sponsorShipId,
  tierName,
}: {
  eventId: string;
  sponsorShipId: string;
  tierName: string;
}) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("sponsorLogoImage", file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const [addSponsor, { loading }] = useAddEventSpecialSponsor({
    onCompleted: () => {
      formik.resetForm();
      setImagePreview(null);
      setOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      sponsorName: "",
      sponsorUrl: "",
      sponsorDescription: "",
      sponsorLogoImage: null as any,
    },
    validationSchema: sponsorSchema,
    onSubmit: (values) => {
      addSponsor({
        variables: {
          input: {
            eventId,
            sponsorShipId,
            sponsorName: values.sponsorName,
            sponsorUrl: values.sponsorUrl,
            sponsorDescription: values.sponsorDescription,
            sponsorLogoImage: values.sponsorLogoImage,
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
          <DialogTitle>Add {tierName} Special Sponsor</DialogTitle>
          <DialogDescription>
            Add a new company/sponsor to this special tier.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-2">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={imagePreview || "/placeholder.svg"} />
              <AvatarFallback>
                <Building className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <label htmlFor={`special-sponsor-avatar-upload-${sponsorShipId}`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 cursor-pointer"
                type="button"
                onClick={() =>
                  document.getElementById(`special-sponsor-avatar-upload-${sponsorShipId}`)?.click()
                }
              >
                <Upload className="h-3 w-3" />
                Upload Logo
              </Button>
            </label>
            <input
              id={`special-sponsor-avatar-upload-${sponsorShipId}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsorName">Special Sponsor Name</Label>
            <Input
              id="sponsorName"
              placeholder="e.g. Special Corp"
              {...formik.getFieldProps("sponsorName")}
            />
            {formik.touched.sponsorName && formik.errors.sponsorName && (
              <p className="text-xs text-destructive">
                {String(formik.errors.sponsorName)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sponsorUrl">Website URL</Label>
            <Input
              id="sponsorUrl"
              placeholder="https://example.com"
              {...formik.getFieldProps("sponsorUrl")}
            />
            {formik.touched.sponsorUrl && formik.errors.sponsorUrl && (
              <p className="text-xs text-destructive">
                {String(formik.errors.sponsorUrl)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sponsorDescription">Description</Label>
            <Textarea
              id="sponsorDescription"
              placeholder="Brief description of the sponsor"
              {...formik.getFieldProps("sponsorDescription")}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Special Sponsor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EventSpecialSponsorshipList({ eventId }: { eventId: string }) {
  const { data, loading } = useEventSpecialSponsorships(eventId);
  const tiers: EventSpecialSponsorship[] = data?.getEventSpecialSponsorships || [];

  const [tierToDelete, setTierToDelete] = useState<string | null>(null);
  const [sponsorToDelete, setSponsorToDelete] = useState<string | null>(null);

  const [deleteTier, { loading: isDeletingTier }] = useDeleteEventSpecialSponsorship({
    refetchQueries: ["GetEventSpecialSponsorships"],
    onCompleted: () => setTierToDelete(null),
  });

  const [deleteSponsor, { loading: isDeletingSponsor }] = useDeleteEventSpecialSponsor({
    refetchQueries: ["GetEventSpecialSponsorships"],
    onCompleted: () => setSponsorToDelete(null),
  });

  const handleDeleteTier = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tierToDelete) {
      deleteTier({ variables: { sponsorshipId: tierToDelete } });
    }
  };

  const handleDeleteSponsor = (e: React.MouseEvent) => {
    e.preventDefault();
    if (sponsorToDelete) {
      deleteSponsor({ variables: { sponsorId: sponsorToDelete } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">
            Loading special sponsorships...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Special Sponsorship Tiers</h2>
        <AddSpecialSponsorshipTierModal eventId={eventId} />
      </div>

      {tiers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed">
          <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No Special Sponsorships Yet</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
            Create special tiers for elite partners.
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
              onClick={() => setTierToDelete(tier.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {tier.sponsorType} (Special Tier)
                    {tier.showPrice && (
                      <span className="text-lg font-normal text-muted-foreground">
                        - {tier.currency} {tier.price}
                      </span>
                    )}
                  </CardTitle>
                </div>
                <Badge variant="secondary">
                  {tier.sponsors?.length || 0} Special Sponsors
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
                  Current Special Sponsors
                </h4>
                <div className="flex flex-wrap gap-4 items-center">
                  {tier.sponsors?.map((sponsor: EventSpecialSponsor) => (
                    <div
                      key={sponsor.id}
                      className="flex flex-col items-center gap-2 group/sponsor relative"
                    >
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-5 w-5 rounded-full absolute -top-2 -right-2 opacity-0 group-hover/sponsor:opacity-100 z-10 transition-opacity"
                        onClick={() => setSponsorToDelete(sponsor.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Avatar className="h-16 w-16 border bg-background">
                        <AvatarImage
                          src={
                            sponsor.sponsorLogo && sponsor.sponsorLogo !== "/placeholder.svg"
                              ? `https://cdn.thrico.network/${sponsor.sponsorLogo}`
                              : "/placeholder.svg"
                          }
                          alt={sponsor.sponsorName}
                        />
                        <AvatarFallback>
                          <Building className="h-6 w-6 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      {sponsor.sponsorUrl ? (
                        <a href={sponsor.sponsorUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-center max-w-[80px] truncate hover:underline text-primary">
                          {sponsor.sponsorName}
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-center max-w-[80px] truncate">
                          {sponsor.sponsorName}
                        </span>
                      )}
                    </div>
                  ))}

                  <AddSpecialSponsorModal
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

      {/* Delete Tier Confirmation */}
      <AlertDialog open={!!tierToDelete} onOpenChange={(open) => !open && setTierToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Special Sponsorship Tier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this special tier? This will also remove all special sponsors associated with it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingTier}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTier} 
              disabled={isDeletingTier}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingTier ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Sponsor Confirmation */}
      <AlertDialog open={!!sponsorToDelete} onOpenChange={(open) => !open && setSponsorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Special Sponsor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this special sponsor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingSponsor}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSponsor} 
              disabled={isDeletingSponsor}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingSponsor ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
