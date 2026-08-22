"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  Settings,
  Search,
  ExternalLink,
  RotateCw,
  Zap,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PillarStoreSectionProps {
  formik: any;
  storeRules: any[];
  storeLoading: boolean;
}

export function PillarStoreSection({
  formik,
  storeRules,
  storeLoading,
}: PillarStoreSectionProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomParams, setShowCustomParams] = useState(false);

  const handleSelectRule = (rule: any) => {
    formik.setFieldValue("selectedRuleId", rule.id);
    formik.setFieldValue("title", formik.values.title || rule.title);
    formik.setFieldValue("description", formik.values.description || rule.description);
    formik.setFieldValue("storeDiscountType", rule.discountType || "FIXED_AMOUNT");
    formik.setFieldValue("discountType", rule.discountType === "PERCENTAGE" ? "Percentage" : "Flat");
    formik.setFieldValue("discountValue", String(rule.discountValue || ""));
    formik.setFieldValue("storeCodePrefix", rule.codePrefix || "THRICO-");
    formik.setFieldValue("storeMinCart", rule.minCartSubtotal || 0);
    formik.setFieldValue("validityDays", rule.validityDays || 30);
    if (rule.image && !formik.values.image) {
      formik.setFieldValue("image", rule.image);
    }
    setShowCustomParams(false);
    toast({
      title: "Store Rule Linked",
      description: `Applied "${rule.title}".`,
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-border/70 animate-in fade-in-50 duration-200">
      {/* Compact Banner */}
      <div className="p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 truncate">
            On-Demand Shopify Discount Generation
          </span>
        </div>
        <Badge className="bg-indigo-600 text-white font-bold text-[8px] px-1.5 py-0 uppercase shrink-0">
          Zero Upfront Inventory
        </Badge>
      </div>

      {/* ── 1. Link from Existing Store Rules ──────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2.5">
          <Label className="text-xs font-bold text-foreground block">
            Select Configured Store Rule ({storeRules.length})
          </Label>
          <Link
            href="/gamification/rewards/pillars/store"
            target="_blank"
            className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Manage Store Pillar</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter store rules by title/prefix..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-card border-border"
          />
        </div>

        {storeLoading ? (
          <div className="p-4 text-center border border-border/70 rounded-lg bg-card">
            <RotateCw className="h-4 w-4 animate-spin mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Loading store discount rules...</p>
          </div>
        ) : storeRules.length === 0 ? (
          <div className="p-3 text-center border border-dashed border-border/80 rounded-lg bg-muted/10">
            <p className="text-xs text-muted-foreground">
              No store rules configured yet. Define custom parameters below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {storeRules
              .filter((r: any) =>
                !searchQuery ||
                r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.codePrefix?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((rule: any) => {
                const isSelected = formik.values.selectedRuleId === rule.id && !showCustomParams;
                return (
                  <div
                    key={rule.id}
                    onClick={() => handleSelectRule(rule)}
                    className={cn(
                      "p-2 rounded-lg border text-left transition-all cursor-pointer space-y-1 flex flex-col justify-between",
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-600/30 shadow-xs"
                        : "border-border/70 bg-card hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-foreground truncate block">
                        {rule.title}
                      </h5>
                      <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[8px] font-bold px-1.5 py-0">
                        {rule.discountType === "PERCENTAGE"
                          ? `${rule.discountValue}% OFF`
                          : `₹${rule.discountValue} OFF`}
                      </Badge>
                    </div>

                    <div className="pt-1 border-t border-border/40 flex items-center justify-between text-[9px] text-muted-foreground">
                      <span>Prefix: <code className="font-mono text-foreground font-bold">{rule.codePrefix || "THRICO-"}</code></span>
                      <span>Min: ₹{rule.minCartSubtotal || 0}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ── 2. Bottom: Custom Parameters Box ──────────────────────────────── */}
      <div className="p-2.5 rounded-xl border border-border/80 bg-muted/20 space-y-2">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            size="sm"
            variant={showCustomParams ? "default" : "outline"}
            onClick={() => {
              const next = !showCustomParams;
              setShowCustomParams(next);
              if (next) {
                formik.setFieldValue("selectedRuleId", "");
              }
            }}
            className="h-7 px-2.5 text-[10px] font-semibold gap-1.5 cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <Settings className="h-3 w-3" />
            <span>{showCustomParams ? "Hide Custom Parameters" : "Define Custom Parameters"}</span>
          </Button>
        </div>

        {showCustomParams && (
          <div className="p-2.5 rounded-lg border border-border bg-card space-y-2.5 animate-in fade-in-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">
                  Discount Code Prefix *
                </Label>
                <Input
                  value={formik.values.storeCodePrefix || "THRICO-"}
                  onChange={(e) =>
                    formik.setFieldValue("storeCodePrefix", e.target.value.toUpperCase())
                  }
                  placeholder="e.g. THRICO-100-, SAVE15-"
                  className="h-8 font-mono font-bold text-xs uppercase bg-card border-border"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">
                  Shopify Discount Type
                </Label>
                <Select
                  value={formik.values.storeDiscountType || "FIXED_AMOUNT"}
                  onValueChange={(val) => formik.setFieldValue("storeDiscountType", val)}
                >
                  <SelectTrigger className="h-8 bg-card border-border text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIXED_AMOUNT" className="text-xs">
                      Fixed Amount (₹ Off)
                    </SelectItem>
                    <SelectItem value="PERCENTAGE" className="text-xs">
                      Percentage (% Off)
                    </SelectItem>
                    <SelectItem value="FREE_SHIPPING" className="text-xs">
                      Free Shipping
                    </SelectItem>
                    <SelectItem value="BOGO" className="text-xs">
                      BOGO Special
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">
                  Min Cart Subtotal (₹)
                </Label>
                <Input
                  type="number"
                  placeholder="0 = No Minimum"
                  value={formik.values.storeMinCart || 0}
                  onChange={(e) =>
                    formik.setFieldValue("storeMinCart", Number(e.target.value))
                  }
                  className="h-8 bg-card border-border text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">
                  Single-Use Lock
                </Label>
                <div className="h-8 px-2.5 rounded-md border border-border bg-card flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Lock to winner email
                  </span>
                  <Switch
                    checked={formik.values.customerLock !== false}
                    onCheckedChange={(c) => formik.setFieldValue("customerLock", c)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
