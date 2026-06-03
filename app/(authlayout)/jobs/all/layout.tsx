"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Clock,
  XCircle,
  List,
  StopCircle,
  Briefcase,
  Search,
} from "lucide-react";

import Create from "@/components/jobs/create/create-job";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

// ─────────────────────────────────────────────────────────────────────────────
// Status options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Jobs", icon: List, dot: "" },
  {
    value: "APPROVED",
    label: "Approved",
    icon: CheckCircle,
    dot: "bg-emerald-500",
  },
  { value: "PENDING", label: "Pending", icon: Clock, dot: "bg-amber-500" },
  { value: "DISABLED", label: "Disabled", icon: XCircle, dot: "bg-orange-500" },
  { value: "REJECTED", label: "Rejected", icon: XCircle, dot: "bg-red-500" },
  { value: "PAUSED", label: "Paused", icon: StopCircle, dot: "bg-slate-400" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

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
    router.push(`/jobs/all?${params.toString()}`);
  };

  return (
    <EcosystemWrapper>
      {/* Header */}
      <EcosystemHeader
        title="Jobs"
        badgeText="Recruitment"
        description="Oversee and manage all job postings across your community."
        icon={Briefcase}
      />

      {/* Action Bar */}
      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          {/* Search */}
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={(val) => updateFilters({ q: val })}
              placeholder="Search by role, company or location…"
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
            Live Postings
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer>{children}</EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default RootLayout;
