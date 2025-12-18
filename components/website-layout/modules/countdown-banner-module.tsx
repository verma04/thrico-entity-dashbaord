"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import { Clock, Calendar, Zap } from "lucide-react";

interface CountdownBannerModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const CountdownBannerModule = ({
  module,
  previewDevice,
}: CountdownBannerModuleProps) => {
  const { content, layout } = module;

  // Sample countdown values
  const timeUnits = [
    { value: "15", label: "Days" },
    { value: "08", label: "Hours" },
    { value: "42", label: "Minutes" },
    { value: "30", label: "Seconds" },
  ];

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {/* Centered Countdown Layout */}
      {layout === "centered-countdown" && (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-12">
          <div className="text-center">
            <ModuleHeader
              title={content.title || "Limited Time Offer!"}
              description={content.description || "Don't miss out on this exclusive deal"}
              layoutSettings={content.layoutSettings}
              titleClassName="text-white text-3xl"
              descriptionClassName="opacity-90"
            />
            <div className="flex justify-center gap-4 mb-8">
              {timeUnits.map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                    <div className="text-4xl font-bold">{unit.value}</div>
                  </div>
                  <div className="text-sm mt-2 opacity-75">{unit.label}</div>
                </div>
              ))}
            </div>
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              {content.ctaText || "Claim Now"}
            </button>
          </div>
        </div>
      )}

      {/* Inline Banner Layout */}
      {layout === "inline-banner" && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 px-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                {content.title || "Flash Sale Ends Soon!"}
              </h3>
              <p className="text-blue-100 text-sm">
                {content.description || "Hurry up! Limited time offer"}
              </p>
            </div>
            <div className="flex gap-3">
              {timeUnits.map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{unit.value}</div>
                  </div>
                  <div className="text-xs mt-1 opacity-75">{unit.label}</div>
                </div>
              ))}
            </div>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
              {content.ctaText || "Shop Now"}
            </button>
          </div>
        </div>
      )}

      {/* Flip Card Layout */}
      {layout === "flip-card" && (
        <div className="bg-black text-white py-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">
              {content.title || "Event Starts In"}
            </h3>
            <p className="text-gray-400">
              {content.description || "Get ready for something amazing"}
            </p>
          </div>
          <div className="flex justify-center gap-6 mb-8">
            {timeUnits.map((unit) => (
              <div key={unit.label} className="text-center">
                <div className="relative">
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    <div className="px-6 py-4">
                      <div className="text-5xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        {unit.value}
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/40" />
                  </div>
                </div>
                <div className="text-sm mt-3 text-gray-400 uppercase tracking-wider">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all shadow-lg">
              {content.ctaText || "Register Now"}
            </button>
          </div>
        </div>
      )}

      {/* Split Banner Layout */}
      {layout === "split-banner" && (
        <div className="grid md:grid-cols-2 overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Limited Offer
              </span>
            </div>
            <h3 className="text-4xl font-bold mb-4">
              {content.title || "Summer Sale"}
            </h3>
            <p className="text-orange-100 mb-6 text-lg">
              {content.description || "Up to 70% off on selected items"}
            </p>
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-fit">
              {content.ctaText || "Shop Sale"}
            </button>
          </div>
          <div className="bg-gray-900 text-white p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">Offer ends in</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {timeUnits.map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-3xl font-bold text-orange-400">
                      {unit.value}
                    </div>
                  </div>
                  <div className="text-xs mt-2 text-gray-500 uppercase">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Minimal Timer Layout */}
      {layout === "minimal-timer" && (
        <div className="bg-white border-y">
          <div className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">
                  {content.title || "Offer expires in:"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {timeUnits.map((unit, idx) => (
                  <div key={unit.label} className="flex items-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {unit.value}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {unit.label}
                      </div>
                    </div>
                    {idx < timeUnits.length - 1 && (
                      <span className="text-2xl font-bold text-gray-300 mx-2">:</span>
                    )}
                  </div>
                ))}
              </div>
              <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                {content.ctaText || "View Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};
