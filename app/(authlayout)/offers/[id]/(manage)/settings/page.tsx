"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetOfferById,
  useChangeOfferStatus,
  useUpdateOffer,
  useGetOfferCategories,
  useVerifyOffer,
} from "@/graphql/actions/offers";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Loader2,
  Settings2,
  CheckCircle,
  PauseCircle,
  Ban,
  Calendar,
  Tag,
  Percent,
  Camera,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { ImageCropper } from "@/components/communities/add/image-cropper";
import { useModuleStore } from "@/store/useModuleStore";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  categoryId: Yup.string().required("Category is required"),
  discount: Yup.string().required("Discount value is required"),
  validityStart: Yup.string().required("Start date is required"),
  validityEnd: Yup.string().required("End date is required"),
  company: Yup.string(),
  location: Yup.string(),
  termsAndConditions: Yup.string(),
  timeline: Yup.string(),
  website: Yup.string().url("Invalid URL"),
  isActive: Yup.boolean(),
});

export default function OfferSettingsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const singularName = useModuleStore((state) => state.offerSingularName);

  const { data, loading } = useGetOfferById(id, {
    skip: !id,
  });

  const { data: categoriesData } = useGetOfferCategories();
  const categories = categoriesData?.getOfferCategories || [];

  const [changeStatus, { loading: updatingStatus }] = useChangeOfferStatus({
    onCompleted: () => {
      toast({
        title: "Success",
        description: `${singularName} status updated.`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const [updateOffer, { loading: updating }] = useUpdateOffer({
    onCompleted: () => {
      toast({
        title: "Success",
        description: `${singularName} updated successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || `Failed to update ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const [verifyOffer, { loading: verifyLoading }] = useVerifyOffer({
    onCompleted: () => {
      toast({
        title: "Success",
        description: `${singularName} verification updated`,
      });
      setIsVerifyModalOpen(false);
      setVerifyReason("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update verification",
        variant: "destructive",
      });
    },
  });

  const offer = data?.getOfferById;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyReason, setVerifyReason] = useState("");
  const [verifyAction, setVerifyAction] = useState<"VERIFY" | "UNVERIFY">(
    "VERIFY",
  );

  // Sync image URL when offer data loads
  React.useEffect(() => {
    if (offer?.image && !imageUrl) {
      setImageUrl(`https://cdn.thrico.network/${offer.image}`);
    }
  }, [offer, imageUrl]);

  const formik = useFormik({
    initialValues: {
      title: offer?.title || "",
      description: offer?.description || "",
      categoryId: offer?.category?.id || "",
      discount: offer?.discount || "",
      validityStart: offer?.validityStart
        ? new Date(offer.validityStart).toISOString().split("T")[0]
        : "",
      validityEnd: offer?.validityEnd
        ? new Date(offer.validityEnd).toISOString().split("T")[0]
        : "",
      status: offer?.status || "ACTIVE",
      image: offer?.image || "",
      company: typeof offer?.company === "string" ? offer.company : "",
      location: typeof offer?.location === "string" ? offer.location : "",
      termsAndConditions: offer?.termsAndConditions || "",
      timeline: typeof offer?.timeline === "string" ? offer.timeline : "",
      website: offer?.website || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      updateOffer({
        variables: {
          id: id,
          input: {
            ...values,
            image: coverFile as any, // Only send file if updated
          },
        },
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setCropModalVisible(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: any, croppedUrl: string) => {
    setCoverFile(croppedImage);
    setImageUrl(croppedUrl);
    setCropModalVisible(false);
    setSelectedImage(null);
    toast({
      title: "Success",
      description: "Cover image updated successfully!",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">
            Loading {singularName.toLowerCase()} details...
          </p>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    changeStatus({ variables: { input: { id, action } } });
  };

  const handleVerifyClick = (action: "VERIFY" | "UNVERIFY") => {
    setVerifyAction(action);
    setIsVerifyModalOpen(true);
  };

  const confirmVerify = () => {
    verifyOffer({
      variables: {
        input: {
          offerId: id,
          isVerified: verifyAction === "VERIFY",
          verificationReason: verifyReason,
        },
      },
    });
  };

  const statusActions = [
    {
      label: "Activate",
      action: "ACTIVATE",
      icon: CheckCircle,
      variant: "success",
      show: (s: string) => s !== "ACTIVE" && s !== "APPROVED",
    },
    {
      label: "Approve",
      action: "APPROVE",
      icon: CheckCircle,
      variant: "success",
      show: (s: string) => s === "PENDING" || s === "INACTIVE",
    },
    {
      label: "Deactivate",
      action: "DEACTIVATE",
      icon: PauseCircle,
      variant: "warning",
      show: (s: string) => s === "ACTIVE" || s === "APPROVED",
    },
    {
      label: "Expire",
      action: "EXPIRE",
      icon: Ban,
      variant: "destructive",
      show: (s: string) => s !== "EXPIRED",
    },
  ];

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300";
      case "destructive":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Status Management */}
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br from-card to-muted/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                Status Management
              </CardTitle>
              <CardDescription className="mt-1">
                Change the current status of this {singularName.toLowerCase()}.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Current Status
              </span>
              <Badge
                variant={
                  offer?.status === "APPROVED" || offer?.status === "ACTIVE"
                    ? "default"
                    : "secondary"
                }
                className="rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase"
              >
                {offer?.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {statusActions
              .filter((a) => a.show(offer?.status || ""))
              .map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.action}
                    disabled={updatingStatus}
                    onClick={() => handleAction(action.action)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                      getVariantStyles(action.variant),
                    )}
                  >
                    {updatingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    {action.label}
                  </button>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Verification Management */}
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br from-card to-muted/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                Verification
              </CardTitle>
              <CardDescription className="mt-1">
                Manage the verification status of this{" "}
                {singularName.toLowerCase()}.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Current Status
              </span>
              <Badge
                variant={
                  offer?.verification?.isVerified ? "default" : "secondary"
                }
                className={cn(
                  "rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase",
                  offer?.verification?.isVerified
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "",
                )}
              >
                {offer?.verification?.isVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {!offer?.verification?.isVerified ? (
              <button
                disabled={verifyLoading}
                onClick={() => handleVerifyClick("VERIFY")}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                  getVariantStyles("success"),
                )}
              >
                {verifyLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Verify {singularName}
              </button>
            ) : (
              <button
                disabled={verifyLoading}
                onClick={() => handleVerifyClick("UNVERIFY")}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                  getVariantStyles("destructive"),
                )}
              >
                {verifyLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldAlert className="h-4 w-4" />
                )}
                Remove Verification
              </button>
            )}
          </div>
          {offer?.verification?.verificationReason && (
            <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border/50">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Verification Reason
              </p>
              <p className="text-sm text-foreground">
                {offer.verification.verificationReason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form Container */}
      <div className="rounded-2xl border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 bg-card overflow-hidden relative">
        <div className="bg-muted/30 px-6 py-4 border-b border-border/40">
          <h3 className="font-semibold text-foreground">
            Edit {singularName} Details
          </h3>
          <p className="text-sm text-muted-foreground">
            Update the information for this {singularName.toLowerCase()}.
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">{singularName} Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Special 20% Off"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.title as string}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder={`Describe the ${singularName.toLowerCase()} details...`}
                  className="min-h-[100px] resize-none"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.description as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formik.values.categoryId}
                  onValueChange={(v) => formik.setFieldValue("categoryId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.categoryId as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount" className="flex items-center gap-2">
                  <Percent className="h-3 w-3" /> Discount Value
                </Label>
                <Input
                  id="discount"
                  placeholder="e.g., 20% or $50 Off"
                  {...formik.getFieldProps("discount")}
                />
                {formik.touched.discount && formik.errors.discount && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.discount as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="validityStart"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-3 w-3" /> Validity Start
                </Label>
                <Input
                  id="validityStart"
                  type="date"
                  {...formik.getFieldProps("validityStart")}
                />
                {formik.touched.validityStart &&
                  formik.errors.validityStart && (
                    <p className="text-xs font-medium text-destructive">
                      {formik.errors.validityStart as string}
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="validityEnd"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-3 w-3" /> Validity End
                </Label>
                <Input
                  id="validityEnd"
                  type="date"
                  {...formik.getFieldProps("validityEnd")}
                />
                {formik.touched.validityEnd && formik.errors.validityEnd && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.validityEnd as string}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Cover Image</Label>
                <div className="relative">
                  <div className="aspect-[3/1] overflow-hidden rounded-lg bg-muted border-2 border-dashed">
                    <Image
                      src={
                        imageUrl ||
                        `https://cdn.thrico.network/defaultEventCover.png`
                      }
                      alt="Offer cover"
                      width={600}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <label htmlFor="cover-upload">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 right-4 gap-2"
                      onClick={() =>
                        document.getElementById("cover-upload")?.click()
                      }
                    >
                      <Camera className="h-4 w-4" />
                      Update Cover
                    </Button>
                  </label>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200 x 400px. Max file size: 5MB.
                </p>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  {...formik.getFieldProps("company")}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder={`${singularName} location`}
                  {...formik.getFieldProps("location")}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder={`${singularName} timeline (e.g. 2 weeks)`}
                  {...formik.getFieldProps("timeline")}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://..."
                  {...formik.getFieldProps("website")}
                />
                {formik.touched.website && formik.errors.website && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.website as string}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                <Textarea
                  id="termsAndConditions"
                  placeholder="Terms and conditions..."
                  className="min-h-[80px] resize-none"
                  {...formik.getFieldProps("termsAndConditions")}
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t mt-8">
              <Button
                type="button"
                variant="outline"
                className="mr-3"
                onClick={() => router.push(`/offers/${id}/manage`)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating || !formik.isValid}
                className="min-w-[140px]"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>

          {/* Image Cropper Modal */}
          {selectedImage && (
            <ImageCropper
              cropModalVisible={cropModalVisible}
              image={selectedImage as string}
              onCropComplete={handleCropComplete}
              onCancel={() => {
                setCropModalVisible(false);
                setSelectedImage(null);
              }}
            />
          )}
        </div>
      </div>

      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verifyAction === "VERIFY"
                ? `Verify ${singularName}`
                : "Remove Verification"}
            </DialogTitle>
            <DialogDescription>
              {verifyAction === "VERIFY"
                ? `Confirm verification for this ${singularName.toLowerCase()}. Please provide a reason.`
                : `Are you sure you want to remove verification from this ${singularName.toLowerCase()}?`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for action{" "}
                {verifyAction === "VERIFY" && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Enter reason for this action..."
                value={verifyReason}
                onChange={(e) => setVerifyReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVerifyModalOpen(false)}
              disabled={verifyLoading}
            >
              Cancel
            </Button>
            <Button
              variant={verifyAction === "VERIFY" ? "default" : "destructive"}
              onClick={confirmVerify}
              disabled={
                verifyLoading ||
                (verifyAction === "VERIFY" && !verifyReason.trim())
              }
            >
              {verifyLoading ? "Processing..." : "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
