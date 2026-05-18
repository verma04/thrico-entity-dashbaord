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
  Upload,
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
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import Link from "next/link";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { useUploadVouchers } from "@/graphql/actions/rewards";
import { Button } from "@/components/ui/button";

interface RewardFormSectionsProps {
  formik: any;
  rewardId?: string;
}

export function RewardFormSections({
  formik,
  rewardId,
}: RewardFormSectionsProps) {
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();
  const { toast } = useToast();

  const [uploadStep, setUploadStep] = React.useState<
    "idle" | "validating" | "summary"
  >("idle");
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [validCount, setValidCount] = React.useState(0);
  const [uploadData, setUploadData] = React.useState<any[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setUploadStep("validating");

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        if (lines.length < 2) {
          setUploadData([]);
          setValidCount(0);
          setUploadStep("summary");
          return;
        }

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const codeIndex = headers.indexOf("code");
        const cardIndex = headers.indexOf("cardnumber");
        const pinIndex = headers.indexOf("pin");

        const data = lines.slice(1).map(line => {
          const parts = line.split(",").map(p => p.trim());
          const code = codeIndex !== -1 ? parts[codeIndex] : parts[0];
          const cardNumber = cardIndex !== -1 ? parts[cardIndex] : undefined;
          const pin = pinIndex !== -1 ? parts[pinIndex] : undefined;
          return {
            code: code || "",
            cardNumber: cardNumber || null,
            pin: pin || null,
          };
        }).filter(item => item.code);

        setUploadData(data);
        setValidCount(data.length);
        setUploadStep("summary");
      };
      reader.readAsText(file);
    }, 1200);
  };

  const downloadTemplate = () => {
    const csvContent = "code,cardNumber,pin\nVOUCHER-123,6034123456789999,847291\nVOUCHER-456,,";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vouchers_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmUpload = async () => {
    try {
      await uploadVouchers({
        variables: {
          input: {
            rewardId,
            vouchers: uploadData,
          },
        },
      });
      toast({
        title: "Dynamic Ingestion Successful",
        description: `${validCount} vouchers have been localized.`,
      });
      resetUpload();
    } catch {
      toast({
        title: "Ingestion Failure",
        variant: "destructive",
      });
    }
  };

  const resetUpload = () => {
    setUploadStep("idle");
    setUploadedFile(null);
    setValidCount(0);
    setUploadData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName ||
    "Your currency name";
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

            <div className="space-y-2">
              <Label
                htmlFor="url"
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Reward URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/reward"
                className="bg-white dark:bg-muted/10 border-border/40 focus:ring-1 focus:ring-indigo-500/20"
                {...formik.getFieldProps("url")}
              />
              {err("url")}
            </div>
          </div>

          <div className="space-y-6">
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

            <div className="bg-white dark:bg-muted/5 rounded-2xl border border-border/40 p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-0.5">
                <Label
                  htmlFor="isActive"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block"
                >
                  Active Status
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Allow members to view and redeem this reward.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formik.values.isActive}
                onCheckedChange={(checked) => {
                  formik.setFieldValue("isActive", checked);
                  formik.setFieldValue(
                    "status",
                    checked ? "ACTIVE" : "INACTIVE",
                  );
                }}
              />
            </div>
          </div>
        </div>

        {/* Full-width Claim Instructions */}
        <div className="space-y-2 mt-8 pt-6 border-t border-border/25">
          <Label
            htmlFor="howToClaim"
            className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block"
          >
            How to Claim Instructions
          </Label>
          <RichTextEditor
            value={formik.values.howToClaim || ""}
            onChange={(val) => formik.setFieldValue("howToClaim", val)}
            placeholder="Step-by-step instructions on how users can claim or redeem this reward..."
            minHeight="140px"
          />
          {err("howToClaim")}
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
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"
            >
              Price ({currencyName})
              <Link
                href="/currency/economics"
                target="_blank"
                title={`Manage ${currencyName} Economics`}
              >
                <Info className="h-3 w-3 text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer" />
              </Link>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">
                {currencyName.substring(0, 3).toUpperCase()}
              </div>
              <Input
                id="tcCost"
                type="number"
                min={1}
                className={cn(
                  "pl-10 bg-white dark:bg-muted/10 border-border/40",
                  formik.touched.tcCost && formik.errors.tcCost
                    ? "border-rose-400 focus:ring-rose-500/20"
                    : "",
                )}
                {...formik.getFieldProps("tcCost")}
              />
            </div>
            {err("tcCost")}
            {!formik.errors.tcCost && (
              <p className="text-[9px] text-muted-foreground">
                Min. 1 {currencyName} — cannot be free.
              </p>
            )}
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
              name="validityDays"
              value={formik.values.validityDays}
              onChange={(e) => {
                formik.handleChange(e);
                const days = parseInt(e.target.value, 10);
                if (!isNaN(days)) {
                  const date = new Date();
                  date.setDate(date.getDate() + days);
                  // Adjust for local timezone
                  const offset = date.getTimezoneOffset() * 60000;
                  const localISOTime = new Date(date.getTime() - offset)
                    .toISOString()
                    .slice(0, 16);
                  formik.setFieldValue("expiryDate", localISOTime);
                } else {
                  formik.setFieldValue("expiryDate", "");
                }
              }}
              onBlur={formik.handleBlur}
            />
            {err("validityDays")}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="expiryDate"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Expiry Date
            </Label>
            <Input
              id="expiryDate"
              type="datetime-local"
              className="bg-white dark:bg-muted/10 border-border/40"
              name="expiryDate"
              value={formik.values.expiryDate}
              onClick={(e) => {
                try {
                  (e.target as any).showPicker();
                } catch (err) {
                  // Ignore if unsupported
                }
              }}
              onChange={(e) => {
                formik.handleChange(e);
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    const now = new Date();
                    const diffTime = date.getTime() - now.getTime();
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24),
                    );
                    formik.setFieldValue(
                      "validityDays",
                      diffDays > 0 ? diffDays : 0,
                    );
                  }
                } else {
                  formik.setFieldValue("validityDays", "");
                }
              }}
              onBlur={formik.handleBlur}
            />
            {err("expiryDate")}
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
          <div className="space-y-8">
            {/* 1. Reward Mechanism Area */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-[12px] font-bold text-foreground uppercase tracking-wider">
                    1. Reward Mechanism
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Choose how members can earn or claim this reward.
                  </p>
                </div>
                {/* Select All toggle */}
                {(() => {
                  const ALL_IDS = [
                    "COUPON",
                    "SPIN_WHEEL",
                    "SCRATCH_CARD",
                    "MATCH_AND_WIN",
                  ];
                  const selected: string[] = Array.isArray(
                    formik.values.rewardMechanism,
                  )
                    ? formik.values.rewardMechanism
                    : formik.values.rewardMechanism
                      ? [formik.values.rewardMechanism]
                      : [];
                  const allSelected = ALL_IDS.every((id) =>
                    selected.includes(id),
                  );
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (allSelected) {
                          formik.setFieldValue("rewardMechanism", ["COUPON"]);
                        } else {
                          formik.setFieldValue("rewardMechanism", ALL_IDS);
                          formik.setFieldValue("couponType", "ONE_TO_MANY");
                          formik.setFieldValue("inventoryRequired", false);
                          formik.setFieldValue("totalUsageLimit", 0);
                          formik.setFieldValue("perUserLimit", 0);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border shrink-0",
                        allSelected
                          ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 border-transparent text-white shadow-md"
                          : "bg-white dark:bg-muted/10 border-border/40 text-muted-foreground hover:border-indigo-300 hover:text-indigo-600",
                      )}
                    >
                      <Zap className="h-2.5 w-2.5" />
                      {allSelected ? "All Selected" : "Select All"}
                    </button>
                  );
                })()}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(
                  [
                    {
                      id: "COUPON",
                      label: "Coupon",
                      icon: Ticket,
                      activeClass: "bg-indigo-600 border-indigo-600",
                    },
                    {
                      id: "SPIN_WHEEL",
                      label: "Spin Wheel",
                      icon: RotateCw,
                      activeClass: "bg-violet-600 border-violet-600",
                    },
                    {
                      id: "SCRATCH_CARD",
                      label: "Scratch Card",
                      icon: Sparkles,
                      activeClass: "bg-amber-500 border-amber-500",
                    },
                    {
                      id: "MATCH_AND_WIN",
                      label: "Match & Win",
                      icon: Gamepad2,
                      activeClass: "bg-rose-600 border-rose-600",
                    },
                  ] as const
                ).map((mech) => {
                  const MechIcon = mech.icon;
                  const selected: string[] = Array.isArray(
                    formik.values.rewardMechanism,
                  )
                    ? formik.values.rewardMechanism
                    : formik.values.rewardMechanism
                      ? [formik.values.rewardMechanism]
                      : [];
                  const isActive = selected.includes(mech.id);
                  return (
                    <button
                      key={mech.id}
                      type="button"
                      onClick={() => {
                        const current: string[] = Array.isArray(
                          formik.values.rewardMechanism,
                        )
                          ? formik.values.rewardMechanism
                          : formik.values.rewardMechanism
                            ? [formik.values.rewardMechanism]
                            : [];
                        if (isActive && current.length > 1) {
                          formik.setFieldValue(
                            "rewardMechanism",
                            current.filter((v) => v !== mech.id),
                          );
                        } else if (!isActive) {
                          formik.setFieldValue("rewardMechanism", [
                            ...current,
                            mech.id,
                          ]);
                          if (
                            [
                              "SPIN_WHEEL",
                              "SCRATCH_CARD",
                              "MATCH_AND_WIN",
                            ].includes(mech.id)
                          ) {
                            formik.setFieldValue("couponType", "ONE_TO_MANY");
                            formik.setFieldValue("inventoryRequired", false);
                            formik.setFieldValue("totalUsageLimit", 0);
                            formik.setFieldValue("perUserLimit", 0);
                          }
                        }
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold transition-all border",
                        isActive
                          ? cn(
                              mech.activeClass,
                              "text-white shadow-md scale-[1.05]",
                            )
                          : "bg-white dark:bg-muted/10 border-border/40 text-muted-foreground hover:border-border",
                      )}
                    >
                      <MechIcon
                        className={cn("h-3 w-3", isActive && "animate-pulse")}
                      />
                      {mech.label}
                    </button>
                  );
                })}
              </div>

              {/* Per-mechanism description callouts */}
              {(() => {
                const ALL_IDS = [
                  "COUPON",
                  "SPIN_WHEEL",
                  "SCRATCH_CARD",
                  "MATCH_AND_WIN",
                ];
                const selected: string[] = Array.isArray(
                  formik.values.rewardMechanism,
                )
                  ? formik.values.rewardMechanism
                  : formik.values.rewardMechanism
                    ? [formik.values.rewardMechanism]
                    : [];

                const mechanismInfo: Record<string, any> = {
                  COUPON: {
                    label: "Standard Coupon",
                    icon: Ticket,
                    desc: "A redeemable coupon code members claim directly from the Rewards hub.",
                    bg: "bg-indigo-50/60 dark:bg-indigo-500/10",
                    border: "border-indigo-100 dark:border-indigo-500/20",
                    iconColor: "text-indigo-600",
                  },
                  SPIN_WHEEL: {
                    label: "Spin Wheel Prize",
                    icon: RotateCw,
                    desc: "Available as a prize tier in the Spin Wheel game.",
                    bg: "bg-violet-50/60 dark:bg-violet-500/10",
                    border: "border-violet-100 dark:border-violet-500/20",
                    iconColor: "text-violet-600",
                  },
                  SCRATCH_CARD: {
                    label: "Scratch Card Prize",
                    icon: Sparkles,
                    desc: "Distributed via the Scratch Card game.",
                    bg: "bg-amber-50/60 dark:bg-amber-500/10",
                    border: "border-amber-100 dark:border-amber-500/20",
                    iconColor: "text-amber-600",
                  },
                  MATCH_AND_WIN: {
                    label: "Match & Win Prize",
                    icon: Gamepad2,
                    desc: "Awarded through the Match & Win slot-style game.",
                    bg: "bg-rose-50/60 dark:bg-rose-500/10",
                    border: "border-rose-100 dark:border-rose-500/20",
                    iconColor: "text-rose-600",
                  },
                };
                const visibleIds = ALL_IDS.filter((id) =>
                  selected.includes(id),
                );
                if (visibleIds.length === 0) return null;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {visibleIds.map((id) => {
                      const info = mechanismInfo[id];
                      if (!info) return null;
                      const MechIcon = info.icon;
                      return (
                        <div
                          key={id}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl border",
                            info.bg,
                            info.border,
                          )}
                        >
                          <div
                            className={cn(
                              "h-6 w-6 rounded-lg flex items-center justify-center shrink-0 bg-white/70 dark:bg-black/20 border border-white/50",
                              info.border,
                            )}
                          >
                            <MechIcon
                              className={cn("h-3 w-3", info.iconColor)}
                            />
                          </div>
                          <div className="space-y-0.5">
                            <p
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                info.iconColor,
                              )}
                            >
                              {info.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {info.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="w-full h-px bg-border/40" />

            {/* 2. Code Configuration Area */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-[12px] font-bold text-foreground uppercase tracking-wider">
                    2. Code Configuration
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    One to One: Unique voucher codes (Coupons only). One to
                    Many: Single global code.
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1.5 w-full sm:w-64 shrink-0">
                  <Select
                    value={formik.values.couponType}
                    onValueChange={(v) => {
                      formik.setFieldValue("couponType", v);
                      formik.setFieldValue(
                        "inventoryRequired",
                        v === "ONE_TO_ONE",
                      );
                      if (v === "ONE_TO_ONE") {
                        formik.setFieldValue("couponCode", "");
                        const selected = Array.isArray(
                          formik.values.rewardMechanism,
                        )
                          ? formik.values.rewardMechanism
                          : formik.values.rewardMechanism
                            ? [formik.values.rewardMechanism]
                            : [];
                        const updated = selected.filter(
                          (m: string) =>
                            ![
                              "SPIN_WHEEL",
                              "SCRATCH_CARD",
                              "MATCH_AND_WIN",
                            ].includes(m),
                        );
                        formik.setFieldValue(
                          "rewardMechanism",
                          updated.length > 0 ? updated : ["COUPON"],
                        );
                      }
                    }}
                    disabled={(() => {
                      const selected = Array.isArray(
                        formik.values.rewardMechanism,
                      )
                        ? formik.values.rewardMechanism
                        : formik.values.rewardMechanism
                          ? [formik.values.rewardMechanism]
                          : [];
                      return selected.length === 0;
                    })()}
                  >
                    <SelectTrigger className="bg-white dark:bg-muted/10 border-border/40 text-[11px] font-bold h-9">
                      <SelectValue placeholder="Select mechanism first" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_TO_ONE" className="text-[11px]">
                        One to One (Inventory)
                      </SelectItem>
                      <SelectItem value="ONE_TO_MANY" className="text-[11px]">
                        One to Many (Manual)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {(() => {
                    const selected = Array.isArray(
                      formik.values.rewardMechanism,
                    )
                      ? formik.values.rewardMechanism
                      : formik.values.rewardMechanism
                        ? [formik.values.rewardMechanism]
                        : [];
                    if (selected.length === 0) {
                      return (
                        <p className="text-[9px] text-amber-600/80 dark:text-amber-500/80 text-right pr-2">
                          Please select a mechanism first.
                        </p>
                      );
                    }
                    if (
                      selected.some((m: string) =>
                        [
                          "SPIN_WHEEL",
                          "SCRATCH_CARD",
                          "MATCH_AND_WIN",
                        ].includes(m),
                      )
                    ) {
                      return (
                        <p className="text-[9px] text-amber-600/80 dark:text-amber-500/80 text-right pr-2">
                          Games use One-to-Many. Selecting One-to-One will
                          remove games.
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {formik.values.couponType === "ONE_TO_MANY" && (
                <div className="bg-white dark:bg-muted/5 rounded-xl border border-border/40 p-4 space-y-3">
                  <Label
                    htmlFor="couponCode"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Global Coupon Code
                  </Label>
                  <div className="max-w-xs">
                    <Input
                      id="couponCode"
                      placeholder="e.g. SUMMER50"
                      className="bg-white dark:bg-muted/10 border-border/40 focus:ring-1 focus:ring-indigo-500/20 h-9"
                      {...formik.getFieldProps("couponCode")}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Enter the single code that all members will use to redeem
                    this reward.
                  </p>
                  {err("couponCode")}
                </div>
              )}

              {rewardId && formik.values.couponType === "ONE_TO_ONE" && (
                <div className="bg-white dark:bg-muted/5 rounded-xl border border-border/40 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Voucher Code Inventory
                      </Label>
                      <p className="text-[10px] text-muted-foreground">
                        Upload a CSV file containing unique voucher codes for
                        this reward.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={downloadTemplate}
                      className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50/50 h-7 px-2.5 rounded-lg shrink-0"
                    >
                      Get CSV Template
                    </Button>
                  </div>

                  {uploadStep === "idle" ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                      className={cn(
                        "border-2 border-dashed border-border/60 hover:border-indigo-500/40 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-zinc-50/40 dark:bg-black/5 hover:bg-indigo-500/[0.01]",
                        isDragging && "border-indigo-500 bg-indigo-500/[0.02]",
                      )}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        accept=".csv,.txt"
                        className="hidden"
                      />
                      <Upload className="h-6 w-6 text-indigo-500 mb-2 opacity-60" />
                      <p className="text-[11px] font-bold text-foreground">
                        Drag & drop your CSV file here, or{" "}
                        <span className="text-indigo-600">browse</span>
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-1">
                        Accepts .csv and .txt (each line is a voucher code)
                      </p>
                    </div>
                  ) : uploadStep === "validating" ? (
                    <div className="border border-border/40 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50/20">
                      <RotateCw className="h-5 w-5 text-indigo-600 animate-spin mb-2" />
                      <p className="text-[11px] font-bold text-foreground">
                        Analyzing codes...
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-1">
                        Parsing data structure and compiling codes.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-border/40 rounded-xl p-5 space-y-4 bg-zinc-50/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-emerald-500" />
                          <span className="text-[11px] font-bold text-foreground truncate max-w-[200px]">
                            {uploadedFile?.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={resetUpload}
                          className="text-[9px] font-bold text-muted-foreground uppercase hover:bg-muted h-7 px-2"
                        >
                          Reset
                        </Button>
                      </div>

                      <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg p-3 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">
                          Valid codes found:
                        </span>
                        <span className="font-black text-emerald-600 text-xs tabular-nums">
                          {validCount}
                        </span>
                      </div>

                      <Button
                        type="button"
                        onClick={confirmUpload}
                        disabled={uploading}
                        className="w-full h-9 rounded-xl text-xs font-bold gap-2 shadow-sm"
                      >
                        {uploading && (
                          <RotateCw className="h-3 w-3 animate-spin" />
                        )}
                        Confirm and Load {validCount} Vouchers
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {formik.values.inventoryRequired && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20">
                  <Info className="h-4 w-4 text-indigo-500 mt-0.5" />
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                    Since you've selected <strong>One to One</strong>, you'll
                    need to upload unique voucher codes from the Inventory tab
                    in Rewards & Codes after saving.
                  </p>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-border/40" />

            {/* 3. Limits Area */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-[12px] font-bold text-foreground uppercase tracking-wider">
                  3. Redemption Limits
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Set caps to prevent over-redemption. Disabled for game
                  rewards.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-white dark:bg-muted/5 rounded-xl border border-border/40 p-4 space-y-3">
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
                    disabled={(() => {
                      const selected = Array.isArray(
                        formik.values.rewardMechanism,
                      )
                        ? formik.values.rewardMechanism
                        : formik.values.rewardMechanism
                          ? [formik.values.rewardMechanism]
                          : [];
                      return selected.some((m: string) =>
                        [
                          "SPIN_WHEEL",
                          "SCRATCH_CARD",
                          "MATCH_AND_WIN",
                        ].includes(m),
                      );
                    })()}
                    className="bg-muted/10 border-border/40 disabled:opacity-50 h-9"
                    {...formik.getFieldProps("totalUsageLimit")}
                  />
                  <p className="text-[9px] text-muted-foreground">
                    Maximum redemptions globally. 0 = unlimited.
                  </p>
                </div>
                <div className="bg-white dark:bg-muted/5 rounded-xl border border-border/40 p-4 space-y-3">
                  <Label
                    htmlFor="perUserLimit"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Limit Per Member
                  </Label>
                  <Input
                    id="perUserLimit"
                    type="number"
                    disabled={(() => {
                      const selected = Array.isArray(
                        formik.values.rewardMechanism,
                      )
                        ? formik.values.rewardMechanism
                        : formik.values.rewardMechanism
                          ? [formik.values.rewardMechanism]
                          : [];
                      return selected.some((m: string) =>
                        [
                          "SPIN_WHEEL",
                          "SCRATCH_CARD",
                          "MATCH_AND_WIN",
                        ].includes(m),
                      );
                    })()}
                    className="bg-muted/10 border-border/40 disabled:opacity-50 h-9"
                    {...formik.getFieldProps("perUserLimit")}
                  />
                  <p className="text-[9px] text-muted-foreground">
                    Times a single user can claim this.
                  </p>
                </div>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </CreatorSection>
    </div>
  );
}
