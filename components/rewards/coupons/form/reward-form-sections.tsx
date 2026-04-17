import React from "react";
import {
  Ticket,
  Settings,
  ShieldCheck,
  PackageCheck,
  RotateCw,
  Sparkles,
  Gamepad2,
  Target,
  Zap,
  Info,
} from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
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
import { cn } from "@/lib/utils";
import { CreatorSection } from "./creator-section";

interface RewardFormSectionsProps {
  formik: any;
}

export function RewardFormSections({ formik }: RewardFormSectionsProps) {
  const err = (field: string) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-[10px] font-medium text-rose-500 mt-1 dark:text-rose-400">
        {formik.errors[field] as string}
      </p>
    ) : null;

  return (
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
                  onImageUpdate={(url) => formik.setFieldValue("image", url)}
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
              onValueChange={(v) => formik.setFieldValue("discountType", v)}
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
                Upload voucher codes from the Inventory tab in Rewards & Codes
                after saving.
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
  );
}
