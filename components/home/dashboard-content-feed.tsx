import React, { useState } from "react";
import { FileText, Zap, Reply } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

const contentFeed = [
  {
    title: "Total Posts",
    key: "totalPosts",
    icon: FileText,
    tooltip: "Total feed entries, stories, and discussions",
  },
  {
    title: "Post Frequency",
    key: "contributionFrequency",
    icon: Zap,
    suffix: "/wk",
    tooltip: "(Total Posts / DAU / Days in Period) × 7",
  },
  {
    title: "Reply Rate",
    key: "interactionReciprocity",
    icon: Reply,
    suffix: "%",
    tooltip: "(Feed Comments / Total Posts) × 100",
  },
];

interface DashboardContentFeedProps {
  loading: boolean;
  kpis: any;
  getMetric: (key: string) => any;
  DashboardSectionHeading: React.FC<{ title: string; action?: React.ReactNode; tooltip?: string }>;
}

export function DashboardContentFeed({
  loading,
  kpis,
  getMetric,
  DashboardSectionHeading,
}: DashboardContentFeedProps) {
  const [showAllContentTypes, setShowAllContentTypes] = useState(false);

  return (
    <section className="space-y-3 mt-20">
      <DashboardSectionHeading title="Content & Feed" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {contentFeed.map((v) => {
            const item = getMetric(v.key);
            return (
              <EcosystemKPI
                key={v.key}
                title={v.title}
                value={loading ? "..." : item?.value ?? "0"}
                trend={item?.change ?? 0}
                trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                icon={v.icon}
                suffix={(v as any).suffix}
                tooltip={(v as any).tooltip}
              />
            );
          })}
        </div>

        {/* Content Type Breakdown */}
        <div className="lg:col-span-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-0.5">
                What members post
              </p>
              <h3 className="text-sm font-semibold text-foreground leading-none">
                Content Mix
              </h3>
            </div>
            {kpis?.contentTypeBreakdown &&
              kpis.contentTypeBreakdown.length > 2 && (
                <button
                  className="text-[10px] text-muted-foreground font-medium underline underline-offset-2 hover:text-foreground transition-colors"
                  onClick={() => setShowAllContentTypes(!showAllContentTypes)}
                >
                  {showAllContentTypes ? "View Less" : "View More"}
                </button>
              )}
          </div>
          <div className="space-y-4">
            {(() => {
              const sorted = [...(kpis?.contentTypeBreakdown || [])].sort(
                (a, b) => b.percentage - a.percentage
              );
              return showAllContentTypes ? sorted : sorted.slice(0, 2);
            })()?.map((item, i) => {
              const barColors = [
                "bg-gradient-to-r from-indigo-500 to-blue-400",
                "bg-gradient-to-r from-violet-500 to-purple-400",
                "bg-gradient-to-r from-pink-500 to-rose-400",
                "bg-gradient-to-r from-amber-500 to-orange-400",
                "bg-gradient-to-r from-emerald-500 to-teal-400",
              ];
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-foreground/80 font-medium capitalize">
                      {item?.type?.toLowerCase() === "dashboard"
                        ? "Text feed"
                        : item?.type?.replace(/[-_]/g, " ")?.toLowerCase()}
                    </span>
                    <span className="text-[11px] font-bold text-foreground tabular-nums">
                      {item?.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                      style={{ width: `${item?.percentage || 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
