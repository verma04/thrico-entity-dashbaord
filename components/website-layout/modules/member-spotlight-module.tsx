"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  Quote,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  ExternalLink,
} from "lucide-react";

interface MemberSpotlightModuleProps {
  module: ModuleData;
  previewDevice: string;
}

interface Member {
  name: string;
  role: string;
  image?: string;
  quote?: string;
  location?: string;
  title?: string;
  memberSince?: string;
  link?: string;
}

interface LayoutProps {
  content: {
    title?: string;
    description?: string;
    members: Member[];
  };
}

const FeaturedMember = ({ content }: LayoutProps) => {
  const { members } = content;
  const featured = members[0];

  if (!featured) return null;

  return (
    <div className="mt-16 max-w-5xl mx-auto px-4">
      <div className="group relative bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 lg:p-16 rounded-[3rem] flex flex-col lg:flex-row items-center gap-12 lg:gap-20 transition-all duration-700 hover:shadow-2xl">
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-4 bg-blue-600/10 rounded-full animate-pulse" />
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl relative z-10">
            {featured.image ? (
              <img
                src={featured.image}
                alt={featured.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-6xl">
                👤
              </div>
            )}
          </div>
          <div className="absolute -bottom-4 -right-4 bg-yellow-400 p-4 rounded-2xl shadow-xl rotate-12 z-20">
            <Star className="text-white fill-white" size={24} />
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
            Monthly Spotlight
          </div>

          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            {featured.name}
          </h3>
          <p className="text-xl font-bold text-blue-600 mb-8 italic">
            {featured.role || "Community Leader"}
          </p>

          <blockquote className="relative mb-10">
            <Quote className="absolute -top-10 -left-10 w-20 h-20 text-slate-200/50 dark:text-slate-700/50 -z-10" />
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
              "
              {featured.quote ||
                "This community has been instrumental in my professional growth. The support and connections I've made here are invaluable."}
              "
            </p>
          </blockquote>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 border-t border-slate-200 dark:border-slate-800 pt-8">
            {featured.location && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <MapPin size={16} className="text-blue-500" />
                {featured.location}
              </div>
            )}
            {featured.title && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <Briefcase size={16} className="text-blue-500" />
                {featured.title}
              </div>
            )}
            {featured.memberSince && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <Calendar size={16} className="text-blue-500" />
                Since {featured.memberSince}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridProfiles = ({ content }: LayoutProps) => {
  const { members } = content;

  return (
    <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
      {members.map((member, idx) => (
        <div key={idx} className="group cursor-pointer">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-xl transition-all duration-300">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                {member.name}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {member.role}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Join CTA Card */}
      <div className="group cursor-pointer">
        <div className="h-full bg-slate-900 dark:bg-blue-600 p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white text-2xl mb-4 group-hover:rotate-90 transition-transform">
            +
          </div>
          <h3 className="text-sm font-black text-white px-2">
            Join the Community
          </h3>
        </div>
      </div>
    </div>
  );
};

const MemberCarousel = ({ content }: LayoutProps) => {
  const { members } = content;

  return (
    <div className="mt-16 relative">
      <div className="flex gap-8 px-4 overflow-x-auto pb-12 scrollbar-none snap-x">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-80 snap-center p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col items-center text-center shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-6xl select-none">
              {idx + 1}
            </div>

            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>

            <h3 className="text-lg font-black mb-1 relative z-10">
              {member.name}
            </h3>
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 relative z-10">
              {member.role}
            </p>

            <p className="text-sm text-slate-400 font-medium italic leading-relaxed relative z-10 line-clamp-4">
              "
              {member.quote ||
                "Amazing community experience. The platform made it so easy to connect with others."}
              "
            </p>

            <div className="mt-8 pt-6 border-t border-white/5 w-full">
              <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-blue-400 transition-colors">
                Read Success Story
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 rounded-full max-w-2xl mx-auto">
        <div
          className="h-full bg-blue-600 transition-all rounded-full"
          style={{ width: "33.3%" }}
        />
      </div>
    </div>
  );
};

const SpotlightCards = ({ content }: LayoutProps) => {
  const { members } = content;

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
      {members.map((member, idx) => (
        <div
          key={idx}
          className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
        >
          <div className="relative mb-8">
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 relative">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl">
                  👤
                </div>
              )}
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 truncate max-w-full">
            {member.name}
          </h3>
          <div className="text-sm font-black text-blue-600 uppercase tracking-widest mb-6">
            {member.role}
          </div>

          <div className="relative flex-1">
            <Quote className="absolute -top-4 -left-4 w-8 h-8 text-slate-100 dark:text-slate-800 group-hover:text-blue-50 dark:group-hover:text-blue-900/20 transition-colors" />
            <p className="text-slate-500 dark:text-slate-400 italic leading-relaxed relative z-10 text-sm">
              "
              {member.quote ||
                "This community has been instrumental in my professional growth. The support and connections I've made here are invaluable."}
              "
            </p>
          </div>

          {member.link && (
            <a
              href={member.link}
              className="mt-8 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              View Profile
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export const MemberSpotlightModule = ({
  module,
  previewDevice,
}: MemberSpotlightModuleProps) => {
  const { content, layout } = module;
  const members = content.members || [];

  const Header = () => (
    <ModuleHeader
      title={content.title}
      description={content.description}
      layoutSettings={content.layoutSettings}
      alignment="center"
    />
  );

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white dark:bg-transparent border-y py-12"
    >
      <Header />

      {members.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 border-dashed">
            <p className="text-muted-foreground font-medium">
              No members added yet. Add members in the settings panel to verify
              this layout.
            </p>
          </div>
        </div>
      )}

      {layout === "featured-member" && <FeaturedMember content={content} />}
      {layout === "grid-profiles" && <GridProfiles content={content} />}
      {layout === "member-carousel" && <MemberCarousel content={content} />}
      {layout === "spotlight-cards" && <SpotlightCards content={content} />}

      {![
        "featured-member",
        "grid-profiles",
        "member-carousel",
        "spotlight-cards",
      ].includes(layout) && <SpotlightCards content={content} />}
    </ModuleContainer>
  );
};
