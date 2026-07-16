"use client";

import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  BarChart,
  Gauge,
  Activity,
  Target,
  Zap,
  Waves,
  Building2,
  Landmark,
  Settings2,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Clock,
  Quote,
} from "lucide-react";
import Image from "next/image";

// --- Interfaces ---

interface CaseStudy {
  title?: string;
  client?: string;
  industry?: string;
  thumbnail?: string; // Mapped from 'image' in existing data
  image?: string;
  description?: string;
  metrics?: { label: string; value: string; trend?: string }[];
  url?: string;
  tags?: string[];
  readTime?: string;
  results?: string;
  solution?: string;
}

interface CommonProps {
  cases: CaseStudy[];
  isMobile?: boolean;
}

interface Metric {
  label: string;
  value: string;
  sublabel?: string;
  icon?: any;
}

interface ImpactMetricsProps {
  metrics?: Metric[];
  cases?: CaseStudy[]; // Added to allow fallback or extra display if needed
  isMobile?: boolean;
}

// --- Detailed Case Layout ---
interface DetailedCaseProps extends CommonProps {}

export const DetailedCase: React.FC<DetailedCaseProps> = ({
  cases,
  isMobile,
}) => {
  return (
    <div className="space-y-12">
      {cases.map((cs, idx) => (
        <div
          key={idx}
          className={cn(
            "group grid gap-0 bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5",
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"
          )}
        >
          {/* Visual Side (2/5) */}
          <div
            className={cn(
              "relative h-80 lg:h-auto bg-slate-900 overflow-hidden",
              isMobile ? "" : "lg:col-span-2"
            )}
          >
            {cs.thumbnail || cs.image ? (
              <img
                src={cs.thumbnail || cs.image}
                alt=""
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-indigo-600 to-blue-700 opacity-40" />
            )}
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center text-white mb-6">
                <TrendingUp className="w-10 h-10" />
              </div>
              <p className="text-white/60 text-xs font-black uppercase tracking-widest leading-loose">
                Impact Analysis Phase IV
                <br />
                Internal Audit Verified
              </p>
            </div>
          </div>

          {/* Content Side (3/5) */}
          <div
            className={cn(
              "p-10 lg:p-16 flex flex-col",
              isMobile ? "" : "lg:col-span-3"
            )}
          >
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-slate-200">
                {cs.industry || "Enterprise"}
              </span>
              <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Success
              </div>
            </div>

            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8 group-hover:text-blue-600 transition-colors">
              {cs.title}
            </h3>

            <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">
              {cs.description ||
                "A transformative implementation that leveraged our core modular infrastructure to solve systemic bottlenecks and deliver unprecedented value."}
            </p>

            {/* Metrics Dashboard Integration */}
            <div
              className={cn(
                "grid gap-6 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100",
                isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"
              )}
            >
              {(
                cs.metrics || [
                  { label: "Growth", value: "+140%", trend: "up" },
                  { label: "Efficiency", value: "x3.5", trend: "up" },
                  { label: "Adoption", value: "98%", trend: "up" },
                ]
              ).map((metric, i) => (
                <div
                  key={i}
                  className={cn("text-center", isMobile ? "" : "sm:text-left")}
                >
                  <span className="block text-2xl font-black text-slate-900 mb-1">
                    {metric.value}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200" />
                <span className="text-xs font-black text-slate-900">
                  {cs.client || "Partner Identity"}
                </span>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors group/btn">
                Executive Summary
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Impact Metrics Layout ---

export const ImpactMetrics: React.FC<ImpactMetricsProps> = ({
  metrics,
  cases,
  isMobile,
}) => {
  const displayMetrics = metrics || [
    {
      label: "Community Growth",
      value: "+240%",
      sublabel: "Year over Year",
      icon: Waves,
    },
    {
      label: "Developer Velocity",
      value: "x3.5",
      sublabel: "Post-Migration",
      icon: Zap,
    },
    {
      label: "Deployment Success",
      value: "99.99%",
      sublabel: "Across All Nodes",
      icon: Target,
    },
    {
      label: "Avg. Latency",
      value: "12ms",
      sublabel: "Edge Response",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Top Header Metric (Flagship) */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 lg:p-20 text-center relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md">
            <Gauge className="w-4 h-4" />
            Ecosystem Performance Audit 2024
          </span>

          <h3 className="text-4xl lg:text-7xl font-black text-white mb-6 tracking-tighter italic">
            $14.2B+
          </h3>

          <p className="text-blue-100/60 text-lg sm:text-2xl font-black uppercase tracking-widest mb-12">
            Total Value Orchestrated
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-2xl text-green-400 text-xs font-black uppercase tracking-widest">
              Audited by Top-4
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 px-6 py-3 rounded-2xl text-blue-400 text-xs font-black uppercase tracking-widest">
              Ranked #1 in Efficiency
            </div>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div
        className={cn(
          "grid gap-6",
          isMobile
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {displayMetrics.map((metric, idx) => {
          const Icon = metric.icon || Activity;
          return (
            <div
              key={idx}
              className="group bg-white p-10 rounded-[3rem] border border-slate-200 hover:border-slate-900/10 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8" />
              </div>

              <span className="text-3xl lg:text-4xl font-black text-slate-900 mb-1 tracking-tight">
                {metric.value}
              </span>

              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                {metric.label}
              </span>

              <div className="w-8 h-1 bg-slate-100 group-hover:w-16 group-hover:bg-blue-600 transition-all duration-500 mb-6" />

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                {metric.sublabel}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Industry Focus Layout ---
interface IndustryFocusProps extends CommonProps {}

export const IndustryFocus: React.FC<IndustryFocusProps> = ({
  cases,
  isMobile,
}) => {
  // Group cases by industry
  const grouped = cases.reduce((acc: Record<string, CaseStudy[]>, cs) => {
    const ind = cs.industry || "Other";
    if (!acc[ind]) acc[ind] = [];
    acc[ind].push(cs);
    return acc;
  }, {});

  const getIndustryIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case "finance":
        return <Landmark className="w-6 h-6" />;
      case "tech":
        return <Settings2 className="w-6 h-6" />;
      case "legal":
        return <ShieldCheck className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <div
      className={cn(
        "grid gap-10",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}
    >
      {Object.entries(grouped).map(([industry, industryCases], idx) => (
        <div
          key={industry}
          className="group bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-blue-500/20 transition-all duration-500"
        >
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors duration-500">
              {getIndustryIcon(industry)}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {industry}
              </h3>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                {industryCases.length} Vertical Solutions
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {industryCases.map((cs, cIdx) => (
              <div
                key={cIdx}
                className="bg-white p-6 rounded-2.5xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group/item cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 group-hover/item:text-blue-600 transition-colors">
                    {cs.client || cs.title}
                  </h4>
                  <ArrowRight className="w-4 h-4 text-slate-200 group-hover/item:text-slate-900 group-hover/item:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-1">
                  {cs.title || cs.description}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-10 w-full py-5 rounded-2.5xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
            View {industry} Reports
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Success Stories Layout ---
interface SuccessStoriesProps extends CommonProps {}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({
  cases,
  isMobile,
}) => {
  return (
    <div
      className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}
    >
      {cases.map((cs, idx) => (
        <div
          key={idx}
          className="group relative bg-white rounded-[3rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 flex flex-col"
        >
          {/* Image Header */}
          <div className="h-64 relative overflow-hidden bg-slate-100">
            {cs.thumbnail || cs.image ? (
              <img
                src={cs.thumbnail || cs.image}
                alt={cs.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 text-white">
                <Quote className="w-16 h-16 opacity-10" />
              </div>
            )}

            {/* Industry Badge */}
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">
                {cs.industry || "General"}
              </span>
            </div>

            {/* Read Time Overlay */}
            <div className="absolute bottom-6 right-6">
              <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 border border-white/10 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {cs.readTime || "5 Min"} Read
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10 flex-1 flex flex-col">
            <div className="mb-8">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3">
                {cs.client || "Partner Collaboration"}
              </p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                {cs.title}
              </h3>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-3">
              {cs.description ||
                "In-depth look at how we implemented a modular solution that addressed core business challenges and drove significant growth."}
            </p>

            {/* Metrics Preview */}
            <div className="mt-auto grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
              {(cs.metrics || [{ label: "Result", value: "Success" }])
                .slice(0, 2)
                .map((m, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xl font-black text-slate-900 italic">
                      {m.value}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {m.label}
                    </span>
                  </div>
                ))}
              <div className="col-span-2 mt-4">
                <button className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/5">
                  Read Full Story
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main Module Component ---

interface CaseStudiesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const CaseStudiesModule = ({
  module,
  previewDevice,
}: CaseStudiesModuleProps) => {
  const { content, layout } = module;
  const caseStudies = content.caseStudies || [];
  const metrics = content.metrics || undefined;
  const isMobile = previewDevice === "mobile";

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

      {caseStudies.length === 0 && !metrics && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-muted-foreground">
            No case studies added yet. Add case studies in the settings panel.
          </p>
        </div>
      )}

      {layout === "success-stories" && (
        <SuccessStories cases={caseStudies} isMobile={isMobile} />
      )}

      {layout === "detailed-case" && (
        <DetailedCase cases={caseStudies} isMobile={isMobile} />
      )}

      {layout === "industry-focus" && (
        <IndustryFocus cases={caseStudies} isMobile={isMobile} />
      )}

      {layout === "impact-metrics" && (
        <ImpactMetrics
          metrics={metrics}
          cases={caseStudies}
          isMobile={isMobile}
        />
      )}
    </ModuleContainer>
  );
};
