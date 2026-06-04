"use client";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Languages, Check, Globe } from "lucide-react";

export default function LanguagesPage() {
  const supportedLanguages = [
    { name: "English (US)", code: "en-US", active: true },
    { name: "Spanish", code: "es", active: false },
    { name: "French", code: "fr", active: false },
    { name: "German", code: "de", active: false },
    { name: "Portuguese", code: "pt", active: false },
    { name: "Japanese", code: "ja", active: false },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Localization & Languages"
        description="Manage language settings for your dashboard and user interface translation preferences."
        breadcrumb="Global Settings"
        icon={Languages}
        badgeText="Locale"
        showLiveIndicator={false}
      />

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border shrink-0">
                <Globe className="h-4 w-4" />
             </div>
             <div>
                <h3 className="text-[14px] font-semibold text-foreground tracking-tight">System Language</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Select the default locale for the admin dashboard.</p>
             </div>
           </div>
        </div>

        <div className="p-5">
           <p className="text-[12px] text-muted-foreground mb-6 bg-muted/50 border border-border p-3.5 rounded-lg max-w-3xl leading-relaxed font-medium">
             Currently, the platform defaults to English (US). We are actively working on localization for other regions. Native support for the greyed-out languages is actively in development.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {supportedLanguages.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-start justify-between space-x-4 rounded-xl border p-4 transition-all duration-200 ${
                    lang.active 
                      ? "bg-emerald-500/10 border-emerald-500/30 shadow-sm ring-1 ring-emerald-500/10" 
                      : "bg-muted/30 border-border opacity-60 grayscale"
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-[13px] font-semibold leading-none flex items-center gap-2 ${lang.active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {lang.name}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground font-semibold">{lang.code}</p>
                  </div>
                  {lang.active ? (
                     <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-inner pt-[0.5px]">
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                     </div>
                  ) : (
                    <span className="text-[9px] font-semibold tracking-widest uppercase bg-muted text-muted-foreground px-2 py-1 rounded shadow-inner">
                      Soon
                    </span>
                  )}
                </div>
             ))}
           </div>
        </div>
      </div>
    </EcosystemWrapper>
  );
}
