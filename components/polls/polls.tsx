"use client";

import React from "react";
import { getPolls } from "../../graphql/actions/polls";
import { BarChart3, Plus, RotateCw, Filter, LayoutGrid, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import List from "./poll-list";
import { PollProps, By } from "./ts-types";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Poll: React.FC<PollProps> = ({ by }) => {
  const { data, loading, refetch } = getPolls({
    variables: {
      input: {
        by: by,
      },
    },
  });

  const polls = data?.getPolls || [];
  const isAdmin = by === By.ENTITY;

  return (
    <EcosystemWrapper>
       <EcosystemHeader
          title={isAdmin ? "Polls" : "User Polls"}
          description={isAdmin ? "Manage and view administrative polls." : "View and moderate community polls."}
          badgeText={isAdmin ? "Admin" : "Community"}
          icon={BarChart3}
       />

       <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group grow>
             <div className="flex items-center gap-3 px-1">
                <div className="flex flex-col">
                   <span className="text-[11px] font-semibold text-foreground uppercase tracking-tight leading-none">
                      {isAdmin ? "Admin" : "Community"} Polls
                   </span>
                   <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-widest">
                      Active Stream
                   </span>
                </div>
             </div>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
             {isAdmin && (
                <EcosystemActionBar.Item>
                   <Link href="/polls/create">
                      <Button size="sm" className="h-9 px-6 rounded-xl gap-2 font-semibold uppercase tracking-tight">
                        <Plus className="h-4 w-4" />
                        Create Poll
                      </Button>
                   </Link>
                </EcosystemActionBar.Item>
             )}
             
             <EcosystemActionBar.Item>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 text-zinc-400 hover:text-foreground rounded-xl transition-all bg-white border-zinc-200"
                  onClick={() => refetch()}
                >
                  <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
                </Button>
             </EcosystemActionBar.Item>

             <EcosystemActionBar.Status active={polls.length > 0}>
                {polls.length} Polls
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
