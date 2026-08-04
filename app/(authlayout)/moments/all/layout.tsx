"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Video, Search, ChevronDown, Filter, VideoIcon } from "lucide-react";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

export default function MomentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/moments/all?${params.toString()}`);
  };

  return (
    <EcosystemWrapper>
      {/* Premium Header */}

      <EcosystemContainer className="p-0 bg-transparent border-none shadow-none ring-0">
        {children}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
