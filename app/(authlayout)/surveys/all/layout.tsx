"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ClipboardList, Sparkles, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

import { SurveyAIAgentButton } from "@/components/surveys/survey-ai-agent";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import NewForm from "@/components/feedback-form/new-feed-back-form";

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/surveys/all?${params.toString()}`);
  };

  return (
    <EcosystemWrapper>
      {/* Header */}
      <EcosystemHeader
        title="Feedback Registry"
        badgeText="Community Insights"
        description="Review interaction datasets, sentiment tracking, and global response protocols."
        icon={ClipboardList}
        actions={
          <div className="flex items-center gap-3 relative ml-auto">
            <Link href="/surveys/templates">
              <Button
                variant="outline"
                className="font-bold text-[10px] uppercase tracking-widest px-6 h-9 rounded-lg shadow-sm gap-2 border-zinc-200 text-zinc-600"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Templates
              </Button>
            </Link>
            <SurveyAIAgentButton />
            <NewForm />
          </div>
        }
      />

      {/* Action Bar */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={(val) => updateFilters({ q: val })}
              placeholder="Search registry nodes..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active>
            Active Datasets
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {children}
    </EcosystemWrapper>
  );
}
