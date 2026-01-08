"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  TrendingUp,
  Quote,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface SuccessStoriesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

interface Story {
  title: string;
  author: string;
  role: string;
  story: string;
  results: string;
  image?: string;
  category?: string;
  date?: string;
}

interface LayoutProps {
  content: {
    title?: string;
    description?: string;
    stories: Story[];
  };
}

const StoryCards = ({ content }: LayoutProps) => {
  const { stories } = content;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map((story, idx) => (
        <div
          key={idx}
          className="group bg-white rounded-4xl border border-slate-100 hover:border-blue-100 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full"
        >
          {story.image && (
            <div className="relative h-64 overflow-hidden shrink-0">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {story.category && (
                <div className="absolute top-6 right-6">
                  <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                    {story.category}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-2">
              {story.title}
            </h3>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <User size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-slate-900 truncate">
                  {story.author}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                  {story.role}
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-4 italic">
              "{story.story}"
            </p>

            <div className="mt-auto space-y-6">
              {story.results && (
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
                  <div className="flex items-start gap-2">
                    <TrendingUp
                      className="text-green-600 mt-1 shrink-0"
                      size={16}
                    />
                    <p className="text-xs font-black text-green-800 leading-normal line-clamp-2">
                      {story.results}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {story.date && (
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                    <Calendar size={12} />
                    {new Date(story.date).toLocaleDateString()}
                  </div>
                )}
                {/* <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700">
                  Full Story
                </button> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FeaturedStory = ({ content }: LayoutProps) => {
  const { stories } = content;
  const featured = stories[0];

  if (!featured) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="group relative bg-[#1e293b] rounded-[2.5rem] md:rounded-[4rem] border border-white/10 p-8 md:p-20 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center hover:bg-[#253247] hover:border-blue-500/30 transition-all duration-700 overflow-hidden">
        {/* Visual Element */}
        <div className="absolute top-10 right-10 text-[6rem] md:text-[10rem] font-black text-white/5 select-none leading-none z-0 group-hover:text-blue-500/10 transition-colors pointer-events-none">
          01
        </div>

        <div className="relative shrink-0 z-10">
          <div className="absolute -inset-6 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-4 border-white/5 relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-700">
            {featured.image ? (
              <img
                src={featured.image}
                alt={featured.author}
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-6xl">
                👤
              </div>
            )}
          </div>
          <div className="absolute -bottom-8 -right-8 bg-blue-600 p-6 rounded-3xl shadow-2xl z-20 -rotate-12 group-hover:rotate-0 transition-transform duration-500 hidden md:block">
            <Sparkles className="text-white" size={32} />
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
            Top Story
          </div>

          <h3 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tighter text-white">
            {featured.title}
          </h3>

          <div className="relative mb-12">
            <Quote className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-16 h-16 md:w-24 md:h-24 text-white/5 -z-10" />
            <p className="text-lg md:text-2xl text-slate-300 font-medium leading-relaxed italic relative z-10">
              "{featured.story}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pt-12 border-t border-white/10">
            <div>
              <div className="text-sm font-black text-white">
                {featured.author}
              </div>
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {featured.role}
              </div>
            </div>
            {featured.results && (
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                <TrendingUp
                  className="text-green-400 shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-sm font-black text-slate-200 leading-tight">
                  {featured.results}
                </p>
              </div>
            )}
          </div>

          {/* <button className="group/btn inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
            Read Full Deep Dive
            <ArrowRight
              className="group-hover/btn:translate-x-2 transition-transform"
              size={18}
            />
          </button> */}
        </div>
      </div>
    </div>
  );
};

const StoryTimeline = ({ content }: LayoutProps) => {
  const { stories } = content;

  return (
    <div className="mt-12 md:mt-20 max-w-5xl mx-auto relative">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 md:-translate-x-1/2" />

      <div className="space-y-16">
        {stories.map((story, idx) => (
          <div
            key={idx}
            className={cn(
              "relative flex flex-col md:flex-row items-center gap-12",
              idx % 2 === 0 ? "md:flex-row-reverse" : ""
            )}
          >
            {/* Timeline Dot */}
            <div className="absolute left-6 md:left-1/2 top-12 md:top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-blue-600 shadow-xl z-10 -translate-x-[14px] md:-translate-x-1/2" />

            <div className="w-full md:w-1/2 pl-16 md:pl-0">
              <div
                className={cn(
                  "bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] hover:bg-white hover:border-blue-100 hover:shadow-2xl transition-all duration-500 group",
                  idx % 2 === 0 ? "md:text-right" : "md:text-left"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 mb-6",
                    idx % 2 === 0 ? "md:justify-end" : "md:justify-start"
                  )}
                >
                  {story.date && (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
                      {new Date(story.date).getFullYear()}
                    </span>
                  )}
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Success Story
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-8 italic">
                  "{story.story}"
                </p>

                <div
                  className={cn(
                    "flex items-center gap-4 mb-8",
                    idx % 2 === 0 ? "md:justify-end" : "md:justify-start"
                  )}
                >
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      {story.author}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {story.role}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                    <User size={20} className="text-slate-400" />
                  </div>
                </div>

                {story.results && (
                  <div
                    className={cn(
                      "bg-white border border-blue-100 p-4 rounded-2xl flex items-start gap-3",
                      idx % 2 === 0
                        ? "md:flex-row-reverse md:text-right"
                        : "md:text-left"
                    )}
                  >
                    <TrendingUp className="text-blue-600 shrink-0" size={18} />
                    <p className="text-xs font-black text-slate-700 leading-tight">
                      {story.results}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 justify-center hidden md:flex">
              <div className="w-32 h-32 rounded-full bg-slate-100/50 flex items-center justify-center text-slate-200 text-6xl font-black">
                {idx + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialWall = ({ content }: LayoutProps) => {
  const { stories } = content;

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
      {stories.map((story, idx) => (
        <div
          key={idx}
          className="break-inside-avoid bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all duration-500 group"
        >
          <Quote
            className="text-blue-600 mb-8 opacity-50 group-hover:opacity-100 transition-opacity"
            size={40}
          />

          <p className="text-lg font-medium leading-relaxed italic mb-10 text-slate-200">
            "{story.story}"
          </p>

          {story.results && (
            <div className="bg-blue-600/20 border border-blue-500/30 p-6 rounded-2xl mb-12">
              <div className="flex items-start gap-3">
                <TrendingUp className="text-blue-400 mt-1 shrink-0" size={18} />
                <p className="text-sm font-black text-blue-100 leading-normal">
                  {story.results}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-8 border-t border-white/5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-800">
              {story.image ? (
                <img
                  src={story.image}
                  alt={story.author}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-black truncate text-white">
                {story.author}
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
                {story.role}
              </div>
            </div>
            {story.category && (
              <div className="ml-auto shrink-0">
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] border border-blue-400/30 px-2 py-1 rounded-md">
                  {story.category}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const SuccessStoriesModule = ({
  module,
  previewDevice,
}: SuccessStoriesModuleProps) => {
  const { content, layout } = module;
  const stories = content.stories || [];

  if (stories.length === 0) {
    return (
      <ModuleContainer>
        <ModuleHeader
          title={content.title || "Success Stories"}
          description={
            content.description || "Real journeys and amazing results"
          }
        />
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-muted-foreground">
            No success stories added yet. Add stories in the settings panel.
          </p>
        </div>
      </ModuleContainer>
    );
  }

  // Determine if dark mode background is needed
  const isDark = layout === "testimonial-wall" || layout === "featured-story";

  return (
    <ModuleContainer
      className={cn(
        isDark && "bg-slate-950 text-white py-24",
        !isDark && "py-24"
      )}
      containerSettings={{ fullWidth: layout === "featured-story" }}
    >
      <ModuleHeader
        title={content.title || "Success Stories"}
        description={content.description || "Real journeys and amazing results"}
        alignment="center"
        containerClassName={cn("mb-16", isDark && "text-white")}
        descriptionClassName={cn(isDark && "text-slate-400")}
      />

      {layout === "story-cards" && <StoryCards content={content as any} />}
      {layout === "featured-story" && (
        <FeaturedStory content={content as any} />
      )}
      {layout === "story-timeline" && (
        <StoryTimeline content={content as any} />
      )}
      {layout === "testimonial-wall" && (
        <TestimonialWall content={content as any} />
      )}
      {/* Fallback to story cards */}
      {![
        "story-cards",
        "featured-story",
        "story-timeline",
        "testimonial-wall",
      ].includes(layout) && <StoryCards content={content as any} />}
    </ModuleContainer>
  );
};
