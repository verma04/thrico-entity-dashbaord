import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  HeroCarousel,
  HeroVideo,
  HeroSaasModern,
  HeroBentoGrid,
  HeroNewsletter,
} from "../modules";
import {
  HeroAppShowcase,
  HeroSingleImage,
  HeroSplit,
  HeroCreatorShowcase,
  HeroDarkCinematic,
  HeroGradientMesh,
  HeroEventCountdown,
  HeroProductShowcase,
  HeroMinimalEditorial,
} from "../hero";
import { Globe } from "@/components/ui/globe";
import { Button } from "@/components/ui/button";

interface HeroModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function HeroModule({ module, previewDevice }: HeroModuleProps) {
  const { layout, content } = module;

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full",
        layout === "carousel" &&
          "bg-slate-900 text-white min-h-[500px] flex items-center",
        layout === "video" &&
          "relative min-h-[500px] flex items-center justify-center text-white overflow-hidden",
        layout === "saas-modern" && "bg-white py-16 md:py-24",
        layout === "bento-grid" && "bg-slate-50 py-16 md:py-20",
        layout === "split" &&
          "p-6 md:p-12 flex flex-col justify-center min-h-[300px] items-center bg-white",
        layout === "newsletter-focus" &&
          "bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 md:py-32 flex items-center justify-center",
        layout === "app-showcase" && "bg-white py-16 md:py-20",
        layout === "creator-showcase" && "bg-white py-12 md:py-16",
        layout === "dark-cinematic" && "bg-[#0a0a0c] text-white",
        layout === "gradient-mesh" && "bg-slate-950 text-white",
        layout === "event-countdown" && "bg-slate-900 text-white",
        layout === "product-showcase" && "bg-slate-50",
        layout === "minimal-editorial" && "bg-[#fdfdfd]"
      )}
      style={{
        color: content.containerSettings?.textColor,
        backgroundColor: content.containerSettings?.backgroundColor,
      }}
    >
      {/* 1. CAROUSEL */}
      {layout === "carousel" && <HeroCarousel content={content} />}

      {/* 2. VIDEO */}
      {layout === "video" && <HeroVideo content={content} />}

      {/* 3. SAAS MODERN */}
      {layout === "saas-modern" && <HeroSaasModern content={content} />}

      {/* 4. BENTO GRID */}
      {layout === "bento-grid" && <HeroBentoGrid content={content} />}

      {/* 5. SPLIT */}
      {layout === "split" && <HeroSplit content={content} />}

      {/* 6. NEWSLETTER FOCUS */}
      {layout === "newsletter-focus" && <HeroNewsletter content={content} />}

      {/* 7. SINGLE IMAGE */}
      {layout === "single-image" && <HeroSingleImage content={content} />}

      {/* 8. APP SHOWCASE */}
      {layout === "app-showcase" && <HeroAppShowcase content={content} />}

      {/* 9. CREATOR SHOWCASE */}
      {layout === "creator-showcase" && (
        <HeroCreatorShowcase content={content} />
      )}

      {/* 10. DARK CINEMATIC */}
      {layout === "dark-cinematic" && <HeroDarkCinematic content={content} />}

      {/* 11. GRADIENT MESH */}
      {layout === "gradient-mesh" && <HeroGradientMesh content={content} />}

      {/* 12. EVENT COUNTDOWN */}
      {layout === "event-countdown" && (
        <HeroEventCountdown content={content} />
      )}

      {/* 13. PRODUCT SHOWCASE */}
      {layout === "product-showcase" && (
        <HeroProductShowcase content={content} />
      )}

      {/* 14. MINIMAL EDITORIAL */}
      {layout === "minimal-editorial" && (
        <HeroMinimalEditorial content={content} />
      )}

      {/* 15. GLOBE INTERACTIVE */}
      {layout === "globe-interactive" && (
        <section
          className={cn(
            "relative w-full overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-white",
            previewDevice === "mobile" ? "py-12" : "py-12 md:py-20"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="font-bold mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                  {content.title || "Build Your Community,"}
                  <span className="text-yellow-300 block sm:inline"> </span>
                </h1>
                <p
                  className={cn(
                    "mb-6 text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mx-auto lg:mx-0",
                    previewDevice === "mobile"
                      ? "w-full max-w-none"
                      : "max-w-2xl"
                  )}
                >
                  {content.description ||
                    "Connect, collaborate, and grow with like-minded individuals. Join thousands of professionals building meaningful relationships."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  {content.buttons?.map((button: { text?: string }, idx: number) => (
                    <Button
                      key={idx}
                      className="bg-white text-primary hover:bg-blue-50"
                      size="lg"
                    >
                      {button.text || "Get Started"}
                    </Button>
                  )) || (
                    <Button
                      className="bg-white text-primary hover:bg-blue-50"
                      size="lg"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
              {/* Globe section */}
              {previewDevice !== "mobile" && (
                <div className="relative mt-8 lg:mt-0 h-[20rem] lg:h-[35rem] w-full">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-tr animate-tilt">
                    <Globe />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
