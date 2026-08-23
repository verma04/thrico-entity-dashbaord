"use client";

import React from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { SegmentedControl } from "../primitives/segmented-control";
import { PolarisInput } from "../primitives/polaris-input";
import { Sparkles } from "lucide-react";
import { DiscountMethod } from "../types";

export interface DiscountMethodCardProps {
  method: DiscountMethod;
  onMethodChange: (method: DiscountMethod) => void;
  code: string;
  onCodeChange: (code: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  codeError?: string | null;
  titleError?: string | null;
}

export function DiscountMethodCard({
  method,
  onMethodChange,
  code,
  onCodeChange,
  title,
  onTitleChange,
  codeError,
  titleError,
}: DiscountMethodCardProps) {
  // Helper to generate realistic Shopify-style random discount codes (e.g. SUMMER-7F2K or SAVE25-9AX)
  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let rand = "";
    for (let i = 0; i < 8; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const prefix = "SAVE";
    onCodeChange(`${prefix}-${rand.slice(0, 4)}`);
  };

  return (
    <PolarisCard
      title={
        <div className="flex items-center justify-between w-full">
          <span>Amount off products</span>
        </div>
      }
    >
      {/* Segmented Control: Discount code vs Automatic discount */}
      <div>
        <SegmentedControl<DiscountMethod>
          value={method}
          onChange={onMethodChange}
          options={[
            { value: "CODE", label: "Discount code" },
            { value: "AUTOMATIC", label: "Automatic discount" },
          ]}
        />
      </div>

      {/* Code vs Automatic Fields */}
      {method === "CODE" ? (
        <div className="space-y-1">
          <PolarisInput
            id="discount-code-input"
            label="Discount code"
            labelAction={
              <button
                type="button"
                onClick={generateRandomCode}
                className="text-[13px] font-medium text-[#005bd3] dark:text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                <span>Generate random code</span>
              </button>
            }
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase().replace(/\s+/g, ""))}
            placeholder="e.g. SUMMER2026"
            helperText="Customers must enter this code at checkout."
            error={codeError}
            required
            className="font-mono uppercase font-medium tracking-wide"
          />
        </div>
      ) : (
        <div className="space-y-1">
          <PolarisInput
            id="discount-title-input"
            label="Title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Summer 20% Off Storewide"
            helperText="Customers will see this in their cart and at checkout."
            error={titleError}
            required
          />
        </div>
      )}
    </PolarisCard>
  );
}
