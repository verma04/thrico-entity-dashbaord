"use client";

import React from "react";
import NewPoll from "@/components/polls/new-poll";
import { BarChart3, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatePollPage() {
  const router = useRouter();

  const handleCompleted = (id: string | number) => {
    router.push("/polls");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      {/* Header section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create New Poll
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Polls</span>
              <ChevronRight className="h-3 w-3" />
              <span>Create New Poll</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <NewPoll
              standalone={false}
              onCompletedAction={handleCompleted}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
