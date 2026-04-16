"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Ticket,
  Loader2,
  Save,
  RotateCw,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Info,
  Zap,
  ArrowRight,
  QrCode,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCreateReward } from "@/graphql/actions/rewards";
import { cn } from "@/lib/utils";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

const couponSchema = Yup.object().shape({
  title: Yup.string().required("Give your reward a catchy title"),
  description: Yup.string().required("Tell users what they're getting"),
  tcCost: Yup.number().required("Set a cost in points").min(0),
  discountType: Yup.string().required("Select how the reward works"),
  discountValue: Yup.string().required("Enter the value"),
  validityDays: Yup.number().required("Set an expiration period").min(1),
  totalUsageLimit: Yup.number().min(0),
  perUserLimit: Yup.number().min(1),
  minAccountAge: Yup.number().min(0),
  minActivityRequired: Yup.number().min(0),
});

export default function CreateCouponPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [createReward, { loading }] = useCreateReward();
  const [saved, setSaved] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
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
      rewardMechanism: "COUPON",
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      console.log({
        input: {
          title: values.title,
          description: values.description,
          categoryId: "cat-002", // Default to internal, can be expanded if category selection is added later
          tcCost: values.tcCost,
          inventoryRequired: values.inventoryRequired,
          perUserLimit: values.perUserLimit,
          totalUsageLimit: values.totalUsageLimit,
          minAccountAge: values.minAccountAge,
          minActivityRequired: values.minActivityRequired,
          blockWarnedUsers: values.blockWarnedUsers,
          cooldownPeriod: values.cooldownPeriod,
          image: values.image,
          rewardMechanism: values.rewardMechanism,
        },
      });
      try {
        await createReward({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              categoryId: "cat-002", // Default to internal, can be expanded if category selection is added later
              tcCost: values.tcCost,
              inventoryRequired: values.inventoryRequired,
              perUserLimit: values.perUserLimit,
              totalUsageLimit: values.totalUsageLimit,
              minAccountAge: values.minAccountAge,
              minActivityRequired: values.minActivityRequired,
              blockWarnedUsers: values.blockWarnedUsers,
              cooldownPeriod: values.cooldownPeriod,
              image: values.image,
              rewardMechanism: values.rewardMechanism,
            },
          },
        });
        toast({
          title: "Boom! Reward is live",
          description: `${values.title} has been added to the hub.`,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/rewards/coupons");
        }, 1500);
      } catch (err: any) {
        toast({
          title: "Whoops!",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                <Ticket className="h-5 w-5 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Reward Studio
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Rewards</span>
              <ChevronRight className="h-3 w-3" />
              <span>Coupons</span>
              <ChevronRight className="h-3 w-3" />
              <span>Create New Reward</span>
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form onSubmit={formik.handleSubmit} className="space-y-8">
                {/* Identity & Presentation */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Identity & Presentation
                    </CardTitle>
                    <CardDescription>
                      Give your reward a personality and visual presence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="title"
                            className="text-sm font-medium"
                          >
                            Title <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="title"
                            placeholder="e.g. ₹500 Amazon Gift Card"
                            {...formik.getFieldProps("title")}
                          />
                          {formik.touched.title && formik.errors.title && (
                            <p className="text-xs text-destructive">
                              {formik.errors.title as string}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                          >
                            Description{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="description"
                            rows={4}
                            placeholder="Describe value and redemption steps..."
                            className="resize-none"
                            {...formik.getFieldProps("description")}
                          />
                          {formik.touched.description &&
                            formik.errors.description && (
                              <p className="text-xs text-destructive">
                                {formik.errors.description as string}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Cover Image
                          </Label>
                          <div className="rounded-xl border border-dashed p-1 bg-muted/10">
                            <ImageUploadWithCrop
                              currentImage={formik.values.image}
                              onImageUpdate={(cdnUrl: string, url: string) =>
                                formik.setFieldValue("image", url)
                              }
                              aspectRatio={16 / 9}
                              recommendedWidth={1200}
                              recommendedHeight={675}
                              uploadButtonText="Upload Banner"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Reward Mechanism
                          </Label>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {[
                              { id: "COUPON", label: "Coupon", icon: Ticket },
                              {
                                id: "SPIN_WHEEL",
                                label: "Spin Wheel",
                                icon: RotateCw,
                              },
                              {
                                id: "SCRATCH_CARD",
                                label: "Scratch Card",
                                icon: Sparkles,
                              },
                              {
                                id: "MATCH_AND_WIN",
                                label: "Match & Win",
                                icon: Gamepad2,
                              },
                            ].map((mech) => (
                              <button
                                key={mech.id}
                                type="button"
                                onClick={() =>
                                  formik.setFieldValue(
                                    "rewardMechanism",
                                    mech.id,
                                  )
                                }
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                  formik.values.rewardMechanism === mech.id
                                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                    : "bg-background border-border text-muted-foreground hover:border-foreground",
                                )}
                              >
                                <mech.icon className="h-3.5 w-3.5" />
                                {mech.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Economics */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Economics</CardTitle>
                    <CardDescription>
                      Define cost, type, and validity period.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tcCost" className="text-sm font-medium">
                          Cost (Points)
                        </Label>
                        <Input
                          id="tcCost"
                          type="number"
                          {...formik.getFieldProps("tcCost")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Type</Label>
                        <Select
                          onValueChange={(v) =>
                            formik.setFieldValue("discountType", v)
                          }
                          value={formik.values.discountType}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Flat">Flat Discount</SelectItem>
                            <SelectItem value="Percentage">
                              Percentage %
                            </SelectItem>
                            <SelectItem value="Access">
                              Exclusive Access
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="discountValue"
                          className="text-sm font-medium"
                        >
                          Value
                        </Label>
                        <Input
                          id="discountValue"
                          placeholder="e.g. 500"
                          {...formik.getFieldProps("discountValue")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="validityDays"
                          className="text-sm font-medium"
                        >
                          Validity (Days)
                        </Label>
                        <Input
                          id="validityDays"
                          type="number"
                          {...formik.getFieldProps("validityDays")}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Supply & Delivery */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Supply & Delivery</CardTitle>
                    <CardDescription>
                      Manage stock levels and voucher distribution logic.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold">Voucher Inventory</h4>
                        <p className="text-xs text-muted-foreground">
                          Distribute unique codes (e.g. via post-publish CSV
                          upload)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Manual
                        </span>
                        <Switch
                          checked={formik.values.inventoryRequired}
                          onCheckedChange={(v) =>
                            formik.setFieldValue("inventoryRequired", v)
                          }
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Inventory
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="totalUsageLimit"
                          className="text-sm font-medium"
                        >
                          Global Supply
                        </Label>
                        <Input
                          id="totalUsageLimit"
                          type="number"
                          placeholder="0 = Unlimited"
                          {...formik.getFieldProps("totalUsageLimit")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Total global redemptions allowed.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="perUserLimit"
                          className="text-sm font-medium"
                        >
                          Member Limit
                        </Label>
                        <Input
                          id="perUserLimit"
                          type="number"
                          {...formik.getFieldProps("perUserLimit")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Max claims per individual account.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Eligibility */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden mb-12">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Eligibility Guardrails
                    </CardTitle>
                    <CardDescription>
                      Set requirements to prevent abuse or target specific
                      members.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="minAccountAge"
                        className="text-sm font-medium"
                      >
                        Min Account Age (Days)
                      </Label>
                      <Input
                        id="minAccountAge"
                        type="number"
                        {...formik.getFieldProps("minAccountAge")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="minActivityRequired"
                        className="text-sm font-medium"
                      >
                        Min Activity Points
                      </Label>
                      <Input
                        id="minActivityRequired"
                        type="number"
                        {...formik.getFieldProps("minActivityRequired")}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/5">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">
                          Clean Record
                        </Label>
                        <p className="text-[10px] text-muted-foreground">
                          Require zero active warnings
                        </p>
                      </div>
                      <Switch
                        checked={formik.values.blockWarnedUsers}
                        onCheckedChange={(v) =>
                          formik.setFieldValue("blockWarnedUsers", v)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Sidebar / Preview */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Vibe Check</h3>
                  <Badge
                    variant="outline"
                    className="bg-indigo-500/5 text-indigo-600 border-indigo-500/20"
                  >
                    Live Preview
                  </Badge>
                </div>

                <div className="relative group">
                  {/* Glowing ambient background shadow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* The actual voucher card */}
                  <div className="relative flex flex-col w-full bg-white dark:bg-zinc-950 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-zinc-900 dark:text-zinc-100">
                    {/* Top Section: Banner Image */}
                    <div className="aspect-[4/3] relative bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                      {formik.values.image ? (
                        <img
                          src={formik.values.image}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          alt="Preview Banner"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-zinc-400">
                          <Ticket className="h-12 w-12 opacity-30" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Add Banner Image
                          </span>
                        </div>
                      )}

                      {/* Price Tag Overlay */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1.5 bg-black/80 dark:bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 dark:border-black/10 shadow-lg">
                          <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-white dark:text-black">
                            {formik.values.tcCost || 0} Points
                          </span>
                        </div>
                      </div>

                      {/* Mechanism Icon Overlay */}
                      {["SCRATCH_CARD", "SPIN_WHEEL", "MATCH_AND_WIN"].includes(
                        formik.values.rewardMechanism,
                      ) && (
                        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center border border-indigo-400/50">
                          <Sparkles className="h-4 w-4 text-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Middle Section: Details */}
                    <div className="p-6 pb-8 space-y-4 bg-white dark:bg-zinc-950">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                          {formik.values.rewardMechanism.replace(/_/g, " ")}
                        </p>
                        <h3 className="text-xl font-bold leading-tight line-clamp-2">
                          {formik.values.title || "Untitled Reward Title"}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mt-2">
                          {formik.values.description ||
                            "The description of your reward will appear here. Keep it enticing!"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                            Value
                          </span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {formik.values.discountType === "Percentage" &&
                            formik.values.discountValue
                              ? `${formik.values.discountValue}%`
                              : formik.values.discountValue || "--"}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                            Expires In
                          </span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {formik.values.validityDays} Days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Perforated Divider */}
                    <div className="relative h-4 w-full bg-white dark:bg-zinc-950 flex items-center pb-2">
                      <div className="absolute -left-2 h-4 w-4 rounded-full bg-zinc-50 dark:bg-background border-r border-zinc-200 dark:border-zinc-800 z-10" />
                      <div className="h-[1px] w-full border-t-[2px] border-dashed border-zinc-200 dark:border-zinc-800 mx-3" />
                      <div className="absolute -right-2 h-4 w-4 rounded-full bg-zinc-50 dark:bg-background border-l border-zinc-200 dark:border-zinc-800 z-10" />
                    </div>

                    {/* Bottom Section: Action & QR */}
                    <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between gap-4">
                      <Button
                        disabled
                        className="flex-1 h-12 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25"
                      >
                        Redeem Now
                      </Button>
                      <div className="h-12 w-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
                        <QrCode className="h-6 w-6 text-zinc-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Reward Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Interactive rewards (Spin Wheel) double conversion
                          rates.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Setting a minimum account age reduces reward farming.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Banner images should be 16:9 for consistent display.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Changes"
        description="You have pending changes to this reward."
        buttonText="Publish Reward"
      />
    </div>
  );
}
