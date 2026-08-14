"use client";

import React, { useState } from "react";
import { getPolls } from "../../graphql/actions/polls";
import { BarChart3, Plus, RotateCw, Filter, LayoutGrid, Terminal } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import List from "./poll-list";
import { PollProps, By } from "./ts-types";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

const Poll: React.FC<PollProps> = ({ by: initialBy }) => {
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);
  const [byFilter, setByFilter] = useState<By>(initialBy || By.ENTITY);
  
  const { data, loading, refetch } = getPolls({
    variables: {
      input: {
        by: byFilter,
      },
    },
  });

  const polls = data?.getPolls || [];
  const isAdmin = byFilter === By.ENTITY;

  return (
    <EcosystemWrapper>
       <EcosystemHeader
          title={moduleName}
          description={`Manage and view administrative and community ${moduleName.toLowerCase()}.`}
          badgeText={isAdmin ? "Admin" : "Community"}
          icon={BarChart3}
          breadcrumbs={[
            { label: moduleName, href: "/polls" },
            { label: "All" }
          ]}
       />

       <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
             <EcosystemActionBar.Item grow className="max-w-xs">
                <div className="flex flex-col px-1 justify-center h-full">
                   <span className="text-[11px] font-semibold text-foreground uppercase tracking-tight leading-none">
                      {isAdmin ? "Admin" : "Community"} {moduleName}
                   </span>
                   <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-widest">
                      Active Stream
                   </span>
                </div>
             </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Group>
             <EcosystemActionBar.Item>
                <EcosystemActionBar.Select
                  value={byFilter}
                  onValueChange={(value: any) => setByFilter(value as By)}
                  options={[
                    { value: By.ENTITY, label: `Admin ${moduleName}` },
                    { value: By.USER, label: `User ${moduleName}` },
                    { value: By.ALL, label: `All ${moduleName}` },
                  ]}
                  placeholder={`Filter ${moduleName}`}
                />
             </EcosystemActionBar.Item>
             <EcosystemActionBar.Item>
                <CtaButton
                  variant="outline"
                  size="md"
                  onClick={() => refetch()}
                  className="h-8 w-8 p-0 rounded-md border-border text-muted-foreground hover:text-foreground transition-all"
                >
                  <RotateCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                </CtaButton>
             </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
             <EcosystemActionBar.Item>
                <Link href="/polls/create">
                   <CtaButton size="md" className="gap-1.5 h-8 px-3 text-xs">
                     <Plus className="h-3.5 w-3.5" />
                     Create {singularName}
                   </CtaButton>
                </Link>
             </EcosystemActionBar.Item>
             <EcosystemActionBar.Status active={polls.length > 0}>
                {polls.length} {moduleName}
             </EcosystemActionBar.Status>
          </EcosystemActionBar.Group>
       </EcosystemActionBar>

       <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
          <div className="px-6 py-2">
             <List data={polls} isLoading={loading} />
          </div>
       </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default Poll;
