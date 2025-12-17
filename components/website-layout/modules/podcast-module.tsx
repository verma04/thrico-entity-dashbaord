import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface PodcastModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function PodcastModule({ module, previewDevice }: PodcastModuleProps) {
  const { layout, content } = module;
  const episodes = content.episodes || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-white border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {episodes.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border">
            <p className="text-muted-foreground">
              No episodes added yet. Add episodes in the settings panel.
            </p>
          </div>
        )}

        {/* Episode Grid Layout */}
        {layout === "episode-grid" && episodes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg border overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-purple-400 to-blue-500 overflow-hidden">
                  {episode.thumbnail && <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{episode.title || `Episode ${idx + 1}`}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {episode.description || "Engaging discussion about important topics."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {episode.duration || `${25 + idx * 5} min`}
                    </span>
                    <button className="text-purple-600 text-sm font-medium">
                      ▶ Play
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Episode Layout */}
        {layout === "featured-episode" && episodes.length > 0 && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-4xl overflow-hidden">
                  {episodes[0]?.thumbnail ? (
                    <img src={episodes[0].thumbnail} alt={episodes[0].title} className="w-full h-full object-cover" />
                  ) : (
                    "🎙️"
                  )}
                </div>
                <div className="flex-1">
                  <span className="bg-purple-500 bg-opacity-50 text-purple-100 text-sm px-3 py-1 rounded-full font-medium">
                    FEATURED EPISODE
                  </span>
                  <h3 className="text-2xl font-bold mt-3 mb-3">
                    {episodes[0]?.title || "The Future of Innovation"}
                  </h3>
                  <p className="text-purple-100 mb-4">
                    {episodes[0]?.description || "Deep dive into emerging trends and technologies that will shape our industry."}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                      ▶ Play Now
                    </button>
                    <span className="text-purple-200 text-sm">{episodes[0]?.duration || "45 minutes"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {episodes.slice(1).map((episode: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-6 rounded-lg border flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {episode.thumbnail ? (
                      <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
                    ) : (
                      "🎧"
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{episode.title || `Episode ${idx + 2}`}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {episode.description || "Key insights and expert perspectives."}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {episode.duration || `${30 + idx * 5} min`}
                      </span>
                      <button className="text-purple-600 text-sm font-medium">
                        ▶ Play
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Series List Layout */}
        {layout === "series-list" && episodes.length > 0 && (
          <div className="space-y-8">
            {[
              "Innovation Talks",
              "Expert Insights",
              "Community Conversations",
            ].map((series, seriesIdx) => (
              <div key={series} className="bg-gray-50 rounded-xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-purple-600">
                    {series}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {8 + seriesIdx * 3} episodes
                  </span>
                </div>
                <div className="space-y-4">
                  {episodes.slice(seriesIdx * 3, (seriesIdx + 1) * 3).map((episode: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-white rounded-lg"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {episode.thumbnail ? (
                          <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
                        ) : (
                          "🎙️"
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {episode.title || `Episode ${idx + 1}: Key Topics`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {episode.duration || `${20 + idx * 10} minutes`} {episode.date && `• ${episode.date}`}
                        </p>
                      </div>
                      <button className="text-purple-600 text-sm font-medium px-3 py-1 rounded border border-purple-200">
                        ▶ Play
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View Layout */}
        {layout === "list-view" && episodes.length > 0 && (
          <div className="space-y-6">
            {episodes.map((episode: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-lg border flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {episode.thumbnail ? (
                    <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
                  ) : (
                    "🎙️"
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    {episode.title || `Episode ${idx + 1}: Topic Title`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {episode.description || "Description of the episode content and key discussion points."}
                  </p>
                  <div className="flex items-center gap-4">
                    {episode.duration && (
                      <span className="text-xs text-muted-foreground">
                        {episode.duration}
                      </span>
                    )}
                    {episode.date && (
                      <span className="text-xs text-muted-foreground">
                        {episode.date}
                      </span>
                    )}
                  </div>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  Play ▶️
                </button>
              </div>
            ))}
          </div>
        )}
    </ModuleContainer>
  );
}
