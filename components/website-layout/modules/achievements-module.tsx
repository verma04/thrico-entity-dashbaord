"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface AchievementsModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const AchievementsModule = ({
  module,
  previewDevice,
}: AchievementsModuleProps) => {
  const { content, layout } = module;
  const achievements = content.achievements || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-white border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {achievements.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border">
            <p className="text-muted-foreground">
              No achievements added yet. Add achievements in the settings panel.
            </p>
          </div>
        )}

        {/* Badge Grid Layout */}
        {layout === "badge-grid" && achievements.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {achievements.map((achievement: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                  {achievement.icon ? (
                    <img src={achievement.icon} alt={achievement.title} className="w-full h-full object-contain" />
                  ) : (
                    "🏆"
                  )}
                </div>
                <h3 className="font-semibold text-sm text-center">
                  {achievement.title || `Award ${idx + 1}`}
                </h3>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {achievement.date || achievement.category || "2024"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Award Wall Layout */}
        {layout === "award-wall" && achievements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement: any, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-xl border border-yellow-200"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-yellow-200 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                    {achievement.icon ? (
                      <img src={achievement.icon} alt={achievement.title} className="w-full h-full object-contain p-2" />
                    ) : (
                      "🏅"
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-yellow-800">
                      {achievement.title || `Excellence Award ${idx + 1}`}
                    </h3>
                    <p className="text-yellow-700 text-sm mb-2">
                      {achievement.category || "Industry Recognition"} {achievement.date || "2024"}
                    </p>
                    {achievement.description && (
                      <p className="text-xs text-yellow-600">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Awards Layout */}
        {layout === "timeline-awards" && achievements.length > 0 && (
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-200" />
            {achievements.map((achievement: any, idx: number) => (
              <div
                key={idx}
                className="relative flex items-center mb-12 last:mb-0"
              >
                <div className="w-1/2 pr-8 text-right">
                  {idx % 2 === 0 && (
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <h3 className="font-semibold">{achievement.title || `Award ${idx + 1}`}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.date || achievement.category || "2024"}
                      </p>
                      {achievement.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white" />
                <div className="w-1/2 pl-8">
                  {idx % 2 === 1 && (
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <h3 className="font-semibold">{achievement.title || `Award ${idx + 1}`}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.date || achievement.category || "2024"}
                      </p>
                      {achievement.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carousel Badges Layout */}
        {layout === "carousel-badges" && achievements.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex gap-6 animate-pulse">
              {achievements.map((achievement: any, idx: number) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-32 h-40 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-xl border border-yellow-300 p-4 flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                    {achievement.icon ? (
                      <img src={achievement.icon} alt={achievement.title} className="w-full h-full object-contain" />
                    ) : (
                      "🏆"
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-center text-yellow-800">
                    {achievement.title || `Award ${idx + 1}`}
                  </h4>
                  <p className="text-xs text-yellow-600">{achievement.date || "2024"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
    </ModuleContainer>
  );
};
