"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  List,
  Search,
  ClipboardList,
} from "lucide-react";
import { ListingStats } from "@/components/listings/listing-stats";
import { CreateListingDialog } from "@/components/listings/create-listing-dialog";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Items", icon: List, dot: "" },
  {
    value: "APPROVED",
    label: "Approved",
    icon: CheckCircle,
    dot: "bg-emerald-500",
  },
  { value: "PENDING", label: "Pending", icon: Clock, dot: "bg-amber-500" },
  { value: "DISABLED", label: "Disabled", icon: XCircle, dot: "bg-orange-500" },
  { value: "REJECTED", label: "Rejected", icon: XCircle, dot: "bg-red-500" },
];

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "ALL";
  const searchQuery = searchParams.get("q") || "";

  const currentStatus =
    STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0];

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/listing/all?${params.toString()}`);
  };

  return (
    <EcosystemWrapper>
      {/* Action Bar */}
      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          {/* Search */}
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={(val) => updateFilters({ q: val })}
              placeholder="Search by SKU, item name or ID…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {/* Status filter */}
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(val) => updateFilters({ status: val })}
            >
              <SelectTrigger className="w-[160px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground focus:ring-2 focus:ring-ring/20 shadow-none">
                <div className="flex items-center gap-2">
                  {currentStatus.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        currentStatus.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot,
                          )}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active>
            Live Inventory
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer>{children}</EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default RootLayout;
