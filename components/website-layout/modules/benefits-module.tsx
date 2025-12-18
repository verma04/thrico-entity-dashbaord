"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import * as LucideIcons from "lucide-react";
import { Check } from "lucide-react";

interface BenefitsModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const BenefitsModule = ({
  module,
  previewDevice,
}: BenefitsModuleProps) => {
  const { content, layout } = module;
  const benefits = content.benefits || [];

  // Helper to render Lucide icon
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-white border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

      {benefits.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-muted-foreground">
            No benefits added yet. Add benefits in the settings panel.
          </p>
        </div>
      )}

      {/* Benefit Icons Layout */}
      {layout === "benefit-icons" && benefits.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit: any, idx: number) => (
            <div key={idx} className="text-center group cursor-pointer">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                  {renderIcon(benefit.icon, "w-10 h-10") || <Check className="w-10 h-10" />}
                </div>
              </div>
              <h4 className="font-semibold text-sm max-w-[120px]">
                {benefit.title || `Benefit ${idx + 1}`}
              </h4>
            </div>
          ))}
        </div>
      )}

      {/* Feature Grid Layout */}
      {layout === "feature-grid" && benefits.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit: any, idx: number) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center text-green-600">
                {renderIcon(benefit.icon, "w-8 h-8") || <Check className="w-8 h-8" />}
              </div>
              <h3 className="font-semibold mb-2">
                {benefit.title || `Benefit ${idx + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {benefit.description ||
                  "Description of this membership benefit and value."}
              </p>
              {benefit.features && benefit.features.length > 0 && (
                <ul className="text-left space-y-1 mt-3">
                  {benefit.features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

        {/* Comparison List Layout */}
        {layout === "comparison-list" && benefits.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-center">
                  Standard Access
                </h3>
                <ul className="space-y-3">
                  {[
                    "Basic community access",
                    "Monthly newsletters",
                    "Standard support",
                    "Event notifications",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold mb-4 text-center text-blue-600">
                  Premium Access
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {renderIcon(benefit.icon, "w-3 h-3 text-white") || <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-blue-800">{benefit.title}</span>
                        {benefit.features && benefit.features.length > 0 && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {benefit.features.map((feature: string, fIdx: number) => (
                              <li key={fIdx} className="text-xs text-blue-700">• {feature}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Highlight Cards Layout */}
        {layout === "highlight-cards" && benefits.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit: any, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center text-white">
                  {renderIcon(benefit.icon, "w-6 h-6") || <Check className="w-6 h-6" />}
                </div>
                <h3 className="font-semibold mb-2 text-green-800">
                  {benefit.title || `Benefit ${idx + 1}`}
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  {benefit.description ||
                    "Unlock powerful benefits that accelerate your professional development and success."}
                </p>
                {benefit.features && benefit.features.length > 0 && (
                  <ul className="space-y-1">
                    {benefit.features.map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-green-700">
                        <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Value Proposition Layout */}
        {layout === "value-proposition" && benefits.length > 0 && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">
                Join 10,000+ Professionals
              </h3>
              <p className="text-green-100 mb-6">
                Experience the difference that premium membership makes in your
                career journey.
              </p>
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors">
                Start Your Journey
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Professional Growth",
                  benefits: [
                    "Expert mentorship",
                    "Skill development",
                    "Career guidance",
                    "Leadership training",
                  ],
                },
                {
                  title: "Exclusive Access",
                  benefits: [
                    "Premium content",
                    "VIP events",
                    "Early releases",
                    "Private forums",
                  ],
                },
                {
                  title: "Community Value",
                  benefits: [
                    "Global network",
                    "Collaboration tools",
                    "Success stories",
                    "Peer support",
                  ],
                },
              ].map((category, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border">
                  <h4 className="font-bold text-green-600 mb-4">
                    {category.title}
                  </h4>
                  <ul className="space-y-2">
                    {category.benefits.map((benefit, benefitIdx) => (
                      <li key={benefitIdx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
    </ModuleContainer>
  );
};
