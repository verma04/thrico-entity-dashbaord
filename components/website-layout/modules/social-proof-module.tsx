import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface SocialProofModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function SocialProofModule({
  module,
  previewDevice,
}: SocialProofModuleProps) {
  const { layout, content } = module;

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-white border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />
        {/* Default Social Proof Layout */}
        {(!layout || layout === "default") && (
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {content.userCount || "+1000 users"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-400">
                  ⭐
                </span>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {content.rating || "4.9/5 rating"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {content.feature || "Featured in TechCrunch"}
            </div>
          </div>
        )}

        {/* Detailed Stats Layout */}
        {layout === "detailed-stats" && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                {content.title || "Trusted by Thousands"}
              </h3>
              <p className="text-muted-foreground">
                {content.description || "Join our growing community"}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {content.userCount || "10,000+"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {content.rating || "4.9/5"}
                </div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {content.countries || "50+"}
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Strip Layout */}
        {layout === "testimonials-strip" && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">User {i + 1}</div>
                    <div className="text-xs text-muted-foreground">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600 mb-2">
                {content.userCount || "10,000+"} Happy Customers
              </div>
              <p className="text-sm text-muted-foreground">
                {content.description ||
                  "Rated 4.9/5 stars across all platforms"}
              </p>
            </div>
          </div>
        )}

        {/* Logo Wall Layout */}
        {layout === "logo-wall" && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {content.title || "Featured In"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {content.description || "Recognized by industry leaders"}
              </p>
            </div>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
              {["TechCrunch", "Forbes", "Bloomberg", "Reuters", "Wired"].map(
                (company, i) => (
                  <div
                    key={i}
                    className="text-lg font-bold text-gray-600"
                    style={{ fontFamily: "serif" }}
                  >
                    {company}
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </ModuleContainer>
  );
}
