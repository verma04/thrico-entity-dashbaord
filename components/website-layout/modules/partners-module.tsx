"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface PartnersModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const PartnersModule = ({
  module,
  previewDevice,
}: PartnersModuleProps) => {
  const { content, layout } = module;
  const partners = content.partners || [];

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-gray-50 border-y"
    >
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

      {partners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">
            No partners added yet. Add partners in the settings panel.
          </p>
        </div>
      )}

      {/* Logo Row Layout */}
      {layout === "logo-row" && partners.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          {partners.map((partner: any, idx: number) => (
            <div
              key={idx}
              className="w-24 h-12 bg-gray-300 rounded border flex items-center justify-center text-xs font-medium overflow-hidden"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                partner.name || `Logo ${idx + 1}`
              )}
            </div>
          ))}
        </div>
      )}

      {/* Logo Grid Layout */}
      {layout === "logo-grid" && partners.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          {partners.map((partner: any, idx: number) => (
            <div
              key={idx}
              className="aspect-square bg-gray-300 rounded-lg border flex items-center justify-center text-xs font-medium hover:shadow-md transition-shadow overflow-hidden"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                partner.name || `Logo ${idx + 1}`
              )}
            </div>
          ))}
        </div>
      )}

      {/* Logo Carousel Layout */}
      {layout === "logo-carousel" && partners.length > 0 && (
        <div className="relative overflow-hidden">
          <div className="flex animate-pulse gap-8">
            {partners.map((partner: any, idx: number) => (
              <div
                key={idx}
                className="w-32 h-16 bg-gray-300 rounded border flex items-center justify-center text-xs font-medium flex-shrink-0 overflow-hidden"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  partner.name || `Logo ${idx + 1}`
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple List Layout */}
      {layout === "simple-list" && partners.length > 0 && (
        <div className="space-y-4">
          {partners.map((partner: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-white rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-300 rounded overflow-hidden">
                  {partner.logo && (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {partner.name || `Partner ${idx + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {partner.category ||
                      partner.description ||
                      "Technology Partner"}
                  </p>
                </div>
              </div>
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Visit →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </ModuleContainer>
  );
};
