"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ChevronLeft,
  Ticket,
  Settings,
  ShieldCheck,
  PackageCheck,
  Loader2,
  Save,
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

const SectionCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  children,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
    <div className="p-5 space-y-5">{children}</div>
  </div>
);

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
        toast({ title: "Reward created", description: `"${values.title}" is now active.` });
        router.push("/rewards/vouchers/coupons");
      } catch (err: any) {
        toast({ title: "Creation failed", description: err.message, variant: "destructive" });
      }
    },
  });

  const err = (field: keyof typeof formik.errors) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-xs text-destructive mt-1">{formik.errors[field] as string}</p>
    ) : null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
        <div className="flex items-center justify-between px-1 py-4">
          <div className="flex items-center gap-3">
            <Link href="/rewards/vouchers/coupons">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-base font-semibold text-foreground">Create Reward</h1>
              <p className="text-xs text-muted-foreground">Define a new coupon or voucher reward</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => formik.handleSubmit()} disabled={loading} className="gap-2">
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </Button>
            <Button size="sm" onClick={() => formik.handleSubmit()} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? "Creating..." : "Activate Reward"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Main Form */}
        <div className="md:col-span-2 space-y-5">
          {/* Basic Details */}
          <SectionCard
            icon={Ticket}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            title="Basic Details"
            description="Name and describe your reward coupon"
          >
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g. ₹500 Amazon Gift Card" {...formik.getFieldProps("title")} />
              {err("title")}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="What does the user get? Any special instructions?"
                {...formik.getFieldProps("description")}
              />
              {err("description")}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select onValueChange={(v) => formik.setFieldValue("category", v)} value={formik.values.category}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <ImageUploadWithCrop
                  label="Coupon Image (Optional)"
                  currentImage={formik.values.image}
                  onImageUpdate={(url) => formik.setFieldValue("image", url)}
                  aspectRatio={16 / 9}
                  recommendedWidth={1200}
                  recommendedHeight={675}
                  uploadButtonText="Upload Banner"
                />
              </div>
            </div>
          </SectionCard>

          {/* Reward Settings */}
          <SectionCard
            icon={Settings}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            title="Reward Settings"
            description="Configure the value and cost of the coupon"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tcCost">TC Cost</Label>
                <Input id="tcCost" type="number" placeholder="0" {...formik.getFieldProps("tcCost")} />
                {err("tcCost")}
              </div>
              <div className="space-y-1.5">
                <Label>Discount Type</Label>
                <Select onValueChange={(v) => formik.setFieldValue("discountType", v)} value={formik.values.discountType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flat">Flat Amount</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Access">Access Unlock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input id="discountValue" placeholder="e.g. 100 or 10%" {...formik.getFieldProps("discountValue")} />
                {err("discountValue")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="validityDays">Validity (days after redeem)</Label>
                <Input id="validityDays" type="number" {...formik.getFieldProps("validityDays")} />
                {err("validityDays")}
              </div>
            </div>
          </SectionCard>

          {/* Limits & Controls */}
          <SectionCard
            icon={ShieldCheck}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            title="Limits & Controls"
            description="Set fraud prevention and usage rules"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="totalUsageLimit">Total Usage Limit</Label>
                <Input id="totalUsageLimit" type="number" placeholder="0 = unlimited" {...formik.getFieldProps("totalUsageLimit")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="perUserLimit">Per User Limit</Label>
                <Input id="perUserLimit" type="number" {...formik.getFieldProps("perUserLimit")} />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="minAccountAge">Min Account Age (days)</Label>
                <Input id="minAccountAge" type="number" {...formik.getFieldProps("minAccountAge")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minActivityRequired">Min Activity Points</Label>
                <Input id="minActivityRequired" type="number" {...formik.getFieldProps("minActivityRequired")} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Block Warned Users</Label>
                <p className="text-xs text-muted-foreground">Prevent users with community strikes from redeeming</p>
              </div>
              <Switch
                checked={formik.values.blockWarnedUsers}
                onCheckedChange={(v) => formik.setFieldValue("blockWarnedUsers", v)}
                className="data-[state=checked]:bg-emerald-500 shrink-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cooldownPeriod">Cooldown Period (days)</Label>
              <Input id="cooldownPeriod" type="number" placeholder="Wait time between redemptions" {...formik.getFieldProps("cooldownPeriod")} />
            </div>
          </SectionCard>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card overflow-hidden sticky top-[73px]">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <PackageCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-foreground">Inventory Setup</p>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Inventory Required?</Label>
                  <p className="text-xs text-muted-foreground">Enable for external vouchers (Amazon, etc.)</p>
                </div>
                <Switch
                  checked={formik.values.inventoryRequired}
                  onCheckedChange={(v) => formik.setFieldValue("inventoryRequired", v)}
                  className="data-[state=checked]:bg-emerald-500 shrink-0"
                />
              </div>

              {formik.values.inventoryRequired && (
                <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-800 leading-relaxed">
                  <strong>Note:</strong> You'll be prompted to upload CSV voucher codes after saving.
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Summary</p>
                {[
                  { label: "Cost", value: `${formik.values.tcCost} TC` },
                  { label: "Value", value: formik.values.discountValue ? `${formik.values.discountValue}${formik.values.discountType === "Percentage" ? "%" : ""}` : "—" },
                  { label: "Type", value: formik.values.inventoryRequired ? "External" : "Internal" },
                  { label: "Validity", value: `${formik.values.validityDays} days` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
