import React from "react";
import { LayoutType } from "@/store/useWebsiteBuilderStore";

interface HeroSplitProps {
  content: Record<string, any>;
}

const HeroSplit: React.FC<HeroSplitProps> = ({ content }) => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px]">
        {/* Content Side */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            {content.title || "Build Your Community"}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {content.description ||
              "Create meaningful connections and grow your audience with our powerful community platform."}
          </p>

          {/* CTA Buttons */}
          {content.buttons && content.buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {content.buttons.map((button: any, index: number) => (
                <a
                  key={index}
                  href={button.link || "#"}
                  className={
                    button.variant === "primary"
                      ? "px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-700 transition-colors text-center"
                      : button.variant === "secondary"
                      ? "px-8 py-4 bg-slate-700 text-white rounded-full font-bold text-lg hover:bg-slate-600 transition-colors text-center"
                      : button.variant === "outline"
                      ? "px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-full font-bold text-lg hover:border-slate-400 transition-colors text-center"
                      : "px-8 py-4 text-slate-700 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors text-center"
                  }
                >
                  {button.text || "Button"}
                </a>
              ))}
            </div>
          )}

          {/* Stats or Features */}
          {content.features && content.features.length > 0 && (
            <div className="grid grid-cols-3 gap-6 pt-8">
              {content.features.slice(0, 3).map((feature: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {feature.title || feature}
                  </div>
                  {feature.description && (
                    <div className="text-sm text-slate-600 mt-1">
                      {feature.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Side */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={
                content.image ||
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              }
              alt="Hero"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20" />
          </div>

          {/* Floating elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl opacity-80 blur-xl" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl opacity-60 blur-xl" />
        </div>
      </div>
    </div>
  );
};

export default HeroSplit;
