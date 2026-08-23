"use client";

import React, { useState } from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { PolarisSelect } from "../primitives/polaris-select";
import { BrowseModal } from "../primitives/browse-modal";
import { Button } from "@/components/ui/button";
import { Search, Users, X } from "lucide-react";
import { EligibilityType, SelectedItem } from "../types";

export interface CustomerEligibilityCardProps {
  eligibility: EligibilityType;
  onEligibilityChange: (val: EligibilityType) => void;
  selectedSegments: SelectedItem[];
  onSegmentsChange: (items: SelectedItem[]) => void;
  selectedCustomers: SelectedItem[];
  onCustomersChange: (items: SelectedItem[]) => void;
}

export function CustomerEligibilityCard({
  eligibility,
  onEligibilityChange,
  selectedSegments,
  onSegmentsChange,
  selectedCustomers,
  onCustomersChange,
}: CustomerEligibilityCardProps) {
  const [browseModalOpen, setBrowseModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const showSearchBrowse =
    eligibility === "SPECIFIC_SEGMENTS" || eligibility === "SPECIFIC_CUSTOMERS";

  const currentSelectedItems =
    eligibility === "SPECIFIC_SEGMENTS" ? selectedSegments : selectedCustomers;

  const handleRemoveItem = (id: string) => {
    if (eligibility === "SPECIFIC_SEGMENTS") {
      onSegmentsChange(selectedSegments.filter((s) => s.id !== id));
    } else {
      onCustomersChange(selectedCustomers.filter((c) => c.id !== id));
    }
  };

  const handleModalConfirm = (items: SelectedItem[]) => {
    if (eligibility === "SPECIFIC_SEGMENTS") {
      onSegmentsChange(items);
    } else {
      onCustomersChange(items);
    }
  };

  return (
    <PolarisCard title="Eligibility">
      <div>
        <PolarisSelect
          id="customer-eligibility-select"
          value={eligibility}
          onChange={(val) => onEligibilityChange(val as EligibilityType)}
          options={[
            { value: "ALL", label: "All customers" },
            {
              value: "SPECIFIC_SEGMENTS",
              label: "Specific customer segments",
            },
            { value: "SPECIFIC_CUSTOMERS", label: "Specific customers" },
          ]}
        />
      </div>

      {showSearchBrowse && (
        <div className="space-y-2 pt-2 border-t border-[#f1f2f3] dark:border-zinc-800 animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161]" />
              <input
                type="text"
                placeholder={
                  eligibility === "SPECIFIC_SEGMENTS"
                    ? "Search customer segments"
                    : "Search customers"
                }
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-[40px] pl-9 pr-3 text-[14px] text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] rounded-[8px] outline-none transition-all placeholder:text-[#8c9196]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBrowseModalOpen(true)}
              className="h-[40px] w-[80px] rounded-[8px] border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 shrink-0"
            >
              Browse
            </Button>
          </div>

          {currentSelectedItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentSelectedItems.map((item) => (
                <div
                  key={item.id}
                  className="inline-flex items-center gap-2 py-1.5 px-2.5 rounded-[8px] bg-zinc-50 dark:bg-zinc-800/80 border border-[#d2d5d9] dark:border-zinc-700 text-[13px] text-[#303030] dark:text-zinc-200"
                >
                  <Users className="h-3.5 w-3.5 text-[#005bd3] shrink-0" />
                  <span className="font-medium max-w-[220px] truncate">
                    {item.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-4 w-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-[#616161] hover:text-[#303030] dark:hover:text-white transition-colors cursor-pointer"
                    aria-label={`Remove ${item.title}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <BrowseModal
        open={browseModalOpen}
        onOpenChange={setBrowseModalOpen}
        type={eligibility === "SPECIFIC_SEGMENTS" ? "segment" : "customer"}
        selectedItems={currentSelectedItems}
        onConfirm={handleModalConfirm}
      />
    </PolarisCard>
  );
}
