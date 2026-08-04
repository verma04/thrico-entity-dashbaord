"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ClipboardList, Sparkles, Filter } from "lucide-react";
import Link from "next/link";
import { CtaButton as Button } from "@/components/ui/cta-button";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

import { SurveyAIAgentButton } from "@/components/surveys/survey-ai-agent";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { useModuleStore } from "@/store/useModuleStore";
import { PlusCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const moduleName = useModuleStore((state) => state.surveyModuleName);
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
        breadcrumbs={[{ label: "Surveys", href: "/surveys" }, { label: "All" }]}
        actions={
          <div className="flex items-center gap-3 relative ml-auto">
            <Link href="/surveys/templates">
              <Button
                variant="outline"
                className="gap-1.5 uppercase tracking-widest text-[9px] font-bold"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Templates
              </Button>
            </Link>
            <SurveyAIAgentButton />
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
              className="h-6 w-6 p-0 rounded-md border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <Filter className="h-3 w-3" />
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Link href="/surveys/create">
              <Button className="gap-1.5">
                <PlusCircle className="h-3.5 w-3.5" />
                Create {singularName}
              </Button>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active>
            Active Datasets
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {children}
    </EcosystemWrapper>
  );
}
