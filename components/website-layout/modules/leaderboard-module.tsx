"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Crown, Trophy, Medal, Star } from "lucide-react";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface LeaderboardModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const LeaderboardModule = ({
  module,
  previewDevice,
}: LeaderboardModuleProps) => {
  const { content, layout } = module;
  const rankings = content.rankings || [];
  const isMobile = previewDevice === "mobile";

  // Rank List Layout (Default)
  if (layout === "rank-list" || !layout) {
    return (
      <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50 border-y">
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="center"
        />

          {rankings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-muted-foreground">
                No leaderboard entries yet. Add entries in the settings panel.
              </p>
            </div>
          )}

          {rankings.length > 0 && (
            <div className="bg-white rounded-lg border overflow-hidden">
              {rankings.map((ranking: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-center p-4 border-b last:border-b-0 ${
                    idx < 3
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50"
                      : ""
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                    {idx < 3 ? ["🥇", "🥈", "🥉"][idx] : idx + 1}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full ml-4 overflow-hidden flex items-center justify-center">
                    {ranking.avatar ? (
                      <img
                        src={ranking.avatar}
                        alt={ranking.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">
                      {ranking.name || `Member ${idx + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {ranking.score || 1000 - idx * 50} points
                    </p>
                  </div>
                  {idx < 3 && <Crown className="h-5 w-5 text-yellow-500" />}
                </div>
              ))}
            </div>
          )}
      </ModuleContainer>
    );
  }

  // Podium View Layout
  if (layout === "podium-view") {
    const topThree = rankings.slice(0, 3);
    const remaining = rankings.slice(3);

    return (
      <div className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Top Champions"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {content.description || "Celebrating our community heroes"}
            </p>
          </div>

          {topThree.length > 0 && (
            <div className="flex items-end justify-center mb-12 gap-8">
              {/* Second Place */}
              {topThree[1] && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-4 overflow-hidden border-4 border-gray-200 flex items-center justify-center">
                    {topThree[1].avatar ? (
                      <img
                        src={topThree[1].avatar}
                        alt={topThree[1].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-white">👤</span>
                    )}
                  </div>
                  <div className="bg-gradient-to-t from-gray-400 to-gray-300 p-6 rounded-t-lg h-24 flex flex-col justify-end">
                    <Medal className="h-6 w-6 text-white mx-auto mb-2" />
                    <p className="font-bold text-white">{topThree[1].name}</p>
                    <p className="text-gray-100 text-sm">
                      {topThree[1].score} pts
                    </p>
                  </div>
                </div>
              )}

              {/* First Place */}
              {topThree[0] && (
                <div className="text-center">
                  <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full mx-auto mb-4 overflow-hidden border-4 border-yellow-200 flex items-center justify-center">
                    {topThree[0].avatar ? (
                      <img
                        src={topThree[0].avatar}
                        alt={topThree[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-white">👤</span>
                    )}
                  </div>
                  <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 p-6 rounded-t-lg h-32 flex flex-col justify-end">
                    <Trophy className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="font-bold text-white text-lg">
                      {topThree[0].name}
                    </p>
                    <p className="text-yellow-100">{topThree[0].score} pts</p>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full mx-auto mb-4 overflow-hidden border-4 border-orange-200 flex items-center justify-center">
                    {topThree[2].avatar ? (
                      <img
                        src={topThree[2].avatar}
                        alt={topThree[2].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-white">👤</span>
                    )}
                  </div>
                  <div className="bg-gradient-to-t from-orange-400 to-orange-300 p-6 rounded-t-lg h-20 flex flex-col justify-end">
                    <Star className="h-5 w-5 text-white mx-auto mb-2" />
                    <p className="font-bold text-white">{topThree[2].name}</p>
                    <p className="text-orange-100 text-sm">
                      {topThree[2].score} pts
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {remaining.length > 0 && (
            <div className="bg-white rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg p-4 border-b">
                Other Rankings
              </h3>
              {remaining.map((ranking: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center p-4 border-b last:border-b-0"
                >
                  <span className="w-8 text-center font-bold text-muted-foreground">
                    {idx + 4}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full ml-4 overflow-hidden flex items-center justify-center">
                    {ranking.avatar ? (
                      <img
                        src={ranking.avatar}
                        alt={ranking.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">👤</span>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium">{ranking.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ranking.score} points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Stats Board Layout
  if (layout === "stats-board") {
    return (
      <div className="p-12 bg-slate-900 text-white border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Performance Stats"}
            </h2>
            <p className="text-slate-400">
              {content.description || "Real-time community metrics"}
            </p>
          </div>

          {rankings.length > 0 && (
            <div
              className={cn(
                "grid gap-6",
                isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
              )}
            >
              {rankings.map((ranking: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-400">
                        #{idx + 1}
                      </span>
                      {idx < 3 && (
                        <Crown className="h-5 w-5 text-yellow-400 ml-2" />
                      )}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full overflow-hidden flex items-center justify-center">
                      {ranking.avatar ? (
                        <img
                          src={ranking.avatar}
                          alt={ranking.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {ranking.name || `Member ${idx + 1}`}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Points</p>
                      <p className="text-xl font-bold text-green-400">
                        {ranking.score || 1000 - idx * 50}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Rank</p>
                      <p className="text-xl font-bold text-blue-400">
                        {idx + 1}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.max(10, 100 - idx * 10)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Card Rankings Layout
  if (layout === "card-rankings") {
    return (
      <div className="p-12 bg-gradient-to-br from-purple-50 to-pink-50 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Top Performers"}
            </h2>
            <p className="text-muted-foreground">
              {content.description || "Outstanding community members"}
            </p>
          </div>

          {rankings.length > 0 && (
            <div
              className={cn(
                "grid gap-6",
                isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
              )}
            >
              {rankings.map((ranking: any, idx: number) => (
                <div
                  key={idx}
                  className={cn(
                    "bg-white rounded-xl p-6 shadow-lg border-2 transition-transform hover:scale-105",
                    idx === 0 &&
                      "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50",
                    idx === 1 &&
                      "border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50",
                    idx === 2 &&
                      "border-orange-300 bg-gradient-to-br from-orange-50 to-red-50",
                    idx > 2 && "border-gray-200"
                  )}
                >
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full mx-auto overflow-hidden flex items-center justify-center">
                        {ranking.avatar ? (
                          <img
                            src={ranking.avatar}
                            alt={ranking.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">👤</span>
                        )}
                      </div>
                      {idx < 3 && (
                        <div
                          className={cn(
                            "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                            idx === 0 && "bg-yellow-500",
                            idx === 1 && "bg-gray-400",
                            idx === 2 && "bg-orange-500"
                          )}
                        >
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {ranking.name || `Member ${idx + 1}`}
                    </h3>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {ranking.score || 1000 - idx * 50}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      points earned
                    </p>

                    {idx < 3 && (
                      <div className="flex justify-center">
                        {idx === 0 && (
                          <Trophy className="h-6 w-6 text-yellow-500" />
                        )}
                        {idx === 1 && (
                          <Medal className="h-6 w-6 text-gray-500" />
                        )}
                        {idx === 2 && (
                          <Star className="h-6 w-6 text-orange-500" />
                        )}
                      </div>
                    )}

                    {idx > 2 && (
                      <div className="text-lg font-bold text-muted-foreground">
                        #{idx + 1}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="p-12 bg-slate-50 border-y">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <p className="text-muted-foreground">
          Select a layout style to display the leaderboard.
        </p>
      </div>
    </div>
  );
};
