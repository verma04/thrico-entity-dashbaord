"use client";

import BuilderLayout from "@/components/website-layout/builder-layout";
import { redirect } from "next/navigation";

const WebsiteBuilderPage = () => {
  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden">
      <div className="flex flex-row items-center justify-between px-6 py-4 border-b shrink-0 bg-background relative z-10">
        <div>
          <h1 className="text-xl font-bold">Website Builder</h1>
          <p className="text-muted-foreground text-sm">
            Design your community site with our modular builder.
          </p>
        </div>
      </div>
      <button
        className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition p-2 shadow-sm absolute top-4 right-6 z-50"
        aria-label="Close"
        onClick={() => redirect("/app-layout/pages")}
      >
        <span className="sr-only">Close</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M6 6L14 14M14 6L6 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="flex-1 w-full h-full relative overflow-hidden bg-background">
        <BuilderLayout />
      </div>
    </div>
  );
};

export default WebsiteBuilderPage;
