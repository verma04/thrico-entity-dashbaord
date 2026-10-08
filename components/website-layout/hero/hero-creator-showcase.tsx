/* eslint-disable @next/next/no-img-element */
import React from "react";

interface CreatorItem {
  name?: string;
  role?: string;
  avatar?: string;
  color?: string;
}

interface HeroCreatorShowcaseProps {
  content: Record<string, unknown>;
}

const defaultCreators: CreatorItem[] = [
  { name: "Sarah K.", role: "Designer", color: "from-pink-400 to-rose-500" },
  { name: "Mike R.", role: "Developer", color: "from-blue-400 to-cyan-500" },
  { name: "Emma L.", role: "Writer", color: "from-purple-400 to-indigo-500" },
  { name: "Alex T.", role: "Artist", color: "from-orange-400 to-amber-500" },
  { name: "Lisa M.", role: "Photographer", color: "from-green-400 to-emerald-500" },
  { name: "Tom H.", role: "Musician", color: "from-violet-400 to-purple-500" },
  { name: "Nina P.", role: "Coach", color: "from-fuchsia-400 to-pink-500" },
  { name: "Dan W.", role: "Creator", color: "from-teal-400 to-cyan-500" },
];

const HeroCreatorShowcase: React.FC<HeroCreatorShowcaseProps> = ({
  content,
}) => {
  const activeCreators: CreatorItem[] =
    Array.isArray(content.creators) && content.creators.length > 0
      ? content.creators
      : defaultCreators;

  const buttons = Array.isArray(content.buttons) ? content.buttons : [];
  const ctaText =
    (buttons[0] as { text?: string } | undefined)?.text ||
    (content.ctaText as string) ||
    "Join 15,000+ Creators";
  const ctaLink =
    (buttons[0] as { link?: string } | undefined)?.link ||
    (content.ctaLink as string) ||
    "#";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10 text-center">
      <div className="space-y-4">
        {Boolean(content.badge) && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            <span>✨</span> {String(content.badge)}
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
          {(content.title as string) || "Join Our Creator Community"}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          {(content.description as string) ||
            "Connect with thousands of creators, share your work, and grow together."}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
        {activeCreators.map((creator: CreatorItem, i: number) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all hover:shadow-xl cursor-pointer"
          >
            {creator.avatar ? (
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-16 h-16 mx-auto rounded-full object-cover mb-3 group-hover:scale-110 transition-transform shadow-md"
              />
            ) : (
              <div
                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${
                  creator.color || "from-purple-400 to-pink-500"
                } mb-3 group-hover:scale-110 transition-transform shadow-md flex items-center justify-center text-white font-bold text-lg`}
              >
                {creator.name?.charAt(0) || "C"}
              </div>
            )}
            <h3 className="font-bold text-slate-900 text-sm truncate">
              {creator.name}
            </h3>
            <p className="text-xs text-slate-500 truncate">{creator.role}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <a
          href={ctaLink}
          className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-base md:text-lg hover:shadow-2xl transition-all hover:scale-105"
        >
          {ctaText}
        </a>
        <p className="text-xs text-slate-500">
          {(content.subtext as string) || "Free to join • No credit card required"}
        </p>
      </div>
    </div>
  );
};

export default HeroCreatorShowcase;
