"use client";

import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Calendar,
  Flag,
  ArrowRight,
  Trophy,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ModuleContainer } from "../modules/module-container";
import { ModuleHeader } from "../modules/module-header";

export const MilestonesRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";
  const normalizedContent = {
    ...content,
    milestones: content.milestones || [],
  };

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      <ModuleHeader
        title={content.title}
        description={content.description}
        alignment={content.alignment || "center"}
      />

      {layout === "milestone-cards" && (
        <CardMilestones content={normalizedContent} />
      )}
      {layout === "horizontal-milestones" && (
        <HorizontalMilestones content={normalizedContent} />
      )}
      {layout === "list-milestones" && (
        <ListMilestones content={normalizedContent} />
      )}
      {layout === "roadmap-milestones" && (
        <RoadmapMilestones content={normalizedContent} />
      )}
      {layout === "vertical-milestones" && (
        <VerticalMilestones content={normalizedContent} />
      )}
      {!layout && <VerticalMilestones content={normalizedContent} />}
    </ModuleContainer>
  );
};

interface Milestone {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming" | "planned";
  date?: string;
  icon?: string;
  image?: string;
}

interface MilestonesProps {
  content: {
    title?: string;
    description?: string;
    milestones: Milestone[];
  };
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<
    string,
    { color: string; bg: string; icon: any; text: string }
  > = {
    completed: {
      color: "text-green-600",
      bg: "bg-green-100",
      icon: CheckCircle2,
      text: "Completed",
    },
    "in-progress": {
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: Clock,
      text: "In Progress",
    },
    upcoming: {
      color: "text-orange-600",
      bg: "bg-orange-100",
      icon: Calendar,
      text: "Upcoming",
    },
    planned: {
      color: "text-gray-600",
      bg: "bg-gray-100",
      icon: Flag,
      text: "Planned",
    },
  };
  return statusMap[status] || statusMap.completed;
};

