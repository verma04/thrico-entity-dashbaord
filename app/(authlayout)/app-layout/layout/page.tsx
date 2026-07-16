"use client";

import BuilderLayout from "@/components/website-layout/builder-layout";
import { redirect } from "next/navigation";

const WebsiteBuilderPage = () => {
  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden animate-in fade-in duration-500">
      <header className="flex flex-row items-center justify-between px-8 py-4 border-b shrink-0 bg-background/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Website Builder</h1>
            <p className="text-muted-foreground text-xs font-medium">
              Enterprise CMS & Layout Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live Preview</span>
          </div>
          
          <button
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-300"
            aria-label="Close"
            onClick={() => redirect("/app-layout/")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>
      
      <main className="flex-1 w-full h-full relative overflow-hidden bg-muted/20">
        <BuilderLayout />
      </main>
    </div>
  );
};

export default WebsiteBuilderPage;
