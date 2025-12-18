"use client";

import BuilderLayout from "@/components/website-layout/builder-layout";
import { redirect } from "next/navigation";


const WebsiteBuilderPage = () => {
  return (
    <div className="fixed inset-0 z-[30] bg-background w-full h-full p-0">
      <div className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-xl font-bold">Website Builder</h1>
          <p className="text-muted-foreground text-sm">
            Design your community site with our modular builder.
          </p>
        </div>
      </div>
      <button
        className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition p-2 shadow-sm absolute top-4 right-4"
        aria-label="Close"
        onClick={() =>  redirect("/app-layout/pages")}
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
      <div className="px-4 pb-4 h-[calc(100vh-80px)] overflow-auto">
        <BuilderLayout />
      </div>
    </div>
  );
};

export default WebsiteBuilderPage;
