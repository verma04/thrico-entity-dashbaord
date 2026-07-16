"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import * as LucideIcons from "lucide-react";
import { CheckCircle2, Clock, Calendar, Flag } from "lucide-react";

interface MilestonesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const MilestonesModule = ({
  module,
  previewDevice,
}: MilestonesModuleProps) => {
  const { content, layout } = module;
  const milestones = content.milestones || [];

  // Helper to render Lucide icon
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  // Get status color and icon
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

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {milestones.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-muted-foreground">
            No milestones added yet. Add milestones in the settings panel.
          </p>
        </div>
      )}

      {/* Timeline Vertical Layout */}
      {layout === "timeline-vertical" && milestones.length > 0 && (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-8">
            {milestones.map((milestone: any, idx: number) => {
              const statusInfo = getStatusInfo(milestone.status);

              return (
                <div key={idx} className="relative pl-20">
                  <div
                    className={`absolute left-6 w-5 h-5 ${statusInfo.bg} rounded-full border-4 border-white flex items-center justify-center`}
                  >
                    <statusInfo.icon
                      className={`w-3 h-3 ${statusInfo.color}`}
                    />
                  </div>
                  <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {milestone.icon && (
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            {renderIcon(milestone.icon, "w-4 h-4")}
                          </div>
                        )}
                        <h3 className="font-bold text-lg">
                          {milestone.title || `Milestone ${idx + 1}`}
                        </h3>
                      </div>
                      <span
                        className={`${statusInfo.bg} ${statusInfo.color} text-xs px-2 py-1 rounded-full font-medium`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {milestone.description}
                      </p>
                    )}
                    {milestone.image && (
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    {milestone.date && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(milestone.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline Horizontal Layout */}
      {layout === "timeline-horizontal" && milestones.length > 0 && (
        <div className="relative overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {milestones.map((milestone: any, idx: number) => {
              const statusInfo = getStatusInfo(milestone.status);

              return (
                <div key={idx} className="relative">
                  <div className="w-64 bg-white border rounded-lg p-4">
                    {milestone.image && (
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <div className="flex items-start gap-2 mb-2">
                      {milestone.icon && (
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                          {renderIcon(milestone.icon, "w-4 h-4")}
                        </div>
                      )}
                      <h3 className="font-semibold text-sm">
                        {milestone.title || `Milestone ${idx + 1}`}
                      </h3>
                    </div>
                    {milestone.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {milestone.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {milestone.date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(milestone.date).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </p>
                      )}
                      <span
                        className={`${statusInfo.bg} ${statusInfo.color} text-xs px-2 py-0.5 rounded-full font-medium`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="absolute top-1/2 right-0 transform translate-x-full w-4 h-0.5 bg-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestone Cards Layout */}
      {layout === "milestone-cards" && milestones.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestones.map((milestone: any, idx: number) => {
            const statusInfo = getStatusInfo(milestone.status);

            return (
              <div
                key={idx}
                className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {milestone.image ? (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`${statusInfo.bg} ${statusInfo.color} text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    {milestone.icon ? (
                      <div className="text-blue-600">
                        {renderIcon(milestone.icon, "w-16 h-16")}
                      </div>
                    ) : (
                      <statusInfo.icon
                        className={`w-16 h-16 ${statusInfo.color}`}
                      />
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {milestone.icon && milestone.image && (
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                        {renderIcon(milestone.icon, "w-4 h-4")}
                      </div>
                    )}
                    <h3 className="font-bold text-lg">
                      {milestone.title || `Milestone ${idx + 1}`}
                    </h3>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {milestone.description}
                    </p>
                  )}
                  {milestone.date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(milestone.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Roadmap View Layout */}
      {layout === "roadmap-view" && milestones.length > 0 && (
        <div className="space-y-8">
          {["completed", "in-progress", "upcoming", "planned"].map((status) => {
            const filtered = milestones.filter((m: any) => m.status === status);
            if (filtered.length === 0) return null;

            const statusInfo = getStatusInfo(status);

            return (
              <div key={status} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${statusInfo.bg} rounded-lg flex items-center justify-center`}
                  >
                    <statusInfo.icon
                      className={`w-5 h-5 ${statusInfo.color}`}
                    />
                  </div>
                  <h3 className="font-bold text-lg">{statusInfo.text}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({filtered.length})
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered.map((milestone: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {milestone.icon && (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {renderIcon(milestone.icon, "w-5 h-5")}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {milestone.title}
                          </h4>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {milestone.description}
                            </p>
                          )}
                          {milestone.date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(milestone.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievement List Layout */}
      {layout === "achievement-list" && milestones.length > 0 && (
        <div className="space-y-4">
          {milestones.map((milestone: any, idx: number) => {
            const statusInfo = getStatusInfo(milestone.status);

            return (
              <div
                key={idx}
                className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${statusInfo.bg} bg-opacity-50 hover:bg-opacity-100 transition-all`}
                style={{ borderColor: statusInfo.color.replace("text-", "") }}
              >
                {milestone.image ? (
                  <img
                    src={milestone.image}
                    alt={milestone.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                ) : milestone.icon ? (
                  <div
                    className={`w-20 h-20 ${statusInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    {renderIcon(
                      milestone.icon,
                      "w-10 h-10 " + statusInfo.color
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-20 h-20 ${statusInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <statusInfo.icon
                      className={`w-10 h-10 ${statusInfo.color}`}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">
                      {milestone.title || `Milestone ${idx + 1}`}
                    </h3>
                    <span
                      className={`${statusInfo.bg} ${statusInfo.color} text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1`}
                    >
                      <statusInfo.icon className="w-3 h-3" />
                      {statusInfo.text}
                    </span>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {milestone.description}
                    </p>
                  )}
                  {milestone.date && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(milestone.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ModuleContainer>
  );
};
