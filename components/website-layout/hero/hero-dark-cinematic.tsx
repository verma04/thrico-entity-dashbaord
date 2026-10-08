/* eslint-disable @next/next/no-img-element */
import React from "react";

interface CinematicCardItem {
  title?: string;
  subtitle?: string;
  image?: string;
}

interface HeroDarkCinematicProps {
  content: Record<string, unknown>;
}

const defaultCinematicCards: CinematicCardItem[] = [
  {
    title: "Cinematic Vision",
    subtitle: "Original Productions",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
  },
  {
    title: "Digital Artistry",
    subtitle: "Immersive Experiences",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1908&auto=format&fit=crop",
  },
  {
    title: "Future Sound",
    subtitle: "Audio Innovation",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop",
  },
];

const HeroDarkCinematic: React.FC<HeroDarkCinematicProps> = ({ content }) => {
  const cards: CinematicCardItem[] =
    (Array.isArray(content.slides) && content.slides.length > 0 && content.slides) ||
    (Array.isArray(content.cards) && content.cards.length > 0 && content.cards) ||
    defaultCinematicCards;

  const buttons: Array<{ text?: string; link?: string }> = Array.isArray(
    content.buttons
  )
    ? content.buttons
    : [];

  const titleParts = ((content.title as string) || "UNLEASH CREATIVITY")
    .trim()
    .split(" ");
  const firstWord = titleParts[0];
  const restOfTitle = titleParts.slice(1).join(" ") || "POWER";

  return (
    <div className="w-full bg-[#0a0a0c] text-white py-16 md:py-24">
      <div className="text-center space-y-8 max-w-5xl mx-auto px-6">
        <div className="mx-auto w-20 h-1 bg-white/20 rounded-full" />
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 leading-tight">
          {firstWord} <br />
          <span className="text-white">{restOfTitle}</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
          {(content.description as string) ||
            "Transform your ideas into reality with our powerful platform."}
        </p>

        {buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            {buttons.map((btn, idx: number) => (
              <a
                key={idx}
                href={btn.link || "#"}
                className="px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider bg-white text-black hover:bg-white/90 transition-all shadow-xl hover:scale-105"
              >
                {btn.text || "Explore"}
              </a>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-10 items-center">
          {cards.slice(0, 3).map((card: CinematicCardItem, i: number) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl aspect-[9/16] cursor-pointer border border-white/10 hover:border-white/30 transition-all shadow-2xl"
            >
              <img
                src={card.image}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                alt={card.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 text-left">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {card.title}
                </h3>
                <p className="text-xs text-white/70 mt-1 uppercase tracking-wider">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroDarkCinematic;
