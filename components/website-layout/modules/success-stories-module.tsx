"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Calendar, User, TrendingUp, Quote } from "lucide-react";

interface SuccessStoriesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const SuccessStoriesModule = ({
  module,
  previewDevice,
}: SuccessStoriesModuleProps) => {
  const { content, layout } = module;
  const stories = content.stories || [];

  // Empty state
  if (stories.length === 0) {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-slate-50 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              {content.title || "Success Stories"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {content.description || "Real journeys and amazing results"}
            </p>
          </div>
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg border mx-4">
            <p className="text-muted-foreground text-sm sm:text-base px-4">
              No success stories added yet. Add stories in the settings panel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Layout 1: Story Cards (Grid of cards with images)
  if (layout === "story-cards") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-slate-50 to-white border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {content.title || "Success Stories"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {content.description || "Real journeys and amazing results"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {stories.map((story: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {story.image && (
                  <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title || `Story ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {story.category && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                        {story.category}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 line-clamp-2">
                    {story.title || `Success Story ${idx + 1}`}
                  </h3>

                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">
                        {story.author}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {story.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                    {story.story}
                  </p>

                  {story.results && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 sm:p-3 mb-2 sm:mb-3">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-800 font-medium line-clamp-2">
                          {story.results}
                        </p>
                      </div>
                    </div>
                  )}

                  {story.date && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(story.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout 2: Testimonial Wall (Quote-focused design)
  if (layout === "testimonial-wall") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-slate-900 text-white border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {content.title || "Success Stories"}
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              {content.description || "Real journeys and amazing results"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {stories.map((story: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 sm:p-6 md:p-8 hover:bg-slate-800 transition-colors"
              >
                <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4 opacity-50" />

                <p className="text-base sm:text-lg mb-4 sm:mb-6 italic leading-relaxed">
                  "{story.story}"
                </p>

                {story.results && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-green-400 font-medium flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{story.results}</span>
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-700 flex-wrap">
                  {story.image && (
                    <img
                      src={story.image}
                      alt={story.author}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base truncate">
                      {story.author}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400 truncate">
                      {story.role}
                    </p>
                  </div>
                  {story.category && (
                    <div className="ml-auto">
                      <span className="text-xs bg-primary/20 text-primary px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                        {story.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout 3: Story Timeline (Vertical timeline layout)
  if (layout === "story-timeline") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-white border-y">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {content.title || "Success Stories"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {content.description || "Real journeys and amazing results"}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            <div className="space-y-8 sm:space-y-12">
              {stories.map((story: any, idx: number) => (
                <div key={idx} className="relative pl-12 sm:pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 sm:left-6 top-4 sm:top-6 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full border-2 sm:border-4 border-white shadow-lg" />

                  <div className="bg-slate-50 rounded-xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow">
                    {story.date && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(story.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {story.image && (
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full sm:w-24 md:w-32 h-48 sm:h-24 md:h-32 rounded-lg object-cover flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
                          {story.title || `Success Story ${idx + 1}`}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm">
                          <p className="font-semibold truncate">
                            {story.author}
                          </p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-muted-foreground truncate">
                            {story.role}
                          </p>
                          {story.category && (
                            <>
                              <span className="text-muted-foreground hidden sm:inline">
                                •
                              </span>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                                {story.category}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3">
                          {story.story}
                        </p>

                        {story.results && (
                          <div className="bg-green-50 border-l-4 border-green-500 p-2.5 sm:p-3 rounded">
                            <p className="text-xs sm:text-sm text-green-800 font-medium flex items-start gap-2">
                              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">
                                {story.results}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout 4: Featured Story (Large hero-style cards)
  if (layout === "featured-story") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              {content.title || "Success Stories"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {content.description || "Real journeys and amazing results"}
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {stories.map((story: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col",
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {story.image && (
                  <div className="md:w-1/2 relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] object-cover"
                    />
                    {story.category && (
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-white/90 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                        {story.category}
                      </div>
                    )}
                  </div>
                )}

                <div className="md:w-1/2 p-6 sm:p-8 md:p-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 line-clamp-2">
                    {story.title || `Success Story ${idx + 1}`}
                  </h3>

                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-base sm:text-lg md:text-xl font-bold flex-shrink-0">
                      {story.author?.charAt(0) || "S"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-base sm:text-lg truncate">
                        {story.author}
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground truncate">
                        {story.role}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-4 sm:line-clamp-none">
                      {story.story}
                    </p>
                  </div>

                  {story.results && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-green-900 mb-1 text-sm sm:text-base">
                            Key Results
                          </p>
                          <p className="text-xs sm:text-sm text-green-800 line-clamp-2">
                            {story.results}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {story.date && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">
                        Published{" "}
                        {new Date(story.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="p-12 bg-slate-50 border-y">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {content.title || "Success Stories"}
          </h2>
          <p className="text-muted-foreground">
            {content.description || "Real journeys and amazing results"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                {story.title || `Success Story ${idx + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {story.author} • {story.role}
              </p>
              <p className="text-sm text-muted-foreground">{story.story}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
