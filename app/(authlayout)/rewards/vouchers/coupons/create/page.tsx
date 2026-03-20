"use client";

import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ChevronLeft,
  Save,
  Ticket,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  X,
  Upload,
} from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCreateReward } from "@/graphql/actions/rewards";

const couponSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  tcCost: Yup.number().required("TC Cost is required").min(0),
  discountType: Yup.string().required("Discount type is required"),
  discountValue: Yup.string().required("Discount value is required"),
  validityDays: Yup.number().required("Validity is required").min(1),
  totalUsageLimit: Yup.number().min(0),
  perUserLimit: Yup.number().min(1),
  minAccountAge: Yup.number().min(0),
  minActivityRequired: Yup.number().min(0),
});

export default function CreateCouponPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [createReward, { loading }] = useCreateReward();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "Internal",
      tcCost: 0,
      discountType: "Flat",
      discountValue: "",
      validityDays: 30,
      totalUsageLimit: 0,
      perUserLimit: 1,
      minAccountAge: 0,
      minActivityRequired: 0,
      blockWarnedUsers: false,
      cooldownPeriod: 0,
      inventoryRequired: false,
      image: "",
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      try {
        // Map category name to ID (this should ideally come from a category lookup)
        const categoryIdMap: Record<string, string> = {
          Amazon: "cat-001",
          Internal: "cat-002",
          Event: "cat-003",
          Brand: "cat-004",
        };

        await createReward({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              categoryId: categoryIdMap[values.category] || "cat-002",
              tcCost: values.tcCost,
              inventoryRequired: values.inventoryRequired,
              perUserLimit: values.perUserLimit,
              totalUsageLimit: values.totalUsageLimit,
              minAccountAge: values.minAccountAge,
              minActivityRequired: values.minActivityRequired,
              blockWarnedUsers: values.blockWarnedUsers,
              cooldownPeriod: values.cooldownPeriod,
              image: values.image,
            },
          },
        });
        toast({
          title: "Coupon Created",
          description: `"${values.title}" has been successfully activated.`,
        });
        router.push("/rewards/vouchers/coupons");
      } catch (err: any) {
        toast({
          title: "Creation Failed",
          description: err.message || "There was an error creating the coupon.",
          variant: "destructive",
        });
      }
    },
  });

  const removeImage = () => {
    formik.setFieldValue("image", "");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/rewards/vouchers/coupons">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Coupon</h2>
            <p className="text-muted-foreground">
              Define your reward and setting limits.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => formik.handleSubmit()}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={loading}
            className="gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {loading ? "Creating..." : "Activate Coupon"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Basic Details */}
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>
                    Name and describe your reward coupon.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Coupon Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. ₹500 Amazon Gift Card"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-xs text-destructive">
                    {formik.errors.title}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does the user get? Any special instructions?"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-xs text-destructive">
                    {formik.errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    onValueChange={(v) => formik.setFieldValue("category", v)}
                    value={formik.values.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Amazon">Amazon</SelectItem>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Brand">Brand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <ImageUploadWithCrop
                    label="Coupon Image (Optional)"
                    currentImage={formik.values.image}
                    onImageUpdate={(url) => formik.setFieldValue("image", url)}
                    aspectRatio={16 / 9}
                    recommendedWidth={1200}
                    recommendedHeight={675}
                    uploadButtonText="Upload Banner..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reward Settings */}
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Reward Settings</CardTitle>
                  <CardDescription>
                    Configure the value and cost of the coupon.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tcCost">TC Cost</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] text-amber-900 border border-amber-500/20">
                      TC
                    </div>
                    <Input
                      id="tcCost"
                      type="number"
                      className="pl-10"
                      {...formik.getFieldProps("tcCost")}
                    />
                  </div>
                  {formik.touched.tcCost && formik.errors.tcCost && (
                    <p className="text-xs text-destructive">
                      {formik.errors.tcCost}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    onValueChange={(v) =>
                      formik.setFieldValue("discountType", v)
                    }
                    value={formik.values.discountType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat Amount</SelectItem>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Access">Access Unlock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    placeholder="e.g. 100 or 10%"
                    {...formik.getFieldProps("discountValue")}
                  />
                  {formik.touched.discountValue &&
                    formik.errors.discountValue && (
                      <p className="text-xs text-destructive">
                        {formik.errors.discountValue}
                      </p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validityDays">
                    Validity (days after redeem)
                  </Label>
                  <Input
                    id="validityDays"
                    type="number"
                    {...formik.getFieldProps("validityDays")}
                  />
                  {formik.touched.validityDays &&
                    formik.errors.validityDays && (
                      <p className="text-xs text-destructive">
                        {formik.errors.validityDays}
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limits & Controls */}
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Limits & Controls</CardTitle>
                  <CardDescription>
                    Set fraud prevention and usage rules.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalUsageLimit">Total Usage Limit</Label>
                  <Input
                    id="totalUsageLimit"
                    type="number"
                    placeholder="0 for unlimited"
                    {...formik.getFieldProps("totalUsageLimit")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perUserLimit">Per User Limit</Label>
                  <Input
                    id="perUserLimit"
                    type="number"
                    {...formik.getFieldProps("perUserLimit")}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minAccountAge">Min Account Age (days)</Label>
                  <Input
                    id="minAccountAge"
                    type="number"
                    {...formik.getFieldProps("minAccountAge")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minActivityRequired">
                    Min Activity Points Required
                  </Label>
                  <Input
                    id="minActivityRequired"
                    type="number"
                    {...formik.getFieldProps("minActivityRequired")}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/10">
                <div className="space-y-0.5">
                  <Label>Block Users With Warnings</Label>
                  <p className="text-xs text-muted-foreground">
                    Toggle to prevent users with active community strikes from
                    redeeming.
                  </p>
                </div>
                <Switch
                  checked={formik.values.blockWarnedUsers}
                  onCheckedChange={(v) =>
                    formik.setFieldValue("blockWarnedUsers", v)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cooldownPeriod">Cooldown Period (days)</Label>
                <Input
                  id="cooldownPeriod"
                  type="number"
                  placeholder="Wait time between redemptions"
                  {...formik.getFieldProps("cooldownPeriod")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-border/50 sticky top-6">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <CardTitle>Inventory Setup</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inventory Required?</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Toggle for external vouchers (Amazon etc.)
                  </p>
                </div>
                <Switch
                  checked={formik.values.inventoryRequired}
                  onCheckedChange={(v) =>
                    formik.setFieldValue("inventoryRequired", v)
                  }
                />
              </div>

              {formik.values.inventoryRequired && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> You will be prompted to upload CSV
                    codes in the next step after saving.
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-muted-foreground">
                  Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-bold">{formik.values.tcCost} TC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Value</span>
                    <span className="font-bold">
                      {formik.values.discountValue || "-"}{" "}
                      {formik.values.discountType === "Percentage" ? "%" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">
                      {formik.values.inventoryRequired
                        ? "External"
                        : "Internal"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
