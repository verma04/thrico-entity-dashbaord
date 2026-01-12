import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface MembersAroundWorldModuleProps {
  module: ModuleData;
  previewDevice: "desktop" | "tablet" | "mobile";
}

export const MembersAroundWorldModule = ({
  module,
  previewDevice,
}: MembersAroundWorldModuleProps) => {
  const { content, layout } = module;
  const locations = content.locations || [];

  // Calculate totals for various layouts
  const totalMembers = locations.reduce(
    (sum: number, loc: any) => sum + (loc.memberCount || 0),
    0
  );
  const totalCountries = locations.length;
  const continents = [
    ...new Set(locations.map((loc: any) => loc.continent)),
  ].filter(Boolean);
  const totalContinents = continents.length || 6;

  // Sort locations by member count for leaderboard
  const sortedLocations = [...locations].sort(
    (a: any, b: any) => (b.memberCount || 0) - (a.memberCount || 0)
  );

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🌍</div>
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          titleClassName="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          descriptionClassName="text-lg max-w-2xl mx-auto"
          titleColor={content.titleColor}
          descriptionColor={content.descriptionColor}
          hideTitle={content.hideTitle}
          hideDescription={content.hideDescription}
        />
      </div>

      {locations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">
            No locations added yet. Add locations in the settings panel.
          </p>
        </div>
      )}

      {/* 1. WORLD MAP HEATMAP */}
      {layout === "world-map-heatmap" && locations.length > 0 && (
        <div className="space-y-8">
          <div className="bg-white border-2 rounded-2xl p-8 min-h-[500px] relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-40"></div>
            <div className="relative">
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold mb-2">
                  Global Member Distribution
                </h3>
                <p className="text-muted-foreground">
                  Heatmap showing {totalMembers.toLocaleString()} members across{" "}
                  {totalCountries} countries
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {locations.map((location: any, idx: number) => {
                  const intensity =
                    (location.memberCount || 0) /
                    Math.max(...locations.map((l: any) => l.memberCount || 1));
                  const Content = (
                    <div
                      className="bg-white border rounded-lg p-4 text-center hover:shadow-lg transition-all h-full"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${
                          0.1 + intensity * 0.6
                        })`,
                      }}
                    >
                      <div className="text-3xl mb-2">
                        {location.flag || "🌍"}
                      </div>
                      <h3 className="font-bold text-sm mb-1">
                        {location.country || `Country ${idx + 1}`}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {location.memberCount || 0} members
                      </p>
                    </div>
                  );

                  return location.link ? (
                    <a
                      key={idx}
                      href={location.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full transition-transform hover:scale-105"
                    >
                      {Content}
                    </a>
                  ) : (
                    <div key={idx} className="h-full">
                      {Content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COUNTRY STATS GRID */}
      {layout === "country-stats-grid" && locations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {locations.map((location: any, idx: number) => {
            const Content = (
              <div className="bg-white border-2 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105 group h-full">
                <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-7xl relative">
                  {location.flag || "🌍"}
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold">
                    #{idx + 1}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">
                    {location.country || `Country ${idx + 1}`}
                  </h3>
                  {location.city && (
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                      📍 {location.city}
                    </p>
                  )}
                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {location.memberCount || 0}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      members
                    </span>
                  </div>
                  {location.growth && (
                    <div className="mt-3 text-center">
                      <span className="text-sm text-green-600 font-semibold">
                        ↗ {location.growth}% growth
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );

            return location.link ? (
              <a
                key={idx}
                href={location.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                {Content}
              </a>
            ) : (
              <div key={idx} className="h-full">
                {Content}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. INTERACTIVE GLOBE */}
      {layout === "interactive-globe" && locations.length > 0 && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-12 min-h-[600px] relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
            <div className="relative text-center">
              <div className="text-9xl mb-6 animate-pulse">🌐</div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Interactive 3D Globe
              </h3>
              <p className="text-white/80 text-lg mb-8">
                Explore {totalMembers.toLocaleString()} members across{" "}
                {totalCountries} countries
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {locations.slice(0, 8).map((location: any, idx: number) => {
                  const Content = (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all cursor-pointer h-full">
                      <div className="text-4xl mb-2">
                        {location.flag || "🌍"}
                      </div>
                      <h3 className="font-bold text-white text-sm mb-1">
                        {location.country || `Country ${idx + 1}`}
                      </h3>
                      <p className="text-xs text-white/70">
                        {location.memberCount || 0} members
                      </p>
                    </div>
                  );

                  return location.link ? (
                    <a
                      key={idx}
                      href={location.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {Content}
                    </a>
                  ) : (
                    <div key={idx} className="h-full">
                      {Content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. REGIONAL CARDS */}
      {layout === "regional-cards" && locations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {continents.map((continent: any, idx: number) => {
            const regionLocations = locations.filter(
              (loc: any) => loc.continent === continent
            );
            const regionMembers = regionLocations.reduce(
              (sum: number, loc: any) => sum + (loc.memberCount || 0),
              0
            );
            const regionGrowth =
              regionLocations.reduce(
                (sum: number, loc: any) => sum + (loc.growth || 0),
                0
              ) / regionLocations.length;

            return (
              <div
                key={idx}
                className="bg-white border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
                  <div className="text-6xl mb-4">
                    {continent === "Asia"
                      ? "🌏"
                      : continent === "Europe"
                      ? "🌍"
                      : continent === "Africa"
                      ? "🌍"
                      : continent === "North America"
                      ? "🌎"
                      : continent === "South America"
                      ? "🌎"
                      : "🌏"}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">
                    {continent || `Region ${idx + 1}`}
                  </h3>
                  <p className="text-white/80">
                    {regionLocations.length} countries
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {regionMembers.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Members
                      </div>
                    </div>
                    {regionGrowth > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          +{regionGrowth.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Growth
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {regionLocations
                      .slice(0, 3)
                      .map((loc: any, locIdx: number) => {
                        const Item = (
                          <span className="flex items-center gap-2">
                            <span>{loc.flag}</span>
                            <span>{loc.country}</span>
                          </span>
                        );

                        return (
                          <div
                            key={locIdx}
                            className="flex items-center justify-between text-sm"
                          >
                            {loc.link ? (
                              <a
                                href={loc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-2"
                              >
                                {Item}
                              </a>
                            ) : (
                              Item
                            )}
                            <span className="font-semibold">
                              {loc.memberCount || 0}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. PIN-DROP MAP */}
      {layout === "pin-drop-map" && locations.length > 0 && (
        <div className="space-y-8">
          <div className="bg-white border-2 rounded-2xl p-8 min-h-[500px] relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
            <div className="relative">
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">📍</div>
                <h3 className="text-2xl font-bold mb-2">
                  Member Locations Worldwide
                </h3>
                <p className="text-muted-foreground">
                  {totalCountries} pin drops marking our global community
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {locations.map((location: any, idx: number) => {
                  const Content = (
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 text-center hover:shadow-lg transition-all hover:scale-105 relative h-full">
                      <div className="absolute -top-3 -right-3 text-3xl">
                        📍
                      </div>
                      <div className="text-4xl mb-2">
                        {location.flag || "🌍"}
                      </div>
                      <h3 className="font-bold mb-1">
                        {location.country || `Country ${idx + 1}`}
                      </h3>
                      {location.city && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {location.city}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-red-600">
                        {location.memberCount || 0} members
                      </p>
                    </div>
                  );

                  return location.link ? (
                    <a
                      key={idx}
                      href={location.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {Content}
                    </a>
                  ) : (
                    <div key={idx} className="h-full">
                      {Content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MEMBER DENSITY CHART */}
      {layout === "member-density-chart" && locations.length > 0 && (
        <div className="bg-white border-2 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-2">
              Member Density by Country
            </h3>
            <p className="text-muted-foreground">
              Visual comparison of member distribution
            </p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {sortedLocations.map((location: any, idx: number) => {
              const maxCount = sortedLocations[0]?.memberCount || 1;
              const percentage = ((location.memberCount || 0) / maxCount) * 100;

              return location.link ? (
                <a
                  key={idx}
                  href={location.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between group-hover:text-blue-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {location.flag || "🌍"}
                        </span>
                        <span className="font-semibold">
                          {location.country || `Country ${idx + 1}`}
                        </span>
                      </div>
                      <span className="font-bold text-lg">
                        {location.memberCount || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-purple-700"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </a>
              ) : (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{location.flag || "🌍"}</span>
                      <span className="font-semibold">
                        {location.country || `Country ${idx + 1}`}
                      </span>
                    </div>
                    <span className="font-bold text-lg">
                      {location.memberCount || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TOP COUNTRIES LEADERBOARD */}
      {layout === "top-countries-leaderboard" && locations.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Top Countries Leaderboard
              </h3>
              <p className="text-muted-foreground">Ranked by member count</p>
            </div>
            <div className="space-y-4">
              {sortedLocations.map((location: any, idx: number) => {
                const Content = (
                  <div
                    className={cn(
                      "bg-white border-2 rounded-xl p-6 flex items-center gap-6 hover:shadow-lg transition-all h-full",
                      idx === 0 &&
                        "border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50",
                      idx === 1 &&
                        "border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50",
                      idx === 2 &&
                        "border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50"
                    )}
                  >
                    <div className="text-4xl font-bold w-12 text-center">
                      {idx === 0
                        ? "🥇"
                        : idx === 1
                        ? "🥈"
                        : idx === 2
                        ? "🥉"
                        : `#${idx + 1}`}
                    </div>
                    <div className="text-5xl">{location.flag || "🌍"}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1">
                        {location.country || `Country ${idx + 1}`}
                      </h3>
                      {location.city && (
                        <p className="text-sm text-muted-foreground">
                          📍 {location.city}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {location.memberCount || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        members
                      </div>
                    </div>
                  </div>
                );

                return location.link ? (
                  <a
                    key={idx}
                    href={location.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-transform hover:scale-[1.01]"
                  >
                    {Content}
                  </a>
                ) : (
                  <div key={idx}>{Content}</div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 8. CONTINENTS BREAKDOWN */}
      {layout === "continents-breakdown" && locations.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continents.map((continent: any, idx: number) => {
              const regionLocations = locations.filter(
                (loc: any) => loc.continent === continent
              );
              const regionMembers = regionLocations.reduce(
                (sum: number, loc: any) => sum + (loc.memberCount || 0),
                0
              );
              const percentage = ((regionMembers / totalMembers) * 100).toFixed(
                1
              );

              return (
                <div
                  key={idx}
                  className="bg-white border-2 rounded-2xl p-8 hover:shadow-2xl transition-all"
                >
                  <div className="text-center mb-6">
                    <div className="text-7xl mb-4">
                      {continent === "Asia"
                        ? "🌏"
                        : continent === "Europe"
                        ? "🌍"
                        : continent === "Africa"
                        ? "🌍"
                        : continent === "North America"
                        ? "🌎"
                        : continent === "South America"
                        ? "🌎"
                        : "🌏"}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {continent || `Continent ${idx + 1}`}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {percentage}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        of total members
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {regionLocations.length} countries
                      </span>
                      <span className="font-bold">
                        {regionMembers.toLocaleString()} members
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. MINIMAL STATS ROW */}
      {layout === "minimal-stats-row" && locations.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center">
              <div className="space-y-2">
                <div className="text-6xl font-bold">{totalCountries}+</div>
                <div className="text-xl opacity-90">Countries</div>
              </div>
              <div className="hidden md:block text-4xl opacity-50">|</div>
              <div className="space-y-2">
                <div className="text-6xl font-bold">
                  {totalMembers.toLocaleString()}+
                </div>
                <div className="text-xl opacity-90">Members</div>
              </div>
              <div className="hidden md:block text-4xl opacity-50">|</div>
              <div className="space-y-2">
                <div className="text-6xl font-bold">{totalContinents}</div>
                <div className="text-xl opacity-90">Continents</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. PHOTO MOSAIC BY REGION */}
      {layout === "photo-mosaic-region" && locations.length > 0 && (
        <div className="space-y-12">
          {continents.map((continent: any, idx: number) => {
            const regionLocations = locations.filter(
              (loc: any) => loc.continent === continent
            );

            return (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">
                    {continent === "Asia"
                      ? "🌏"
                      : continent === "Europe"
                      ? "🌍"
                      : continent === "Africa"
                      ? "🌍"
                      : continent === "North America"
                      ? "🌎"
                      : continent === "South America"
                      ? "🌎"
                      : "🌏"}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">
                      {continent || `Region ${idx + 1}`}
                    </h3>
                    <p className="text-muted-foreground">
                      {regionLocations.reduce(
                        (sum: number, loc: any) => sum + (loc.memberCount || 0),
                        0
                      )}{" "}
                      members across {regionLocations.length} countries
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {regionLocations.map((location: any, locIdx: number) => {
                    const Content = (
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:scale-105 relative group h-full w-full">
                        {location.image ? (
                          <img
                            src={location.image}
                            alt={location.country}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            {location.flag || "🌍"}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3">
                          <div className="text-white text-center">
                            <div className="font-bold text-sm mb-1">
                              {location.country}
                            </div>
                            <div className="text-xs">
                              {location.memberCount || 0} members
                            </div>
                          </div>
                        </div>
                      </div>
                    );

                    return location.link ? (
                      <a
                        key={locIdx}
                        href={location.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {Content}
                      </a>
                    ) : (
                      <div key={locIdx}>{Content}</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ModuleContainer>
  );
};
