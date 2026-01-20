"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Offer,
  OfferCategory,
  CreateOfferInput,
} from "@/graphql/actions/offers";
import {
  Calendar,
  Tag,
  Image as ImageIcon,
  Percent,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { ImageCropper } from "../communities/add/image-cropper";
import { useToast } from "@/components/ui/use-toast";

interface OfferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingOffer: Offer | null;
  categories: OfferCategory[];
  isLoading: boolean;
  onSave: (values: CreateOfferInput) => void;
}

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

export function OfferDialog({
  isOpen,
  onOpenChange,
  editingOffer,
  categories,
  isLoading,
  onSave,
}: OfferDialogProps) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = React.useState<string | null>(
    editingOffer?.image || null,
  );
  const [cropModalVisible, setCropModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      title: editingOffer?.title || "",
      description: editingOffer?.description || "",
      categoryId: editingOffer?.category?.id || "",
      discount: editingOffer?.discount || "",
      validityStart: editingOffer?.validityStart
        ? new Date(editingOffer.validityStart).toISOString().split("T")[0]
        : "",
      validityEnd: editingOffer?.validityEnd
        ? new Date(editingOffer.validityEnd).toISOString().split("T")[0]
        : "",
      status: editingOffer?.status || "ACTIVE",
      image: editingOffer?.image || "",
      company: editingOffer?.company || "",
      location: editingOffer?.location || "",
      termsAndConditions: editingOffer?.termsAndConditions || "",
      timeline: editingOffer?.timeline || "",
      website: editingOffer?.website || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSave({ ...values, image: coverFile as any });
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden flex flex-col max-h-[90vh] p-0">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col max-h-[90vh]"
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              {editingOffer ? "Edit Offer" : "Create New Offer"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Offer Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Special 20% Off"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the offer details..."
                  className="min-h-[100px] resize-none"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs font-medium text-destructive">
                    {formik.errors.description}
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
                    {categories.map((cat) => (
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
                    {formik.errors.categoryId}
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
                    {formik.errors.discount}
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
                      {formik.errors.validityStart}
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
                    {formik.errors.validityEnd}
                  </p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Cover Image</Label>
                <div className="relative">
                  <div className="aspect-3/1 overflow-hidden rounded-lg bg-muted border-2 border-dashed">
                    <Image
                      src={
                        imageUrl ||
                        "https://cdn.thrico.network/defaultEventCover.png"
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
                  placeholder="Offer location"
                  {...formik.getFieldProps("location")}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="Offer timeline (e.g. 2 weeks)"
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
                    {formik.errors.website}
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
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading
                ? "Saving..."
                : editingOffer
                  ? "Update Offer"
                  : "Create Offer"}
            </Button>
          </DialogFooter>
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
      </DialogContent>
    </Dialog>
  );
}
