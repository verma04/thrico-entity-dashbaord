"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

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

        {/* Feature Grid Layout */}
        {layout === "feature-grid" && benefits.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl overflow-hidden">
                  {benefit.icon || "✅"}
                </div>
                <h3 className="font-semibold mb-2">
                  {benefit.title || `Benefit ${idx + 1}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description ||
                    "Description of this membership benefit and value."}
                </p>
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
                      <span className="text-green-500">✓</span>
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
                  {[
                    "Full community access",
                    "Weekly insights & reports",
                    "Priority support",
                    "Exclusive events",
                    "Direct expert consultation",
                    "Advanced resources",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-blue-500">✓</span>
                      <span className="text-sm text-blue-800">{benefit}</span>
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
                <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center text-white overflow-hidden">
                  {benefit.icon || ["🎯", "💼", "📚", "🤝", "🚀", "🏆"][idx]}
                </div>
                <h3 className="font-semibold mb-2 text-green-800">
                  {benefit.title ||
                    [
                      "Expert Access",
                      "Career Growth",
                      "Learning Resources",
                      "Networking",
                      "Innovation",
                      "Recognition",
                    ][idx]}
                </h3>
                <p className="text-sm text-green-700">
                  {benefit.description ||
                    "Unlock powerful benefits that accelerate your professional development and success."}
                </p>
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
