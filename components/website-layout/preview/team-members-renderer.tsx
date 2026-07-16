import React, { useRef } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ModuleContainer } from "../modules/module-container";
import { ModuleHeader } from "../modules/module-header";
import { Marquee } from "@/components/ui/marquee";

interface TeamMembersRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const TeamMembersRenderer = ({
  module,
  previewDevice = "desktop",
}: TeamMembersRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const members = content.members || [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Visionary leader with 15+ years exp.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      social: { twitter: "#", linkedin: "#" },
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      bio: "Product strategist and design thinker.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      social: { twitter: "#", github: "#" },
    },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {/* Header (Common) */}
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

      {/* 1. GRID PROFILES */}
      {layout === "grid-profiles" && (
        <div
          className={cn(
            "grid gap-8",
            !isMobile && "grid-cols-2 lg:grid-cols-4"
          )}
        >
          {members.map((member: any, idx: number) => (
            <div
              key={idx}
              className="group relative bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <DynamicIcon name="User" className="h-12 w-12 opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  {member.social?.linkedin && (
                    <a
                      href={member.social.linkedin}
                      className="text-white hover:text-primary"
                    >
                      <DynamicIcon name="Linkedin" className="h-6 w-6" />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a
                      href={member.social.twitter}
                      className="text-white hover:text-primary"
                    >
                      <DynamicIcon name="Twitter" className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-6 text-center space-y-2">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary font-medium text-sm text-center mx-auto w-fit px-3 py-1 bg-primary/10 rounded-full">
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. CAROUSEL LEADERS */}
      {layout === "carousel-leaders" && (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
          >
            {members.map((member: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "snap-center shrink-0 w-[300px] bg-muted/20 border rounded-xl p-8 text-center space-y-6 flex flex-col items-center",
                  isMobile && "w-[85vw]"
                )}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-md">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <DynamicIcon name="User" className="h-8 w-8 opacity-50" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{member.bio}"
                </p>
                <div className="flex gap-3 pt-4 opacity-70">
                  {member.social?.linkedin && (
                    <DynamicIcon name="Linkedin" className="h-4 w-4" />
                  )}
                  {member.social?.twitter && (
                    <DynamicIcon name="Twitter" className="h-4 w-4" />
                  )}
                  {member.social?.github && (
                    <DynamicIcon name="Github" className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
          {!isMobile && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background border shadow-sm p-3 rounded-full hover:bg-muted"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background border shadow-sm p-3 rounded-full hover:bg-muted"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* 3. MINIMAL LIST */}
      {layout === "minimal-list" && (
        <div className="max-w-3xl mx-auto space-y-6">
          {members.map((member: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-6 p-4 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <div className="h-16 w-16 rounded-full overflow-hidden bg-muted shrink-0">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <DynamicIcon name="User" className="h-6 w-6 opacity-30" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary text-sm font-medium">
                  {member.role}
                </p>
              </div>
              <div
                className={cn(
                  "hidden sm:block text-sm text-muted-foreground w-1/3 truncate text-right",
                  isMobile && "hidden"
                )}
              >
                {member.bio}
              </div>
              <div className="flex gap-2 text-muted-foreground">
                {member.social?.linkedin && (
                  <a href={member.social.linkedin}>
                    <DynamicIcon
                      name="Linkedin"
                      className="h-4 w-4 hover:text-primary"
                    />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. MARQUEE */}
      {layout === "marquee" && (
        <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden">
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {members
              .slice(0, Math.ceil(members.length / 2))
              .map((member: any, idx: number) => (
                <MarqueeCard key={idx} member={member} />
              ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
            {members
              .slice(Math.ceil(members.length / 2))
              .map((member: any, idx: number) => (
                <MarqueeCard key={idx} member={member} />
              ))}
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b"></div>
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
        </div>
      )}

      {/* 5. MARQUEE 3D */}
      {layout === "marquee-3d" && (
        <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden perspective-near">
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
            }}
          >
            <Marquee pauseOnHover vertical className="[--duration:20s]">
              {members
                .slice(0, Math.ceil(members.length / 2))
                .map((member: any, idx: number) => (
                  <MarqueeCard key={idx} member={member} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {members
                .slice(Math.ceil(members.length / 2))
                .map((member: any, idx: number) => (
                  <MarqueeCard key={idx} member={member} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {members
                .slice(0, Math.ceil(members.length / 2))
                .map((member: any, idx: number) => (
                  <MarqueeCard key={idx} member={member} />
                ))}
            </Marquee>
            <Marquee pauseOnHover className="[--duration:20s]" vertical>
              {members
                .slice(Math.ceil(members.length / 2))
                .map((member: any, idx: number) => (
                  <MarqueeCard key={idx} member={member} />
                ))}
            </Marquee>
          </div>

          <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b"></div>
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
        </div>
      )}

      {/* 6. MARQUEE HORIZONTAL */}
      {layout === "marquee-horizontal" && (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover className="[--duration:20s]">
            {members
              .slice(0, Math.ceil(members.length / 2))
              .map((member: any, idx: number) => (
                <MarqueeCard key={idx} member={member} />
              ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {members
              .slice(Math.ceil(members.length / 2))
              .map((member: any, idx: number) => (
                <MarqueeCard key={idx} member={member} />
              ))}
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
        </div>
      )}
    </ModuleContainer>
  );
};

const MarqueeCard = ({ member }: { member: any }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-48 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5",
        // dark styles
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <DynamicIcon name="User" className="h-4 w-4 opacity-30" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {member.name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">
            {member.role}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm line-clamp-3">
        {member.bio}
      </blockquote>
    </figure>
  );
};
