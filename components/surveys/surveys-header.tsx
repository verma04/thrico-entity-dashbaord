"use client";

import { ClipboardList, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import NewForm from "../feedback-form/new-feed-back-form";
import Link from "next/link";

export function SurveysHeader() {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between px-6 py-6 border-b bg-muted/10 backdrop-blur-sm sticky top-0 z-20">
      <PageHeader
        icon={ClipboardList}
        title="Surveys"
        description="Manage and create surveys for your community."
      />

      <div className="flex items-center gap-3">
        <Link href="/surveys/templates">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Sparkles className="h-4 w-4 text-primary" />
            Browse Templates
          </Button>
        </Link>
        <NewForm />
      </div>
    </div>
  );
}