const CardMilestones = ({ content }: MilestonesProps) => {
  const { milestones } = content;

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
      {milestones.map((milestone, index) => {
        const statusInfo = getStatusInfo(milestone.status);
        const IconComponent =
          (LucideIcons as any)[milestone.icon || "Zap"] || statusInfo.icon;

        return (
          <div
            key={index}
            className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div className="relative h-56 overflow-hidden">
              {milestone.image ? (
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white/10">
                  <IconComponent size={80} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-6 right-6">
                <div
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg",
                    statusInfo.bg,
                    statusInfo.color
                  )}
                >
                  {statusInfo.text}
                </div>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-4 text-slate-400">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {milestone.date
                    ? new Date(milestone.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Date TBD"}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                {milestone.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                {milestone.description}
              </p>

              <div className="mt-auto flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                  <IconComponent size={16} />
                </div>
                <span className="text-xs font-bold text-slate-900 capitalize">
                  Milestone Goal Reached
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HorizontalMilestones = ({ content }: MilestonesProps) => {
  const { milestones } = content;

  return (
    <div className="overflow-hidden px-4">
      <div className="mt-20 relative max-w-7xl mx-auto">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-[6.5rem] left-0 right-0 h-1 bg-slate-200 rounded-full px-12" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 px-4">
          {milestones.map((milestone, index) => {
            const statusInfo = getStatusInfo(milestone.status);
            const IconComponent =
              (LucideIcons as any)[milestone.icon || "Zap"] || statusInfo.icon;

            return (
              <div key={index} className="flex-1 relative group">
                {/* Timeline Node */}
                <div
                  className="hidden lg:flex absolute top-[100px] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-all duration-300 group-hover:scale-150 group-hover:shadow-blue-200"
                  style={{
                    backgroundColor: statusInfo.color.replace("text-", ""),
                  }}
                />

                <div className="flex flex-col h-full bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <div
                        className={cn(
                          "text-[10px] font-black uppercase tracking-[0.2em]",
                          statusInfo.color
                        )}
                      >
                        {statusInfo.text}
                      </div>
                      {milestone.date && (
                        <div className="text-slate-400 text-[10px] font-bold mt-0.5">
                          {new Date(milestone.date).getFullYear()}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                    {milestone.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {milestone.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-blue-600 cursor-pointer group/link">
                    <span className="text-xs font-black uppercase tracking-widest">
                      Details
                    </span>
                    <ArrowRight
                      size={16}
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ListMilestones = ({ content }: MilestonesProps) => {
  const { milestones } = content;

  const getListStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; border: string; bg: string; icon: any; text: string }
    > = {
      completed: {
        color: "text-green-600",
        border: "border-green-600",
        bg: "bg-green-50",
        icon: CheckCircle2,
        text: "Goal Secured",
      },
      "in-progress": {
        color: "text-blue-600",
        border: "border-blue-600",
        bg: "bg-blue-50",
        icon: Clock,
        text: "Active Development",
      },
      upcoming: {
        color: "text-orange-600",
        border: "border-orange-600",
        bg: "bg-orange-50",
        icon: Calendar,
        text: "Coming Soon",
      },
      planned: {
        color: "text-gray-600",
        border: "border-gray-600",
        bg: "bg-gray-50",
        icon: Flag,
        text: "Planned Phase",
      },
    };
    return statusMap[status] || statusMap.completed;
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mt-12 space-y-4">
        {milestones.map((milestone, index) => {
          const statusInfo = getListStatusInfo(milestone.status);
          const IconComponent =
            (LucideIcons as any)[milestone.icon || "Zap"] || statusInfo.icon;

          return (
            <div
              key={index}
              className={cn(
                "p-6 rounded-[1.5rem] border-l-[6px] flex flex-col md:flex-row gap-8 items-center group transition-all duration-300",
                statusInfo.bg,
                statusInfo.border,
                "hover:shadow-xl hover:translate-x-2"
              )}
            >
              <div className="flex-shrink-0 relative">
                {milestone.image ? (
                  <img
                    src={milestone.image}
                    alt={milestone.title}
                    className="w-24 h-24 object-cover rounded-2xl shadow-md group-hover:rotate-3 transition-transform"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                    <IconComponent size={36} />
                  </div>
                )}
                {milestone.status === "completed" && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center text-white shadow-sm">
                    <Trophy size={14} />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {milestone.title}
                  </h3>
                  <div
                    className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block self-center md:self-auto",
                      statusInfo.color,
                      "bg-white/50"
                    )}
                  >
                    {statusInfo.text}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-2xl">
                  {milestone.description}
                </p>
                {milestone.date && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <Calendar size={14} />
                    {new Date(milestone.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RoadmapMilestones = ({ content }: MilestonesProps) => {
  const { milestones } = content;

  const statuses: Milestone["status"][] = [
    "completed",
    "in-progress",
    "upcoming",
    "planned",
  ];

  return (
    <div className="mt-20 space-y-16 max-w-7xl mx-auto px-4">
      {statuses.map((status) => {
        const filteredItems = milestones.filter((m) => m.status === status);
        if (filteredItems.length === 0) return null;

        const statusInfo = getStatusInfo(status);

        return (
          <div key={status} className="space-y-8">
            <div className="flex items-center gap-6">
              <div
                className={cn("p-4 rounded-[1.5rem] shadow-sm", statusInfo.bg)}
              >
                <statusInfo.icon className={cn("w-6 h-6", statusInfo.color)} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {statusInfo.text}
                </h3>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "Phase" : "Phases"} Identified
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((milestone, idx) => {
                const IconComponent =
                  (LucideIcons as any)[milestone.icon || "Zap"] ||
                  statusInfo.icon;

                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-900 mb-2">
                          {milestone.title}
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                          {milestone.description}
                        </p>
                        {milestone.date && (
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Calendar size={12} />
                            {new Date(milestone.date).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const VerticalMilestones = ({ content }: MilestonesProps) => {
  const { milestones } = content;

  return (
    <div className="mt-16 max-w-4xl mx-auto relative px-4">
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />

      <div className="space-y-12">
        {milestones.map((milestone, index) => {
          const statusInfo = getStatusInfo(milestone.status);
          const IconComponent =
            (LucideIcons as any)[milestone.icon || "Zap"] || statusInfo.icon;

          return (
            <div key={index} className="relative pl-24 group">
              {/* Status Indicator */}
              <div
                className={cn(
                  "absolute left-5 top-0 w-8 h-8 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-125",
                  statusInfo.bg
                )}
              >
                <statusInfo.icon className={cn("w-4 h-4", statusInfo.color)} />
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {milestone.title}
                      </h3>
                      {milestone.date && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">
                          <Calendar size={12} />
                          {new Date(milestone.date).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest self-start md:self-center",
                      statusInfo.bg,
                      statusInfo.color
                    )}
                  >
                    {statusInfo.text}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm">
                  {milestone.description}
                </p>

                {milestone.image && (
                  <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
