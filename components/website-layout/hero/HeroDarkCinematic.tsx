import React from "react";

interface HeroDarkCinematicProps {
  content: Record<string, any>;
}

const HeroDarkCinematic: React.FC<HeroDarkCinematicProps> = ({ content }) => {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
      <div className="mx-auto w-20 h-1 bg-white/20 rounded-full" />
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
        {content.title?.split(" ")[0] || "UNLEASH"} <br />
        <span className="text-white">
          {content.title?.split(" ").slice(1).join(" ") || "CREATIVITY"}
        </span>
      </h1>
      <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
        {content.description ||
          "Transform your ideas into reality with our powerful platform"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 items-center">
        {content.slides &&
          content.slides.slice(0, 3).map((slide: any, i: number) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl aspect-[9/16] cursor-pointer"
            >
              <img
                src={slide.image}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                alt={slide.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 text-left">
                <h3 className="text-xl font-bold">{slide.title}</h3>
                <p className="text-sm opacity-70 mt-1">{slide.subtitle}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HeroDarkCinematic;
