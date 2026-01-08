"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  Navigation,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";

import { ModuleContainer } from "./module-container";
import { ModuleHeader } from "./module-header";

interface LocationMapModuleProps {
  module: ModuleData;
  previewDevice: string;
}

interface LocationMapProps {
  content: {
    title?: string;
    description?: string;
    address?: string;
    hours?: string;
    phone?: string;
    email?: string;
    coordinates?: string;
  };
}

const CardMap = ({ content }: LocationMapProps) => {
  const { title, description, address, hours } = content;

  return (
    <div className="mt-16 max-w-6xl mx-auto h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden relative shadow-2xl border-8 border-white group">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-[#f1f5f9]">
        <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000">
          <rect width="100%" height="100%" fill="#e2e8f0" />
          <path
            d="M0 0 L1000 1000 M1000 0 L0 1000"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <circle
            cx="500"
            cy="500"
            r="400"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="10 10"
          />
        </svg>
        {/* Center Pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-125 transition-transform duration-500">
            <MapPin size={24} />
          </div>
        </div>
      </div>

      {/* Floating Info Card */}
      <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 z-20">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 p-8 rounded-[2.5rem] shadow-2xl group-hover:-translate-y-2 transition-transform duration-500">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
            <MapPin size={24} />
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
            {title || "Visit Our Flagship"}
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <MapPin size={16} className="text-blue-600" />
              </div>
              <p className="text-slate-600 text-sm font-bold leading-relaxed">
                {address || "No address provided"}
              </p>
            </div>
            {hours && (
              <div className="flex items-center gap-3 text-slate-500">
                <Clock size={16} />
                <span className="text-xs font-semibold">{hours}</span>
              </div>
            )}
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
            Get Directions
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FullWidthMap = ({ content }: LocationMapProps) => {
  const { title, description, address, phone, email } = content;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden group rounded-3xl">
      {/* Map Placeholder - Stylized SVG/CSS */}
      <div className="absolute inset-0 bg-[#f8fafc] flex items-center justify-center">
        <svg
          className="w-full h-full opacity-30"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#64748b"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Stylized road-like paths */}
          <path
            d="M0,200 Q400,250 1000,150"
            stroke="#cbd5e1"
            strokeWidth="8"
            fill="none"
          />
          <path
            d="M200,0 Q250,400 150,1000"
            stroke="#cbd5e1"
            strokeWidth="8"
            fill="none"
          />
          <path
            d="M0,600 Q600,650 1000,550"
            stroke="#cbd5e1"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M800,0 Q850,600 750,1000"
            stroke="#cbd5e1"
            strokeWidth="6"
            fill="none"
          />
        </svg>

        {/* Animated Pulse Pin */}
        <div className="absolute top-[35%] left-[45%]">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
            <div className="absolute -inset-8 bg-blue-500/10 rounded-full animate-pulse delay-700" />
            <div className="relative bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
              <MapPin className="text-white w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Info Header */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="mt-4 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Navigation size={18} />
              </div>
              <span className="text-sm font-bold">
                {address || "No address provided"}
              </span>
            </div>
            {phone && (
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-bold">{phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating Action */}
      <div className="absolute bottom-8 right-8 z-20">
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1">
          Open in Maps
        </button>
      </div>
    </div>
  );
};

const MinimalMap = ({ content }: LocationMapProps) => {
  const { title, description, address } = content;

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
      <div className="md:w-1/2 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8 border border-slate-200 dark:border-white/5 shadow-sm">
          <MapPin size={12} /> Headquarters
        </div>

        <div className="flex flex-col gap-6">
          <div className="text-sm border-l-2 border-blue-500 pl-6">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Our Studio Address
            </div>
            <div className="text-xl font-bold">{address || "No address"}</div>
          </div>
          <button className="flex items-center justify-center md:justify-start gap-3 text-blue-500 font-black text-xs uppercase tracking-[0.2em] hover:text-blue-400 transition-colors group">
            Open in Digital Maps
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>

      <div className="md:w-1/2 w-full aspect-square md:aspect-auto md:h-[500px] rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/10 relative group bg-slate-900">
        {/* Minimal Map Overlay */}
        <div className="absolute inset-0 bg-[#0f172a]">
          <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000">
            <path
              d="M0 0 L1000 1000 M1000 0 L0 1000"
              stroke="white"
              strokeWidth="1"
            />
            <circle
              cx="500"
              cy="500"
              r="150"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
            <circle
              cx="500"
              cy="500"
              r="300"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-12 bg-blue-500/10 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-pulse" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-10 p-6 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="text-[10px] font-black text-blue-400 tracking-widest uppercase mb-1">
            Real-time Location
          </div>
          <div className="text-sm font-bold text-white">
            40.7128° N, 74.0060° W
          </div>
        </div>
      </div>
    </div>
  );
};

const SplitMap = ({ content }: LocationMapProps) => {
  const { title, description, address, phone, email, hours } = content;

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">
      <div className="flex-1 py-12">
        <div className="space-y-10">
          <div className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center transition-transform group-hover:rotate-6">
                <MapPin size={22} />
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">
                Visit Us
              </h4>
            </div>
            <p className="pl-16 text-slate-600 font-bold leading-relaxed">
              {address || "No address provided"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-16">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
                <Phone size={12} /> Phone
              </div>
              <p className="text-slate-900 font-bold">
                {phone || "Not provided"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
                <Mail size={12} /> Email
              </div>
              <p className="text-slate-900 font-bold">
                {email || "Not provided"}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Current Status
              </div>
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                Open Now
              </div>
            </div>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border border-slate-100 hover:shadow-md transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[500px] lg:min-h-auto rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl relative group">
        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(#64748b 0.5px, transparent 0.5px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="relative">
            <div className="absolute -inset-8 bg-blue-500/10 rounded-full animate-ping" />
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform duration-500">
              <MapPin size={32} />
            </div>
          </div>
          {/* Floating UI Elements over map */}
          <div className="absolute top-8 right-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-[10px] font-bold text-slate-500 shadow-lg">
            Satellite View
          </div>
        </div>
      </div>
    </div>
  );
};

export const LocationMapModule = ({
  module,
  previewDevice,
}: LocationMapModuleProps) => {
  const { content, layout } = module;

  // Use a default title if none provided from content but the layout typically has one.
  // Actually, we should render the ModuleHeader for all layouts as requested,
  // but some layouts like "SplitMap" or "MinimalMap" might look better if the header is
  // placed specifically.
  // For now, let's place ModuleHeader at the top inside ModuleContainer.

  const Header = () => (
    <ModuleHeader
      title={content.title}
      description={content.description}
      layoutSettings={content.layoutSettings}
      alignment="center"
    />
  );

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y py-12"
    >
      <Header />

      {layout === "card-map" && <CardMap content={content} />}
      {layout === "full-width-map" && <FullWidthMap content={content} />}
      {layout === "minimal-map" && <MinimalMap content={content} />}
      {layout === "split-map" && <SplitMap content={content} />}

      {!["card-map", "full-width-map", "minimal-map", "split-map"].includes(
        layout
      ) && <CardMap content={content} />}
    </ModuleContainer>
  );
};
