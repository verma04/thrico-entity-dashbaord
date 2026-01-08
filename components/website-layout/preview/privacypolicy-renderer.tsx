import React, { useState } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "./DynamicIcon";
import { ModuleContainer } from "../modules/module-container";

interface PrivacyPolicyRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const PrivacyPolicyRenderer = ({
  module,
  previewDevice = "desktop",
}: PrivacyPolicyRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const [activeTab, setActiveTab] = useState(0);

  const sections = content.sections || [
    {
      title: "1. Introduction",
      content:
        "Welcome to our Privacy Policy. Your privacy is critically important to us.",
    },
    {
      title: "2. Data Collection",
      content:
        "We collect information to provide better services to all our users.",
    },
  ];

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {/* 1. SIMPLE PRIVACY */}
      {layout === "simple-privacy" && (
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {content.title || "Privacy Policy"}
            </h1>
            <p className="text-muted-foreground">
              Last updated: {content.lastUpdated || "Today"}
            </p>
          </div>

          {content.introduction && (
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>{content.introduction}</p>
            </div>
          )}

          <div className="space-y-8">
            {sections.map((section: any, idx: number) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <p>{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          {(content.contactEmail || content.contactAddress) && (
            <div className="pt-12 border-t mt-16 space-y-4">
              <h2 className="text-xl font-semibold">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {content.contactEmail && (
                  <li className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      Email:
                    </span>
                    <a
                      href={`mailto:${content.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {content.contactEmail}
                    </a>
                  </li>
                )}
                {content.contactAddress && (
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-foreground whitespace-nowrap">
                      Address:
                    </span>
                    <span>{content.contactAddress}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 2. LEGAL DOCUMENT */}
      {layout === "legal-document" && (
        <div
          className={cn("grid gap-12", !isMobile && "grid-cols-[250px_1fr]")}
        >
          {/* Sidebar Navigation */}
          <div className={cn("space-y-6", isMobile && "hidden")}>
            <div className="sticky top-24 space-y-2 border-l pl-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 opacity-70">
                Contents
              </h3>
              {sections.map((section: any, idx: number) => (
                <a
                  key={idx}
                  href={`#section-${idx}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="border-b pb-8">
              <h1 className="text-4xl font-serif font-medium mb-4">
                {content.title || "Privacy Policy"}
              </h1>
              <p className="text-sm font-mono opacity-60">
                Effective Date: {content.lastUpdated || "January 1, 2024"}
              </p>
            </div>

            {content.introduction && (
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground/90 font-serif leading-relaxed italic border-l-4 pl-6 border-muted">
                <p>{content.introduction}</p>
              </div>
            )}

            <div className="space-y-12">
              {sections.map((section: any, idx: number) => (
                <div
                  key={idx}
                  id={`section-${idx}`}
                  className="scroll-mt-32 space-y-4"
                >
                  <h2 className="text-2xl font-serif">{section.title}</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground/90 font-serif leading-relaxed">
                    <p>{section.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-8 mt-16 space-y-6">
              <h2 className="text-2xl font-serif">Contact Information</h2>
              <p className="text-muted-foreground/90 font-serif leading-relaxed">
                For any questions regarding this policy, please contact us at:
              </p>
              <div className="space-y-2 font-serif text-muted-foreground/90">
                {content.contactEmail && (
                  <p className="flex items-center gap-2">
                    <span className="font-bold text-foreground">Email:</span>
                    <a
                      href={`mailto:${content.contactEmail}`}
                      className="text-primary"
                    >
                      {content.contactEmail}
                    </a>
                  </p>
                )}
                {content.contactAddress && (
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-foreground whitespace-nowrap">
                      Address:
                    </span>
                    <span>{content.contactAddress}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TABBED POLICY */}
      {layout === "tabbed-policy" && (
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
              <Shield className="h-3 w-3" />
              Legal Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {content.title || "Policy Hub"}
            </h1>
            <p className="text-muted-foreground text-lg">
              Transparent terms for your peace of mind.
            </p>
            <p className="text-sm opacity-60">
              Last updated: {content.lastUpdated || "Recently"}
            </p>
          </div>

          <div
            className={cn(
              "bg-card border rounded-2xl overflow-hidden shadow-sm",
              !isMobile && "flex min-h-[600px]"
            )}
          >
            {/* Tabs Sidebar */}
            <div
              className={cn(
                "bg-muted/30 p-2 overflow-x-auto flex",
                !isMobile && "flex-col w-64 border-r overflow-visible shrink-0"
              )}
            >
              <button
                onClick={() => setActiveTab(-1)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap",
                  activeTab === -1
                    ? "bg-white dark:bg-slate-800 shadow-sm text-primary"
                    : "text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
                )}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-md flex items-center justify-center text-xs border",
                    activeTab === -1
                      ? "border-primary/20 bg-primary/10"
                      : "border-transparent bg-muted"
                  )}
                >
                  <Shield className="h-3 w-3" />
                </div>
                Overview
              </button>

              {sections.map((section: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap",
                    activeTab === idx
                      ? "bg-white dark:bg-slate-800 shadow-sm text-primary"
                      : "text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <span
                    className={cn(
                      "h-6 w-6 rounded-md flex items-center justify-center text-xs border",
                      activeTab === idx
                        ? "border-primary/20 bg-primary/10"
                        : "border-transparent bg-muted"
                    )}
                  >
                    {idx + 1}
                  </span>
                  {section.title.split(".")[1] || section.title}
                </button>
              ))}

              <button
                onClick={() => setActiveTab(-2)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap",
                  activeTab === -2
                    ? "bg-white dark:bg-slate-800 shadow-sm text-primary"
                    : "text-muted-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
                )}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-md flex items-center justify-center text-xs border",
                    activeTab === -2
                      ? "border-primary/20 bg-primary/10"
                      : "border-transparent bg-muted"
                  )}
                >
                  <Mail className="h-3 w-3" />
                </div>
                Contact Details
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <div
                className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300"
                key={activeTab}
              >
                {activeTab === -1 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold mb-6">Introduction</h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-8 text-lg italic">
                      <p>
                        {content.introduction ||
                          "This document outlines our commitment to protecting your privacy and personal data."}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab >= 0 && sections[activeTab] && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold mb-6">
                      {sections[activeTab].title}
                    </h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-8">
                      <p>{sections[activeTab].content}</p>
                    </div>
                  </div>
                )}

                {activeTab === -2 && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Should you have any questions regarding this policy or our
                      data practices, please reach out through the following
                      channels:
                    </p>
                    <div className="grid gap-6">
                      {content.contactEmail && (
                        <div className="p-6 bg-muted/40 rounded-2xl border flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              Email Address
                            </p>
                            <a
                              href={`mailto:${content.contactEmail}`}
                              className="text-lg font-bold text-primary hover:underline"
                            >
                              {content.contactEmail}
                            </a>
                          </div>
                        </div>
                      )}
                      {content.contactAddress && (
                        <div className="p-6 bg-muted/40 rounded-2xl border flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-1">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              Physical Office
                            </p>
                            <p className="text-lg font-bold leading-snug">
                              {content.contactAddress}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};
