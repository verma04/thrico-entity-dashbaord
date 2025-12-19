import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { TrendingUp, Users, Award, Target } from "lucide-react";
import { ModuleContainer } from "../modules/module-container";

export const StatsRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const stats = content.stats || [
    { label: "Active Users", value: "50K+", icon: "Users" },
    { label: "Growth Rate", value: "125%", icon: "TrendingUp" },
    { label: "Awards Won", value: "15", icon: "Award" },
    { label: "Projects Completed", value: "500+", icon: "Target" },
  ];

  const iconMap: Record<string, any> = {
    Users,
    TrendingUp,
    Award,
    Target,
  };

  // Stats Row
  if (layout === "stats-row") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div
          className={cn(
            "grid gap-8",
            isMobile ? "grid-cols-2" : "grid-cols-4"
          )}
        >
          {stats.map((stat: any, idx: number) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  // Grid Metrics
  if (layout === "grid-metrics") {
    return (
      <ModuleContainer 
        containerSettings={{...content.containerSettings, background: content.containerSettings?.background || "bg-slate-50"}}
      >
        <div
          className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
          )}
        >
          {stats.map((stat: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  // Icon Stats
  if (layout === "icon-stats") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div
          className={cn(
            "grid gap-8",
            isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
          )}
        >
          {stats.map((stat: any, idx: number) => {
            const Icon = iconMap[stat.icon] || Target;
            return (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </ModuleContainer>
    );
  }

  // Highlight Metric
  if (layout === "highlight-metric") {
    return (
      <ModuleContainer 
        containerSettings={{
          ...content.containerSettings, 
          background: content.containerSettings?.backgroundColor || "bg-gradient-to-r from-primary to-primary/80"
        }}
      >
        <div className="text-white">
          <div className="text-center mb-12">
            <div className="text-6xl font-bold mb-4">
              {stats[0]?.value || "50K+"}
            </div>
            <div className="text-2xl opacity-90">
              {stats[0]?.label || "Happy Customers"}
            </div>
          </div>
          <div
            className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-3"
            )}
          >
            {stats.slice(1, 4).map((stat: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-75">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Timeline Stats
  if (layout === "timeline-stats") {
    return (
      <ModuleContainer 
        containerSettings={{...content.containerSettings, background: content.containerSettings?.background || "bg-slate-50"}}
      >
        <div className="space-y-8">
          {stats.map((stat: any, idx: number) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-6",
                isMobile && "flex-col text-center"
              )}
            >
              <div className="flex-shrink-0 w-24 text-right">
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  Year {2020 + idx}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  return null;
};
