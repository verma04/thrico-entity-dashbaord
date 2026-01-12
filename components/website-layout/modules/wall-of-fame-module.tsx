import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface WallOfFameModuleProps {
  module: ModuleData;
  previewDevice: "desktop" | "tablet" | "mobile";
}

export const WallOfFameModule: React.FC<WallOfFameModuleProps> = ({
  module,
  previewDevice,
}) => {
  const { content, layout } = module;
  const honorees = content.honorees || [];

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-black border-y"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        alignment="center"
        titleClassName="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
        showIcon
        icon={<div className="text-6xl mb-4">🏆</div>}
        layoutSettings={content.layoutSettings}
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {honorees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">
            No honorees added yet. Add honorees in the settings panel.
          </p>
        </div>
      )}

      {/* 1. PODIUM STYLE */}
      {layout === "podium" && honorees.length > 0 && (
        <div className="space-y-12">
          <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto">
            {/* 2nd Place */}
            {honorees[1] && (
              <div className="flex-1 text-center">
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-2xl p-8 pt-12">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden bg-white">
                    {honorees[1].image ? (
                      <img
                        src={honorees[1].image}
                        alt={honorees[1].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🥈
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1">
                    {honorees[1].name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {honorees[1].achievement}
                  </p>
                </div>
                <div className="bg-gray-400 text-white font-bold py-3 text-2xl">
                  2
                </div>
              </div>
            )}

            {/* 1st Place */}
            {honorees[0] && (
              <div className="flex-1 text-center">
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-t-2xl p-8 pt-16 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-5xl">
                    👑
                  </div>
                  <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl">
                    {honorees[0].image ? (
                      <img
                        src={honorees[0].image}
                        alt={honorees[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        🥇
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-xl mb-1">
                    {honorees[0].name}
                  </h3>
                  <p className="text-sm text-white/90">
                    {honorees[0].achievement}
                  </p>
                </div>
                <div className="bg-amber-500 text-white font-bold py-4 text-3xl">
                  1
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {honorees[2] && (
              <div className="flex-1 text-center">
                <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-t-2xl p-8 pt-10">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden bg-white">
                    {honorees[2].image ? (
                      <img
                        src={honorees[2].image}
                        alt={honorees[2].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🥉
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-white mb-1">
                    {honorees[2].name}
                  </h3>
                  <p className="text-xs text-white/80">
                    {honorees[2].achievement}
                  </p>
                </div>
                <div className="bg-orange-400 text-white font-bold py-2 text-xl">
                  3
                </div>
              </div>
            )}
          </div>

          {/* Rest of honorees */}
          {honorees.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {honorees.slice(3).map((honoree: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center overflow-hidden">
                    {honoree.image ? (
                      <img
                        src={honoree.image}
                        alt={honoree.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">⭐</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{honoree.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {honoree.achievement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. HALL OF FAME GRID */}
      {layout === "hall-grid" && honorees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {honorees.map((honoree: any, idx: number) => (
            <div
              key={idx}
              className="bg-white border-2 border-amber-200 rounded-xl p-6 text-center hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
              <div className="absolute top-2 right-2 text-xl">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "⭐"}
              </div>
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-amber-300 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                {honoree.image ? (
                  <img
                    src={honoree.image}
                    alt={honoree.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🏆
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2">{honoree.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {honoree.achievement}
              </p>
              {honoree.year && (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  {honoree.year}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. TIMELINE ACHIEVEMENTS */}
      {layout === "timeline" && honorees.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-4 border-amber-300 pl-8 space-y-8">
            {honorees.map((honoree: any, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-11 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-background flex items-center justify-center text-xs text-white font-bold">
                  {idx + 1}
                </div>
                <div className="bg-white border-2 border-amber-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full border-4 border-amber-300 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0">
                      {honoree.image ? (
                        <img
                          src={honoree.image}
                          alt={honoree.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🏆
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-xl">{honoree.name}</h3>
                        {honoree.year && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                            {honoree.year}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {honoree.achievement}
                      </p>
                      {honoree.description && (
                        <p className="text-sm text-muted-foreground">
                          {honoree.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FEATURED CARDS */}
      {layout === "featured-cards" && honorees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {honorees.map((honoree: any, idx: number) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white relative">
                <div className="absolute top-4 right-4 text-4xl opacity-50">
                  {idx === 0
                    ? "🥇"
                    : idx === 1
                    ? "🥈"
                    : idx === 2
                    ? "🥉"
                    : "🏆"}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                    {honoree.image ? (
                      <img
                        src={honoree.image}
                        alt={honoree.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        ⭐
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-1">{honoree.name}</h3>
                    {honoree.year && (
                      <p className="text-sm opacity-90">
                        Class of {honoree.year}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-2 text-amber-900">
                  {honoree.achievement}
                </h4>
                {honoree.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {honoree.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ModuleContainer>
  );
};
