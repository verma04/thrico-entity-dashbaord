import React from "react";
import { LayoutType } from "@/store/useWebsiteBuilderStore";

interface HeroAppShowcaseProps {
  content: Record<string, any>;
}

const HeroAppShowcase: React.FC<HeroAppShowcaseProps> = ({ content }) => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 order-2 md:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available Now
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            {content.title || "Your App, Everywhere"}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {content.description ||
              "Download our mobile app and take your experience on the go. Available for iOS and Android devices."}
          </p>

          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-80">Download on the</div>
                <div className="text-sm font-bold">App Store</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-80">Get it on</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400"
                  />
                ))}
              </div>
              <span>50K+ downloads</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★★★★★</span>
              <span className="font-semibold text-slate-700">4.8</span>
            </div>
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-3xl blur-3xl opacity-30 transform rotate-6" />
          <div className="relative flex justify-center gap-4">
            <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2340&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="App Screen 1"
                />
              </div>
            </div>
            <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 mt-12">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2340&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="App Screen 2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAppShowcase;
