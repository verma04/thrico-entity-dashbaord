import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleContainer } from "./module-container";
import { ModuleHeader } from "./module-header";

interface DonationModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function DonationModule({ module, previewDevice }: DonationModuleProps) {
  const { layout, content } = module;

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className={
        layout === "urgent-appeal"
          ? "bg-gradient-to-r from-red-500 to-orange-600 text-white border-y"
          : "bg-gradient-to-r from-green-500 to-teal-600 text-white border-y"
      }
    >
      <div className="text-center">
        {/* Campaign Style Layout */}
        {layout === "campaign-style" && (
          <>
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl">
              💝
            </div>
            <ModuleHeader
              title={content.title || "Support Our Mission"}
              description={
                content.description ||
                "Your contribution helps us continue our work"
              }
              alignment="center"
              titleClassName="text-2xl font-bold mb-4 text-white"
              descriptionClassName="mb-8 opacity-90 text-lg text-white"
              titleColor={content.titleColor}
              descriptionColor={content.descriptionColor}
              hideTitle={content.hideTitle}
              hideDescription={content.hideDescription}
            />
            <div className="flex justify-center gap-4 mb-8">
              {["$10", "$25", "$50", "$100"].map((amount) => (
                <button
                  key={amount}
                  className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {amount}
                </button>
              ))}
            </div>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Donate Now
            </button>
            <p className="text-sm opacity-75 mt-4">
              🔒 Secure donation processing
            </p>
          </>
        )}

        {/* Progress Goal Layout */}
        {layout === "progress-goal" && (
          <>
            <ModuleHeader
              title={content.title || "Help Us Reach Our Goal"}
              alignment="center"
              titleClassName="text-2xl font-bold mb-4 text-white"
              titleColor={content.titleColor}
              hideTitle={content.hideTitle}
            />
            <div className="bg-white/20 rounded-xl p-6 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Raised: $75,000</span>
                <span>Goal: $100,000</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-4 mb-4">
                <div
                  className="bg-white h-4 rounded-full"
                  style={{ width: "75%" }}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold">250</div>
                  <div className="text-sm opacity-80">Donors</div>
                </div>
                <div>
                  <div className="text-xl font-bold">75%</div>
                  <div className="text-sm opacity-80">Complete</div>
                </div>
                <div>
                  <div className="text-xl font-bold">15</div>
                  <div className="text-sm opacity-80">Days Left</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mb-6">
              {["$25", "$50", "$100", "$250"].map((amount) => (
                <button
                  key={amount}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {amount}
                </button>
              ))}
            </div>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Contribute Now
            </button>
          </>
        )}

        {/* Impact Story Layout */}
        {layout === "impact-story" && (
          <>
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl">
              🌟
            </div>
            <ModuleHeader
              title={content.title || "Your Impact Matters"}
              alignment="center"
              titleClassName="text-2xl font-bold mb-6 text-white"
              titleColor={content.titleColor}
              hideTitle={content.hideTitle}
            />
            <div className="bg-white/10 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl mb-2">🏭</div>
                  <div className="text-lg font-bold">500+</div>
                  <div className="text-sm opacity-80">Lives Changed</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-lg font-bold">50</div>
                  <div className="text-sm opacity-80">Programs Funded</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🌍</div>
                  <div className="text-lg font-bold">25</div>
                  <div className="text-sm opacity-80">Communities Served</div>
                </div>
              </div>
            </div>
            <p className="text-lg opacity-90 mb-6">
              Every donation directly supports our mission to create lasting
              positive change.
            </p>
            <div className="flex justify-center gap-3 mb-6">
              {["$15", "$30", "$75", "$150"].map((amount) => (
                <button
                  key={amount}
                  className="bg-white/20 hover:bg-white/30 px-5 py-3 rounded-lg font-semibold transition-colors"
                >
                  {amount}
                </button>
              ))}
            </div>
            <button className="bg-white text-green-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Make a Difference
            </button>
          </>
        )}

        {/* Urgent Appeal Layout */}
        {layout === "urgent-appeal" && (
          <>
            <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl animate-pulse">
              ⚠️
            </div>
            <span className="bg-red-700 text-white text-sm px-4 py-1 rounded-full font-bold mb-4 inline-block">
              URGENT APPEAL
            </span>
            <ModuleHeader
              title={content.title || "Emergency Support Needed"}
              description={
                content.description ||
                "Time-sensitive situation requiring immediate community support."
              }
              alignment="center"
              titleClassName="text-2xl font-bold mb-4 text-white"
              descriptionClassName="text-lg opacity-90 mb-6 text-white"
              titleColor={content.titleColor}
              descriptionColor={content.descriptionColor}
              hideTitle={content.hideTitle}
              hideDescription={content.hideDescription}
            />
            <div className="bg-white/20 rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-300">72</div>
                  <div className="text-sm opacity-80">Hours Remaining</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-300">$45K</div>
                  <div className="text-sm opacity-80">Still Needed</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mb-6">
              {["$20", "$50", "$100", "Custom"].map((amount) => (
                <button
                  key={amount}
                  className="bg-white/25 hover:bg-white/35 px-5 py-3 rounded-lg font-bold transition-colors"
                >
                  {amount}
                </button>
              ))}
            </div>
            <button className="bg-yellow-400 text-red-800 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors">
              Donate Urgently
            </button>
            <p className="text-sm opacity-75 mt-4">
              🔒 100% secure • 🚀 Instant processing
            </p>
          </>
        )}
      </div>
    </ModuleContainer>
  );
}
