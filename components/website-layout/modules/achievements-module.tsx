"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  Trophy,
  Award,
  Medal,
  Star,
  Calendar,
  ChevronRight,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface AchievementsModuleProps {
  module: ModuleData;
  previewDevice: string;
}

// Helper function to render icon from icon name or fallback
const renderAchievementIcon = (
  icon: string,
  fallback: React.ReactNode,
  className?: string
) => {
  if (!icon) return fallback;

  // Check if it's a URL
  if (
    icon.startsWith("http") ||
    icon.startsWith("/") ||
    icon.startsWith("data:")
  ) {
    return (
      <img
        src={icon}
        alt="Achievement"
        className={cn("w-full h-full object-contain", className)}
      />
    );
  }

  // Otherwise assume it's a Lucide icon name
  const IconComponent = (LucideIcons as any)[icon];
  if (!IconComponent) return fallback;
  return <IconComponent className={className} />;
};

export const AchievementsModule = ({
  module,
  previewDevice,
}: AchievementsModuleProps) => {
  const { content, layout } = module;
  const isMobile = previewDevice === "mobile";
  const achievements = content.achievements || [];

  const title = content.title || "Our Achievements";
  const description =
    content.description || "Celebrating excellence and industry recognition.";

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white"
    >
      <ModuleHeader
        title={title}
        description={description}
        layoutSettings={content.layoutSettings}
        alignment="center"
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      <div className="mt-16">
        {achievements.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-4xl border border-dashed border-slate-200">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              No achievements added yet.
            </p>
          </div>
        ) : (
          <>
            {/* Badge Grid Layout */}
            {layout === "badge-grid" && (
              <div
                className={cn(
                  "grid gap-8",
                  isMobile ? "grid-cols-1" : "md:grid-cols-3 lg:grid-cols-4"
                )}
              >
                {achievements.map((achievement: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative p-8 rounded-4xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                  >
                    <div className="mb-6 relative inline-block">
                      <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 overflow-hidden p-4">
                        {renderAchievementIcon(
                          achievement.icon,
                          <Award size={32} />
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg">
                        {idx + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">
                      {achievement.title || "Recognition Award"}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {achievement.date || achievement.category || "2024"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Award Wall Layout */}
            {layout === "award-wall" && (
              <div
                className={cn(
                  "grid gap-8",
                  isMobile ? "grid-cols-1" : "md:grid-cols-2"
                )}
              >
                {achievements.map((achievement: any, idx: number) => (
                  <div
                    key={idx}
                    className="group flex gap-8 p-8 rounded-4xl bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500 items-start overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                    <div className="shrink-0">
                      <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center overflow-hidden p-4">
                        {renderAchievementIcon(
                          achievement.icon,
                          <Medal size={40} className="text-yellow-400" />
                        )}
                      </div>
                    </div>
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          {achievement.category || "Achievement"}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight">
                        {achievement.title || "Industry Excellence Award"}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {achievement.description ||
                          "For outstanding contribution and leadership in the industry."}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                        <Calendar size={14} />
                        <span>{achievement.date || "2024"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline Awards Layout */}
            {layout === "timeline-awards" && (
              <div className="relative max-w-4xl mx-auto py-8">
                {/* Center Line */}
                <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2" />

                <div className="space-y-12">
                  {achievements.map((achievement: any, idx: number) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "relative flex items-center w-full",
                          isMobile
                            ? "flex-row"
                            : isEven
                            ? "flex-row"
                            : "flex-row-reverse"
                        )}
                      >
                        {/* Content Card */}
                        <div
                          className={cn(
                            "w-full md:w-[45%]",
                            isMobile
                              ? "pl-12"
                              : isEven
                              ? "text-right pr-12"
                              : "text-left pl-12"
                          )}
                        >
                          <div className="group p-6 rounded-3xl bg-white border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider mb-4">
                              {achievement.date || "2024"}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                              {achievement.title || "Milestone Award"}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              {achievement.description ||
                                "Recognized for driving significant impact and growth."}
                            </p>
                          </div>
                        </div>

                        {/* Timeline Pin */}
                        <div className="absolute left-[23px] md:left-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-lg -translate-x-1/2 z-10" />

                        {/* Spacer for desktop symmetry */}
                        <div className="hidden md:block w-[45%]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Carousel Badges Layout */}
            {layout === "carousel-badges" && (
              <div className="relative group">
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-4 -mx-4">
                  {achievements.map((achievement: any, idx: number) => (
                    <div
                      key={idx}
                      className="shrink-0 w-64 p-6 rounded-[2.5rem] bg-slate-900 text-white hover:translate-y-[-8px] transition-all duration-500"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 overflow-hidden p-3">
                        {renderAchievementIcon(
                          achievement.icon,
                          <Trophy size={32} className="text-blue-400" />
                        )}
                      </div>
                      <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                          {achievement.category || "Winner"}
                        </span>
                        <h3 className="text-lg font-bold mt-1 line-clamp-2 leading-tight">
                          {achievement.title || "Industry Leader"}
                        </h3>
                      </div>
                      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-xs font-bold text-slate-400">
                          {achievement.date || "2024"}
                        </span>
                        <ChevronRight className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ModuleContainer>
  );
};
