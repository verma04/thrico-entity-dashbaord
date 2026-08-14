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
  Link as LinkIcon,
  Layers,
  Coins,
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
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import Link from "next/link";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import {
  useUploadVouchers,
  useGetVoucher,
  useGetVouchers,
} from "@/graphql/actions/rewards";
import { Button } from "@/components/ui/button";
import {
  PolarisFormCard,
  PolarisPresetChips,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";

interface RewardFormSectionsProps {
  formik: any;
  rewardId?: string;
}

const COST_PRESETS = [10, 50, 100, 250, 500];

export function RewardFormSections({
  formik,
  rewardId,
}: RewardFormSectionsProps) {
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();
  const { data: voucherData } = useGetVoucher(rewardId || "");
  const { data: vouchersListData } = useGetVouchers({
    rewardId: rewardId || "",
    pagination: { page: 1, limit: 100 },
  });
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
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          setUploadData([]);
          setValidCount(0);
          setUploadStep("summary");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const codeIndex = headers.indexOf("code");
        const cardIndex = headers.indexOf("cardnumber");
        const pinIndex = headers.indexOf("pin");

        const data = lines
          .slice(1)
          .map((line) => {
            const parts = line.split(",").map((p) => p.trim());
            const code = codeIndex !== -1 ? parts[codeIndex] : parts[0];
            const cardNumber = cardIndex !== -1 ? parts[cardIndex] : undefined;
            const pin = pinIndex !== -1 ? parts[pinIndex] : undefined;
            return {
              code: code || "",
              cardNumber: cardNumber || null,
              pin: pin || null,
            };
          })
          .filter((item) => item.code);

        setUploadData(data);
        setValidCount(data.length);
        setUploadStep("summary");
      };
      reader.readAsText(file);
    }, 1200);
  };

  const downloadTemplate = () => {
    const csvContent =
      "code,cardNumber,pin\nVOUCHER-123,6034123456789999,847291\nVOUCHER-456,,";
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
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";
  const err = (field: string) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-[11px] font-medium text-rose-500 mt-1 dark:text-rose-400">
        {formik.errors[field] as string}
      </p>
    ) : null;

  return (
    <div className="space-y-6">
      {/* 1. Identity & Presentation */}
      <PolarisFormCard
        step={1}
        title="Identity & Presentation"
        description="Define what members see when browsing rewards in your community catalog."
        badge="Reward Info"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Title, Description, URL */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Reward Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. ₹500 Amazon Gift Card, 20% Off Merch"
                className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none font-medium"
                {...formik.getFieldProps("title")}
              />
              {err("title")}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Detailed Description
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe what members receive and highlight key terms..."
                className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none resize-none leading-relaxed"
                {...formik.getFieldProps("description")}
              />
              {err("description")}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="url"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Reward URL (Optional)
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://yourstore.com/redeem"
                  className="pl-10 h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none text-xs font-medium"
                  {...formik.getFieldProps("url")}
                />
              </div>
              {err("url")}
            </div>
          </div>

          {/* Right Column: Banner & Active Switch */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Cover Banner
              </Label>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-1 bg-zinc-50/50 dark:bg-zinc-800/30 overflow-hidden">
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

            <div className="bg-zinc-50/50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="isActive"
                  className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block cursor-pointer"
                >
                  Active in Catalog
                </Label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Allow members to view and claim.
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

        {/* Claim Instructions */}
        <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Label
            htmlFor="howToClaim"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block"
          >
            How to Claim Instructions
          </Label>
          <RichTextEditor
            value={formik.values.howToClaim || ""}
            onChange={(val) => formik.setFieldValue("howToClaim", val)}
            placeholder="Step-by-step instructions on how members can claim or redeem this reward..."
            minHeight="130px"
          />
          {err("howToClaim")}
        </div>
      </PolarisFormCard>

      {/* 2. Reward Economics */}
      <PolarisFormCard
        step={2}
        title="Reward Economics"
        description="Adjust point pricing, discount format, and reward expiration rules."
        badge="Pricing Engine"
      >
        {/* Point Cost Field with Quick Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="tcCost"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
            >
              Point Cost ({currencyName})
              <Link
                href="/currency/economics"
                target="_blank"
                title={`Manage ${currencyName} Economics`}
              >
                <Info className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity cursor-pointer" />
              </Link>
            </Label>
            <span className="text-[11px] text-zinc-400 font-medium">
              Min. 1 {currencyName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-900 dark:text-zinc-100">
                <Coins className="h-4 w-4" />
              </div>
              <Input
                id="tcCost"
                type="number"
                min={1}
                className="h-11 pl-10 pr-16 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-bold text-zinc-900 dark:text-zinc-100 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                {...formik.getFieldProps("tcCost")}
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {currencyName.substring(0, 3).toUpperCase()}
              </div>
            </div>

            <PolarisPresetChips
              presets={COST_PRESETS}
              currentValue={Number(formik.values.tcCost)}
              onSelect={(v) => formik.setFieldValue("tcCost", v)}
              prefix=""
            />
          </div>
          {err("tcCost")}
        </div>

        {/* Discount & Expiration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Discount Type
            </Label>
            <Select
              onValueChange={(v) => formik.setFieldValue("discountType", v)}
              value={formik.values.discountType}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flat">Flat Value</SelectItem>
                <SelectItem value="Percentage">Percentage %</SelectItem>
                <SelectItem value="Access">Exclusive Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="discountValue"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Discount Value
            </Label>
            <Input
              id="discountValue"
              placeholder="e.g. 500 or 20%"
              className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none font-medium"
              {...formik.getFieldProps("discountValue")}
            />
            {err("discountValue")}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="validityDays"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Validity (Days)
            </Label>
            <Input
              id="validityDays"
              type="number"
              className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none font-medium"
              name="validityDays"
              value={formik.values.validityDays}
              onChange={(e) => {
                formik.handleChange(e);
                const days = parseInt(e.target.value, 10);
                if (!isNaN(days)) {
                  const date = new Date();
                  date.setDate(date.getDate() + days);
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
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Expiry Date
            </Label>
            <Input
              id="expiryDate"
              type="datetime-local"
              className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none font-medium"
              name="expiryDate"
              value={formik.values.expiryDate}
              onClick={(e) => {
                try {
                  (e.target as any).showPicker();
                } catch {
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
      </PolarisFormCard>

      {/* 3. Delivery & Fulfillment */}
      <PolarisFormCard
        step={3}
        title="Delivery & Fulfillment"
        description="Configure reward distribution channels, voucher inventories, and supply limits."
        badge="Fulfillment Engine"
      >
        {/* Step 3.1: Reward Mechanism Channels */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Distribution Channels
            </Label>
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
                    "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all border shrink-0 cursor-pointer",
                    allSelected
                      ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100",
                  )}
                >
                  <Zap className="h-3 w-3" />
                  {allSelected ? "All Channels Active" : "Select All Channels"}
                </button>
              );
            })()}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                {
                  id: "COUPON",
                  label: "Catalog Coupon",
                  desc: "Direct claim in Rewards Hub",
                  icon: Ticket,
                },
                {
                  id: "SPIN_WHEEL",
                  label: "Spin Wheel",
                  desc: "Prize wheel win slice",
                  icon: RotateCw,
                },
                {
                  id: "SCRATCH_CARD",
                  label: "Scratch Card",
                  desc: "Hidden scratch prize",
                  icon: Sparkles,
                },
                {
                  id: "MATCH_AND_WIN",
                  label: "Match & Win",
                  desc: "Mini-game jackpot tier",
                  icon: Gamepad2,
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
                    "flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                    isActive
                      ? "border-zinc-900 bg-zinc-900/[0.03] dark:bg-zinc-100/10 dark:border-zinc-100 ring-2 ring-zinc-900/20 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                      isActive
                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    <MechIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                      {mech.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {mech.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3.2: Code Configuration */}
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Code Format
              </Label>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Choose single shared code vs unique multi-voucher inventory.
              </p>
            </div>
            <div className="w-full sm:w-60">
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
              >
                <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_TO_MANY" className="text-xs">
                    One-to-Many (Single Global Code)
                  </SelectItem>
                  <SelectItem value="ONE_TO_ONE" className="text-xs">
                    One-to-One (Unique Codes Inventory)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Global Coupon Code input */}
          {formik.values.couponType === "ONE_TO_MANY" && (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
              <Label
                htmlFor="couponCode"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Global Coupon Code
              </Label>
              <div className="max-w-md">
                <Input
                  id="couponCode"
                  placeholder="e.g. SUMMER2026, THRICOPARTNER"
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-mono uppercase tracking-wider font-bold shadow-none"
                  {...formik.getFieldProps("couponCode")}
                />
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Single code that all members receive when redeeming this reward.
              </p>
              {err("couponCode")}
            </div>
          )}

          {/* One-to-One CSV Upload Area */}
          {formik.values.couponType === "ONE_TO_ONE" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Voucher Code Ingestion
                    </Label>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Upload CSV containing unique single-use voucher codes.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadTemplate}
                    className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 rounded-lg"
                  >
                    CSV Template
                  </Button>
                </div>

                {uploadStep === "idle" ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={cn(
                      "border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-zinc-900/30",
                      isDragging && "border-zinc-900 dark:border-zinc-100 bg-zinc-900/5",
                    )}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={onFileChange}
                      accept=".csv,.txt"
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-zinc-900 dark:text-zinc-100 mb-2 opacity-80" />
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Drag & drop your voucher CSV here, or{" "}
                      <span className="text-zinc-900 dark:text-zinc-100 underline">browse</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Format: code, cardNumber, pin
                    </p>
                  </div>
                ) : uploadStep === "validating" ? (
                  <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-zinc-50/30">
                    <RotateCw className="h-5 w-5 text-zinc-900 dark:text-zinc-100 animate-spin mb-2" />
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Analyzing codes...
                    </p>
                  </div>
                ) : (
                  <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 space-y-3 bg-zinc-50/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-800 truncate max-w-[200px]">
                        {uploadedFile?.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resetUpload}
                        className="text-xs text-zinc-500 h-7 px-2"
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="bg-[#008060]/5 border border-[#008060]/20 rounded-lg p-2.5 flex items-center justify-between text-xs">
                      <span className="text-zinc-600 font-medium">
                        Valid codes detected:
                      </span>
                      <span className="font-bold text-[#008060] text-sm tabular-nums">
                        {validCount}
                      </span>
                    </div>

                    <Button
                      type="button"
                      onClick={confirmUpload}
                      disabled={uploading}
                      className="w-full h-9 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    >
                      {uploading && (
                        <RotateCw className="h-3 w-3 animate-spin mr-2" />
                      )}
                      Confirm & Load {validCount} Vouchers
                    </Button>
                  </div>
                )}

                {/* Uploaded Vouchers Table */}
                {vouchersListData?.getVouchers &&
                  vouchersListData.getVouchers.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Uploaded Vouchers ({vouchersListData.getVouchers.length})
                      </h4>
                      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
                            <tr>
                              <th className="px-4 py-2 font-semibold text-zinc-600 dark:text-zinc-400">
                                Code
                              </th>
                              <th className="px-4 py-2 font-semibold text-zinc-600 dark:text-zinc-400">
                                Status
                              </th>
                              <th className="px-4 py-2 font-semibold text-zinc-600 dark:text-zinc-400">
                                Created
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                            {vouchersListData.getVouchers.map((v: any) => (
                              <tr key={v.id}>
                                <td className="px-4 py-2 font-mono text-[11px] text-zinc-900 dark:text-zinc-100">
                                  {v.code}
                                </td>
                                <td className="px-4 py-2">
                                  <span
                                    className={cn(
                                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold",
                                      v.isUsed
                                        ? "bg-rose-500/10 text-rose-600"
                                        : "bg-[#008060]/10 text-[#008060]",
                                    )}
                                  >
                                    {v.isUsed ? "Used" : "Available"}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-zinc-500">
                                  {new Date(
                                    Number(v.createdAt),
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Step 3.3: Supply & User Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="totalUsageLimit"
                className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                Total Supply
              </Label>
              <button
                type="button"
                onClick={() => formik.setFieldValue("totalUsageLimit", 0)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                Unlimited
              </button>
            </div>
            <div className="relative">
              <Input
                id="totalUsageLimit"
                type="number"
                placeholder="0 = Unlimited"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none"
                {...formik.getFieldProps("totalUsageLimit")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
                Units
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="perUserLimit"
                className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                Limit Per Member
              </Label>
              <button
                type="button"
                onClick={() => formik.setFieldValue("perUserLimit", 0)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                Unlimited
              </button>
            </div>
            <div className="relative">
              <Input
                id="perUserLimit"
                type="number"
                placeholder="0 = Unlimited"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none"
                {...formik.getFieldProps("perUserLimit")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
                Claims / User
              </span>
            </div>
          </div>
        </div>
      </PolarisFormCard>

      {/* 4. Eligibility & Guardrails */}
      <PolarisFormCard
        step={4}
        title="Eligibility & Guardrails"
        description="Set member anti-abuse guardrails and account qualification requirements."
        badge="Fraud Guard"
      >
        <PolarisInfoBanner
          title="Account Age & Activity Protection"
          description="Enforce minimum participation standards to prevent bots and newly created throwaway accounts from draining reward inventory."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="minAccountAge"
                className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                Min Account Age
              </Label>
              <button
                type="button"
                onClick={() => formik.setFieldValue("minAccountAge", 0)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                Any Age
              </button>
            </div>
            <div className="relative">
              <Input
                id="minAccountAge"
                type="number"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none"
                {...formik.getFieldProps("minAccountAge")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
                Days
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="minActivityRequired"
                className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                Min Activity Required
              </Label>
              <button
                type="button"
                onClick={() => formik.setFieldValue("minActivityRequired", 0)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                No Threshold
              </button>
            </div>
            <div className="relative">
              <Input
                id="minActivityRequired"
                type="number"
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none"
                {...formik.getFieldProps("minActivityRequired")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
                Earned Points
              </span>
            </div>
          </div>
        </div>
      </PolarisFormCard>
    </div>
  );
}
