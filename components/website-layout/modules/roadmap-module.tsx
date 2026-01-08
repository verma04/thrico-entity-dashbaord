"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface RoadmapModuleProps {
  module: ModuleData;
  previewDevice: string;
}

import { ModuleContainer } from "./module-container";
import { ModuleHeader } from "./module-header";
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowUpRight,
  Calendar,
  ArrowRight,
  Target,
  Zap,
  Rocket,
  Flag,
  Sparkles,
} from "lucide-react";

// --- Sub-Components for Layouts ---

const GridRoadmap = ({ items }: { items: any[] }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 shadow-green-500/20";
      case "in-progress":
        return "bg-blue-600 shadow-blue-500/20";
      default:
        return "bg-slate-300 shadow-slate-300/20";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative bg-white p-8 rounded-[3rem] border border-slate-200 hover:border-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500 flex flex-col min-h-[400px]"
        >
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-8">
            <div
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                getStatusStyles(item.status)
              )}
            >
              {item.status.replace("-", " ")}
            </div>
            <span className="text-xs font-black text-slate-300 group-hover:text-slate-900 transition-colors">
              #0{idx + 1}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {item.description}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5" />
                {item.quarter || "TBD"}
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>

          {/* Background Decorative Number */}
          <span className="absolute bottom-8 right-8 text-8xl font-black text-slate-50/50 -z-10 group-hover:text-slate-100 transition-colors pointer-events-none">
            {idx + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

const HorizontalRoadmap = ({ items }: { items: any[] }) => {
  const getStatusIcon = (status: string) => {
    if (status === "completed")
      return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    if (status === "in-progress")
      return <Clock className="h-6 w-6 text-blue-500" />;
    return <Circle className="h-6 w-6 text-slate-300" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50/50 text-green-700";
      case "in-progress":
        return "border-blue-500 bg-blue-50/50 text-blue-700";
      default:
        return "border-slate-200 bg-white text-slate-700";
    }
  };

  return (
    <div className="relative mt-12">
      {/* Timeline Background Line */}
      <div className="hidden lg:block absolute top-[27px] left-0 right-0 h-1 bg-slate-100 rounded-full" />

      {/* Active Progress Line */}
      <div
        className="hidden lg:block absolute top-[27px] left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
        style={{ width: "45%" }} // Mocked progress
      />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 overflow-x-auto lg:overflow-visible pb-12 scrollbar-none px-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 min-w-[320px] lg:min-w-0 relative group"
          >
            {/* Timeline Node */}
            <div className="hidden lg:flex absolute top-0 left-12 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 items-center justify-center z-20 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-blue-500/30 transition-all duration-500">
              <div
                className={cn(
                  "w-4 h-4 rounded-full shadow-sm",
                  item.status === "completed"
                    ? "bg-green-500 animate-pulse"
                    : item.status === "in-progress"
                    ? "bg-blue-500 animate-bounce"
                    : "bg-slate-300"
                )}
              />
            </div>

            {/* Card */}
            <div
              className={cn(
                "mt-8 lg:mt-24 p-8 rounded-[2.5rem] border-2 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group-hover:-translate-y-2 h-full flex flex-col min-h-[300px]",
                getStatusColor(item.status)
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                  {item.quarter || `Phase 0${idx + 1}`}
                </span>
                {getStatusIcon(item.status)}
              </div>

              <h3 className="text-xl font-black mb-4 tracking-tight text-slate-900 leading-tight">
                {item.title}
              </h3>

              <p className="text-sm leading-relaxed text-slate-500 font-medium mb-8 flex-1">
                {item.description}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status:{" "}
                  <span className="text-slate-900">
                    {item.status.replace("-", " ")}
                  </span>
                </span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressRoadmap = ({ items }: { items: any[] }) => {
  const icons = [Target, Zap, Rocket, Flag];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {items.map((item, idx) => {
        const Icon = icons[idx % icons.length];
        const isCompleted = item.status === "completed";
        const isInProgress = item.status === "in-progress";

        return (
          <div
            key={idx}
            className="group relative flex flex-col md:flex-row items-stretch gap-8"
          >
            {/* Number & Icon Side */}
            <div className="shrink-0 flex items-center justify-center md:flex-col gap-6 md:w-32">
              <div
                className={cn(
                  "w-20 h-20 rounded-4xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:rotate-6",
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isInProgress
                    ? "bg-blue-600 text-white shadow-blue-500/20"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                )}
              >
                <Icon className="w-10 h-10" />
              </div>
              <div className="h-px md:w-px md:h-12 bg-slate-100 hidden md:block" />
            </div>

            {/* Content Side */}
            <div className="flex-1 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 hover:border-slate-900/10 transition-all duration-500 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    Step 0{idx + 1}
                  </span>
                  <div className="h-px lg:w-12 bg-slate-100" />
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      isCompleted
                        ? "bg-green-50 text-green-600"
                        : isInProgress
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-50 text-slate-400"
                    )}
                  >
                    {item.status.replace("-", " ")}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                  {item.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="shrink-0 w-32 flex flex-col items-center">
                <div className="relative w-16 h-16 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 stroke-current"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={cn(
                        "stroke-current transition-all duration-1000",
                        isCompleted
                          ? "text-green-500"
                          : isInProgress
                          ? "text-blue-600"
                          : "text-slate-300"
                      )}
                      strokeWidth="3"
                      strokeDasharray={
                        isCompleted
                          ? "100, 100"
                          : isInProgress
                          ? "65, 100"
                          : "0, 100"
                      }
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900">
                    {isCompleted ? "100%" : isInProgress ? "65%" : "0%"}
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Dev Progress
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const VerticalRoadmap = ({ items }: { items: any[] }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
      {/* Central Timeline Line */}
      <div className="absolute left-8 lg:left-1/2 top-4 bottom-4 w-1.5 bg-slate-100 -translate-x-1/2 rounded-full" />

      <div className="space-y-24">
        {items.map((item, idx) => {
          const isLeft = idx % 2 === 0;
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "in-progress";

          return (
            <div
              key={idx}
              className="relative flex flex-col lg:flex-row items-center group"
            >
              {/* Timeline Marker */}
              <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 z-10">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500",
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isInProgress
                      ? "bg-blue-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="text-xs font-black">{idx + 1}</span>
                  )}
                </div>
              </div>

              {/* Content Card */}
              <div
                className={cn(
                  "w-full lg:w-[42%] transition-all duration-700 ml-16 lg:ml-0",
                  isLeft
                    ? "lg:mr-auto lg:text-right"
                    : "lg:ml-auto lg:text-left"
                )}
              >
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all group-hover:border-blue-500/20 group-hover:-translate-y-1">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      isCompleted
                        ? "bg-green-50 border-green-100 text-green-600"
                        : isInProgress
                        ? "bg-blue-50 border-blue-100 text-blue-600"
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    )}
                  >
                    {item.quarter || `Phase ${idx + 1}`}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  <div
                    className={cn(
                      "flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400",
                      isLeft ? "lg:justify-end" : "lg:justify-start"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {isInProgress ? (
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      {item.status.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RoadmapModule = ({
  module,
  previewDevice,
}: RoadmapModuleProps) => {
  const { content, layout } = module;
  const items = content.items || [];

  const Header = () => (
    <ModuleHeader
      title={content.title || "Our Roadmap"}
      description={content.description || "Upcoming features and goals"}
      alignment={content.alignment || "center"}
    />
  );

  // Empty state
  if (items.length === 0) {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <Header />
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground text-sm sm:text-base">
              No roadmap items added yet. Add items in the settings panel.
            </p>
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Render High-Fidelity Layouts
  if (layout === "horizontal-roadmap") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className="max-w-360 mx-auto px-4">
          <Header />
          <HorizontalRoadmap items={items} />
        </div>
      </ModuleContainer>
    );
  }

  if (layout === "vertical-timeline") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className="max-w-7xl mx-auto px-4">
          <Header />
          <VerticalRoadmap items={items} />
        </div>
      </ModuleContainer>
    );
  }

  if (layout === "milestone-grid") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className="max-w-360 mx-auto px-4">
          <Header />
          <GridRoadmap items={items} />
        </div>
      </ModuleContainer>
    );
  }

  if (layout === "progress-steps") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className="max-w-6xl mx-auto px-4">
          <Header />
          <ProgressRoadmap items={items} />
        </div>
      </ModuleContainer>
    );
  }

  // Default fallback
  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        <VerticalRoadmap items={items} />
      </div>
    </ModuleContainer>
  );
};
