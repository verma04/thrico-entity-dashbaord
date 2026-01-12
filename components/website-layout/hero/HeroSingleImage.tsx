import React from "react";

interface HeroSingleImageProps {
  content: Record<string, any>;
}

const HeroSingleImage: React.FC<HeroSingleImageProps> = ({ content }) => {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            content.image ||
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
          })`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6 space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
            {content.title || ""}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
            {content.description || ""}
          </p>
        </div>

        {/* CTA Buttons */}
        {content.buttons && content.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            {content.buttons.map((button: any, index: number) => (
              <a
                key={index}
                href={button.link || "#"}
                className={
                  button.variant === "primary"
                    ? "px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-2xl text-center"
                    : button.variant === "secondary"
                    ? "px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-lg hover:bg-slate-700 transition-colors shadow-2xl text-center"
                    : button.variant === "outline"
                    ? "px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition-all text-center"
                    : "px-8 py-4 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center"
                }
              >
                {button.text || "Button"}
              </a>
            ))}
          </div>
        )}

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-8 pt-12 text-white/80">
          {(content.features || ["Community", "Analytics", "Growth"]).map(
            (feature: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSingleImage;
