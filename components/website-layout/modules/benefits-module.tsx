"use client";

import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import * as LucideIcons from "lucide-react";
import {
  Check,
  X,
  Shield,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// --- Interfaces ---

interface Benefit {
  title?: string;
  description?: string;
  icon?: string;
  features?: string[];
  isPremium?: boolean;
}

interface CommonProps {
  benefits: Benefit[];
  isMobile?: boolean;
}

// --- Benefit Icons Layout ---

export const BenefitIcons: React.FC<CommonProps> = ({ benefits, isMobile }) => {
  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Check className="w-8 h-8" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-8 h-8" /> : <Check className="w-8 h-8" />;
  };

  return (
    <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
      {benefits.map((benefit, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col items-center text-center max-w-[200px]"
        >
          {/* Circular Icon Container */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-2 border-slate-100 group-hover:border-blue-500/30 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500 z-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                {renderIcon(benefit.icon)}
              </div>
            </div>

            {/* Background Halo */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Number Indicator */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 border-4 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg group-hover:bg-blue-600 transition-colors z-20">
              {String(idx + 1).padStart(2, "0")}
            </div>
          </div>

          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-tight group-hover:text-blue-600 transition-colors">
            {benefit.title}
          </h3>

          <div className="w-8 h-1 bg-slate-100 group-hover:bg-blue-500 group-hover:w-12 transition-all duration-500 mt-3 mb-4" />

          <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            Unlock Value
          </p>
        </div>
      ))}
    </div>
  );
};

// --- Comparison List Layout ---

export const ComparisonList: React.FC<CommonProps> = ({
  benefits,
  isMobile,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div
        className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        )}
      >
        {/* Core Benefits */}
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Explorer</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Base Access
              </p>
            </div>
          </div>

          <ul className="space-y-6">
            {benefits.slice(0, 4).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {benefit.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Benefits */}
        <div className="relative bg-slate-900 p-10 rounded-[3rem] border border-white/5 overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20" />

          <div className="relative flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Visionary</h3>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Full Access
              </p>
            </div>
            <div className="ml-auto">
              <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                Pro
              </span>
            </div>
          </div>

          <ul className="relative space-y-6">
            {[...benefits, ...benefits].slice(0, 6).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {benefit.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Advanced priority access with no limits.
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button className="relative w-full mt-10 py-5 bg-white text-slate-900 rounded-2.5xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
            Elevate Your Status
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Feature Grid Layout ---

export const FeatureGrid: React.FC<CommonProps> = ({ benefits, isMobile }) => {
  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Check className="w-6 h-6" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <Check className="w-6 h-6" />;
  };

  return (
    <div
      className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {benefits.map((benefit, idx) => (
        <div
          key={idx}
          className="group bg-white p-8 rounded-[3rem] border border-slate-200 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
        >
          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              {renderIcon(benefit.icon)}
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {benefit.title}
            </h3>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {benefit.description ||
              "Unlock specialized tools and frameworks tailored for the next generation of builders."}
          </p>

          {/* Feature List */}
          <ul className="space-y-4 mb-10 pt-8 border-t border-slate-50">
            {(
              benefit.features || [
                "Exclusive Access",
                "Priority Support",
                "Quarterly Reports",
              ]
            ).map((feature, fIdx) => (
              <li
                key={fIdx}
                className="flex items-center gap-3 text-xs font-bold text-slate-500"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                {feature}
              </li>
            ))}
          </ul>

          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-colors group/btn">
            Detailed Breakdown
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Highlight Cards Layout ---

export const HighlightCards: React.FC<CommonProps> = ({
  benefits,
  isMobile,
}) => {
  const accentColors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
  ];

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Zap className="w-6 h-6" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <Zap className="w-6 h-6" />;
  };

  return (
    <div
      className={cn(
        "grid gap-6",
        isMobile
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {[...benefits].map((benefit, idx) => (
        <div
          key={idx}
          className={cn(
            "group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col h-[380px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5"
          )}
        >
          {/* Subtle accent line at top */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              accentColors[idx % accentColors.length]
            )}
          />

          {/* Subtler background shapes */}
          <div
            className={cn(
              "absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-linear-to-br",
              accentColors[idx % accentColors.length]
            )}
          />

          <div className="relative mb-6">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                "bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-white group-hover:bg-linear-to-br",
                accentColors[idx % accentColors.length]
              )}
            >
              {renderIcon(benefit.icon)}
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight leading-snug">
              {benefit.title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {benefit.description ||
                "The core foundation of your journey starts here with our premium infrastructure."}
            </p>
          </div>

          <div className="relative mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-0.5">
                Availability
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Global Region
              </span>
            </div>
            <button
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                "bg-slate-50 text-slate-400 group-hover:text-white group-hover:bg-slate-900"
              )}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Minimalism over decoration */}
          <Sparkles
            className={cn(
              "absolute top-6 right-6 w-4 h-4 transition-all duration-500",
              "text-slate-100 group-hover:text-slate-200 group-hover:rotate-12"
            )}
          />
        </div>
      ))}
    </div>
  );
};

// --- Main Module Component ---

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
  const isMobile = previewDevice === "mobile";

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y"
    >
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

      {layout === "benefit-icons" && (
        <BenefitIcons benefits={benefits} isMobile={isMobile} />
      )}

      {layout === "feature-grid" && (
        <FeatureGrid benefits={benefits} isMobile={isMobile} />
      )}

      {layout === "comparison-list" && (
        <ComparisonList benefits={benefits} isMobile={isMobile} />
      )}

      {layout === "highlight-cards" && (
        <HighlightCards benefits={benefits} isMobile={isMobile} />
      )}
    </ModuleContainer>
  );
};
