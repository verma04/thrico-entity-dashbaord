import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleContainer } from "../modules/module-container";
import { ModuleHeader } from "../modules/module-header";

export const TimelineRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const milestones =
    content.milestones ||
    content.events?.map((e: any) => ({ ...e, date: e.year })) ||
    [];

  const normalizedContent = { ...content, milestones };

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      <ModuleHeader
        title={content.title}
        description={content.description}
        alignment={content.alignment || content.align || "center"}
      />

      {layout === "card-timeline" && (
        <CardTimeline content={normalizedContent} />
      )}
      {layout === "horizontal-timeline" && (
        <HorizontalTimeline content={normalizedContent} />
      )}
      {layout === "minimal-timeline" && (
        <MinimalTimeline content={normalizedContent} />
      )}
      {layout === "vertical-timeline" && (
        <VerticalTimeline content={normalizedContent} />
      )}
      {layout === "zigzag-timeline" && (
        <ZigzagTimeline content={normalizedContent} />
      )}
      {!layout && <MinimalTimeline content={normalizedContent} />}
    </ModuleContainer>
  );
};

interface TimelineProps {
  content: {
    title?: string;
    subtitle?: string;
    milestones: {
      date: string;
      title: string;
      description: string;
      icon?: React.ReactNode;
    }[];
  };
}

const CardTimeline = ({ content }: TimelineProps) => {
  const { milestones } = content;

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-4">
      {milestones.map((milestone, index) => (
        <div
          key={index}
          className="group relative p-8 rounded-3xl bg-slate-50 border border-slate-100 h-full flex flex-col hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="text-4xl font-black text-slate-100 absolute top-4 right-6 group-hover:text-slate-200 transition-colors">
            {index + 1}
          </div>

          <div className="relative z-10 flex-1">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              {milestone.date}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {milestone.title}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {milestone.description}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-slate-400 group-hover:text-slate-900 transition-colors duration-300">
            <div className="w-8 h-px bg-current" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Milestone
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const HorizontalTimeline = ({ content }: TimelineProps) => {
  const { milestones } = content;

  return (
    <div className="mt-16 relative container mx-auto px-4">
      {/* Horizontal Line - only visible on desktop */}
      <div className="hidden md:block absolute top-5.5 left-0 right-0 h-px bg-slate-200" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative group">
            {/* Dot and connecting lines for mobile */}
            <div className="md:hidden absolute left-3 top-0 bottom-0 w-px bg-slate-200" />

            <div className="flex md:flex-col items-start md:items-center gap-6 md:gap-4 relative z-10">
              {/* Dot */}
              <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-900 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>

              <div className="flex-1 md:text-center pt-0.5 md:pt-4">
                <div className="text-sm font-bold text-primary mb-1">
                  {milestone.date}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {milestone.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {milestone.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MinimalTimeline = ({ content }: TimelineProps) => {
  const { milestones } = content;

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex gap-8 group">
            <div className="w-24 shrink-0 text-right pt-0.5">
              <span className="text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                {milestone.date}
              </span>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-white z-10" />
              {index !== milestones.length - 1 && (
                <div className="w-px h-full bg-slate-100 absolute top-2.5" />
              )}
            </div>

            <div className="flex-1 pb-10">
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                {milestone.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VerticalTimeline = ({ content }: TimelineProps) => {
  const { milestones } = content;

  return (
    <div className="max-w-4xl mx-auto mt-16 relative px-4">
      {/* Vertical Line */}
      <div className="absolute left-[17px] md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={cn(
              "relative flex flex-col md:flex-row items-start md:items-center gap-8",
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            )}
          >
            {/* Dot */}
            <div className="absolute left-[17px] md:left-1/2 top-1.5 md:top-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-900 z-10 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>

            {/* Content Card */}
            <div
              className={cn(
                "ml-12 md:ml-0 md:w-[45%] p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300",
                index % 2 === 0 ? "md:text-left" : "md:text-right"
              )}
            >
              <div className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">
                {milestone.date}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {milestone.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {milestone.description}
              </p>
            </div>

            {/* Empty space for the other side on desktop */}
            <div className="hidden md:block md:w-[45%]" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ZigzagTimeline = ({ content }: TimelineProps) => {
  const { milestones } = content;

  return (
    <div className="mt-20 relative max-w-5xl mx-auto px-4">
      {/* Animated Background Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />

      <div className="space-y-24 md:space-y-40">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={cn(
              "relative flex flex-col md:flex-row items-center gap-12",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            {/* Image/Visual Side */}
            <div className="w-full md:w-1/2">
              <div className="aspect-4/3 rounded-[2.5rem] bg-linear-to-br from-primary/20 to-primary/5 border border-white/10 flex items-center justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-6xl font-black text-slate-700 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  {index + 1}
                </div>
                <div className="relative z-10 text-center px-8">
                  <span className="text-5xl mb-4 block">🚀</span>
                  <div className="text-sm font-bold text-primary uppercase tracking-widest">
                    {milestone.date}
                  </div>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
              <div
                className={cn(
                  "hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_currentColor] text-primary/50 z-20",
                  index % 2 === 0 ? "left-1/2 -ml-2" : "right-1/2 -mr-2"
                )}
              />

              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-500">
                {milestone.title}
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                {milestone.description}
              </p>
              <div className="pt-4">
                <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Learn More <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
