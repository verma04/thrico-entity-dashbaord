"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Ticket,
  Settings,
  ShieldCheck,
  PackageCheck,
  Loader2,
  Save,
  Sparkles,
  Zap,
  Info,
  Eye,
  ArrowRight,
  Target,
  Sparkle,
  Dices,
  RotateCw,
  Gamepad2,
  Trash2,
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
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useGetRewardById, useUpdateReward } from "@/graphql/actions/rewards";
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

const CreatorSection = ({
  icon: Icon,
  title,
  subtitle,
  children,
  accent = "indigo",
}: {
  icon: any;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  accent?: "indigo" | "amber" | "rose" | "emerald" | "violet";
}) => {
  const accents = {
    indigo:
      "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    amber:
      "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    violet:
      "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
            accents[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="pl-14 space-y-6">{children}</div>
      <Separator className="ml-14 mt-8 bg-border/50" />
    </div>
  );
};

export default function EditRewardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const rewardId = params?.id as string;

  const { data, loading: fetchLoading } = useGetRewardById(rewardId);
  const [updateReward, { loading }] = useUpdateReward();
  const [saved, setSaved] = React.useState(false);

  const reward = data?.getRewardById;

  const getCategoryName = (category: any): string => {
    if (!category) return "Internal";
    const idToName: Record<string, string> = {
      "cat-001": "Amazon",
      "cat-002": "Internal",
      "cat-003": "Event",
      "cat-004": "Brand",
      "cat-005": "Scratch Card",
      "cat-006": "Spin Wheel",
      "cat-007": "Match & Win",
    };
    if (typeof category === "string") return idToName[category] || category;
    return idToName[category.id] || category.name || "Internal";
  };

  const formik = useFormik({
    initialValues: {
      title: reward?.title || "",
      description: reward?.description || "",
      tcCost: reward?.tcCost || 0,
      discountType: reward?.discountType || "Flat",
      discountValue: reward?.discountValue || "",
      validityDays: reward?.validityDays || 30,
      totalUsageLimit: reward?.totalUsageLimit || 0,
      perUserLimit: reward?.perUserLimit || 1,
      minAccountAge: reward?.minAccountAge || 0,
      minActivityRequired: reward?.minActivityRequired || 0,
      blockWarnedUsers: reward?.blockWarnedUsers || false,
      cooldownPeriod: reward?.cooldownPeriod || 0,
      inventoryRequired: reward?.inventoryRequired || false,
      image: reward?.image || "",
      rewardMechanism: reward?.rewardMechanism || "COUPON",
      status: reward?.status || "ACTIVE",
      isActive: reward?.isActive ?? true,
    },
    validationSchema: couponSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateReward({
          variables: {
            updateRewardId: rewardId,
            input: {
              title: values.title,
              description: values.description,
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
              status: values.status,
              isActive: values.isActive,
            },
          },
        });
        toast({
          title: "Reward updated",
          description: `${values.title} has been saved.`,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/rewards/coupons");
        }, 1500);
      } catch (err: any) {
        toast({
          title: "Update failed",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  const err = (field: keyof typeof formik.errors) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-[10px] font-medium text-rose-500 mt-1 dark:text-rose-400">
        {formik.errors[field] as string}
      </p>
    ) : null;

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black/5">
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="h-4 w-px bg-border/50" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                  <div className="pl-14 space-y-4">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Skeleton className="aspect-[3/4] w-full rounded-[32px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto border border-border">
            <Ticket className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Reward not found
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              This reward may have been deleted or the link is invalid.
            </p>
          </div>
          <Link href="/rewards/coupons">
            <Button variant="outline" className="rounded-full px-6 gap-2">
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to rewards
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black/5 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/rewards/coupons">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="h-4 w-px bg-border/50" />
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <h1 className="text-sm font-bold tracking-tight">
                  Edit Reward
                </h1>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Editing · {reward.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Form */}
          <div className="space-y-12">
            {/* 1. Identity */}
            <CreatorSection
              icon={Ticket}
              title="Identity & Presentation"
              subtitle="Update what members see when browsing rewards."
              accent="indigo"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. ₹500 Amazon Gift Card"
                      className="bg-white dark:bg-muted/10 border-border/40 focus:ring-1 focus:ring-indigo-500/20"
                      {...formik.getFieldProps("title")}
                    />
                    {err("title")}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Detailed Description
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder="Describe the value and instructions..."
                      className="bg-white dark:bg-muted/10 border-border/40 resize-none"
                      {...formik.getFieldProps("description")}
                    />
                    {err("description")}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Reward Mechanism
                    </Label>
                    <div className="flex flex-wrap gap-2">
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
                      ].map((mech) => {
                        const MechIcon = mech.icon;
                        return (
                          <button
                            key={mech.id}
                            type="button"
                            onClick={() =>
                              formik.setFieldValue("rewardMechanism", mech.id)
                            }
                            className={cn(
                              "flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold transition-all border",
                              formik.values.rewardMechanism === mech.id
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.05]"
                                : "bg-white dark:bg-muted/10 border-border/40 text-muted-foreground hover:border-border",
                            )}
                          >
                            <MechIcon
                              className={cn(
                                "h-3 w-3",
                                formik.values.rewardMechanism === mech.id &&
                                  "animate-pulse",
                              )}
                            />
                            {mech.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Cover Image
                    </Label>
                    <div className="rounded-xl border border-dashed border-border/60 p-1 bg-white dark:bg-black/5 overflow-hidden">
                      <ImageUploadWithCrop
                        currentImage={formik.values.image}
                        onImageUpdate={(url) =>
                          formik.setFieldValue("image", url)
                        }
                        aspectRatio={16 / 9}
                        recommendedWidth={1200}
                        recommendedHeight={675}
                        uploadButtonText="Change Banner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CreatorSection>

            {/* 2. Economics */}
            <CreatorSection
              icon={Settings}
              title="Reward Economics"
              subtitle="Adjust the value, cost, and validity period."
              accent="amber"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="tcCost"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Price (TC)
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                      TC
                    </div>
                    <Input
                      id="tcCost"
                      type="number"
                      className="pl-9 bg-white dark:bg-muted/10 border-border/40"
                      {...formik.getFieldProps("tcCost")}
                    />
                  </div>
                  {err("tcCost")}
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Type
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      formik.setFieldValue("discountType", v)
                    }
                    value={formik.values.discountType}
                  >
                    <SelectTrigger className="bg-white dark:bg-muted/10 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat Discount</SelectItem>
                      <SelectItem value="Percentage">Percentage %</SelectItem>
                      <SelectItem value="Access">Exclusive Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="discountValue"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Value
                  </Label>
                  <Input
                    id="discountValue"
                    placeholder="e.g. 500"
                    className="bg-white dark:bg-muted/10 border-border/40"
                    {...formik.getFieldProps("discountValue")}
                  />
                  {err("discountValue")}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="validityDays"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Validity (Days)
                  </Label>
                  <Input
                    id="validityDays"
                    type="number"
                    className="bg-white dark:bg-muted/10 border-border/40"
                    {...formik.getFieldProps("validityDays")}
                  />
                  {err("validityDays")}
                </div>
              </div>
            </CreatorSection>

            {/* 3. Delivery */}
            <CreatorSection
              icon={PackageCheck}
              title="Delivery & Supply"
              subtitle="Manage stock tracking and redemption limits."
              accent="emerald"
            >
              <div className="bg-white dark:bg-muted/5 rounded-2xl border border-border/40 p-6 space-y-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-foreground">
                      Supply Chain Type
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Toggle on if you provide unique voucher codes via CSV.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/20 px-4 py-2 rounded-full border border-border/30">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        !formik.values.inventoryRequired
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-muted-foreground",
                      )}
                    >
                      Manual
                    </span>
                    <Switch
                      checked={formik.values.inventoryRequired}
                      onCheckedChange={(v) =>
                        formik.setFieldValue("inventoryRequired", v)
                      }
                      className="data-[state=checked]:bg-emerald-500"
                    />
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        formik.values.inventoryRequired
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground",
                      )}
                    >
                      Inventory
                    </span>
                  </div>
                </div>

                {formik.values.inventoryRequired && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20">
                    <Info className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                      Upload voucher codes from the Inventory tab in Rewards &
                      Codes after saving.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label
                      htmlFor="totalUsageLimit"
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Total Supply
                    </Label>
                    <Input
                      id="totalUsageLimit"
                      type="number"
                      placeholder="0 = Unlimited"
                      className="bg-white dark:bg-muted/10 border-border/40"
                      {...formik.getFieldProps("totalUsageLimit")}
                    />
                    <p className="text-[9px] text-muted-foreground">
                      Maximum redemptions globally. 0 = unlimited.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="perUserLimit"
                      className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Limit Per Member
                    </Label>
                    <Input
                      id="perUserLimit"
                      type="number"
                      className="bg-white dark:bg-muted/10 border-border/40"
                      {...formik.getFieldProps("perUserLimit")}
                    />
                    <p className="text-[9px] text-muted-foreground">
                      Times a single user can claim this.
                    </p>
                  </div>
                </div>
              </div>
            </CreatorSection>

            {/* 4. Safeguards */}
            <CreatorSection
              icon={ShieldCheck}
              title="Eligibility & Guardrails"
              subtitle="Control who can redeem and prevent abuse."
              accent="rose"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-muted/5 rounded-2xl border border-border/40 p-5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-rose-500" />
                  </div>
                  <Label
                    htmlFor="minAccountAge"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block pt-2"
                  >
                    Min Account Age
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="minAccountAge"
                      type="number"
                      className="h-8 text-xs bg-muted/10"
                      {...formik.getFieldProps("minAccountAge")}
                    />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Days
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-muted/5 rounded-2xl border border-border/40 p-5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-emerald-500" />
                  </div>
                  <Label
                    htmlFor="minActivityRequired"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block pt-2"
                  >
                    Min Activity
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="minActivityRequired"
                      type="number"
                      className="h-8 text-xs bg-muted/10"
                      {...formik.getFieldProps("minActivityRequired")}
                    />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Points
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-muted/5 rounded-2xl border border-border/40 p-5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Block Suspects
                    </Label>
                    <p className="text-[9px] text-muted-foreground">
                      Require no active community strikes.
                    </p>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <Switch
                      checked={formik.values.blockWarnedUsers}
                      onCheckedChange={(v) =>
                        formik.setFieldValue("blockWarnedUsers", v)
                      }
                      className="data-[state=checked]:bg-rose-500"
                    />
                  </div>
                </div>
              </div>
            </CreatorSection>
          </div>

          {/* Sticky Preview */}
          <div className="relative">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Live Preview
                  </span>
                </div>
                <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-20" />
              </div>

              {/* Phone-style preview */}
              <div className="relative aspect-[3/4] w-full max-w-[340px] mx-auto group">
                <div className="absolute inset-0 bg-amber-500/10 blur-[60px] rounded-full group-hover:bg-amber-500/20 transition-all duration-700" />

                <div className="relative h-full w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-white/40 dark:border-white/5 overflow-hidden flex flex-col p-2">
                  <div className="flex-1 rounded-[24px] bg-[#f8f9ff] dark:bg-black/40 overflow-hidden flex flex-col">
                    {/* Header Image */}
                    <div className="h-[200px] w-full bg-muted relative">
                      {formik.values.image ? (
                        <img
                          src={formik.values.image}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/10">
                          <Ticket className="h-8 w-8 text-indigo-400 opacity-20" />
                          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-2">
                            No Image
                          </p>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/80 dark:bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                          <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="text-[12px] font-bold text-white dark:text-black leading-none">
                            {formik.values.tcCost || 0} Points
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-50">
                              {formik.values.rewardMechanism
                                ? String(formik.values.rewardMechanism).replace(/_/g, " ")
                                : "COUPON"}
                            </span>
                            {[
                              "SCRATCH_CARD",
                              "SPIN_WHEEL",
                              "MATCH_AND_WIN",
                            ].includes(String(formik.values.rewardMechanism)) && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-[8px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tighter">
                                <Sparkle className="h-2 w-2 fill-current" />
                                Interactive
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
                            {formik.values.title || "Your Reward Title"}
                          </h3>
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                          {formik.values.description ||
                            "Description will appear here."}
                        </p>

                        <div className="flex items-center gap-4 py-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                              Expires
                            </span>
                            <span className="text-[10px] font-bold">
                              {formik.values.validityDays} Days
                            </span>
                          </div>
                          <div className="h-4 w-px bg-border/40" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                              Supply
                            </span>
                            <span className="text-[10px] font-bold">
                              {formik.values.totalUsageLimit || "∞"} Units
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Button className="w-full h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 group/btn shadow-lg shadow-indigo-500/20">
                          Redeem Now
                          <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta info */}
              <div className="bg-white dark:bg-muted/5 rounded-2xl border border-border/40 p-5 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Reward Info
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium text-foreground">
                      {reward.createdAt
                        ? new Date(reward.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last updated</span>
                    <span className="font-medium text-foreground">
                      {reward.updatedAt
                        ? new Date(reward.updatedAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                        reward.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          reward.isActive
                            ? "bg-emerald-500"
                            : "bg-muted-foreground",
                        )}
                      />
                      {reward.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Inventory tracking
                    </span>
                    <span className="font-medium text-foreground">
                      {formik.values.inventoryRequired ? "On" : "Off"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Changes"
        description="You have pending changes to this reward."
        buttonText="Save Changes"
      />
    </div>
  );
}
