"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Poll: React.FC<PollProps> = ({ by: initialBy }) => {
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
          title="Polls"
          description="Manage and view administrative and community polls."
          badgeText={isAdmin ? "Admin" : "Community"}
          icon={BarChart3}
          actions={
            <Link href="/polls/create">
               <Button className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2">
                 <Plus className="h-4 w-4" />
                 Create Poll
               </Button>
            </Link>
          }
       />

       <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
             <EcosystemActionBar.Item grow className="max-w-xs">
                <div className="flex flex-col px-1 justify-center h-full">
                   <span className="text-[11px] font-semibold text-foreground uppercase tracking-tight leading-none">
                      {isAdmin ? "Admin" : "Community"} Polls
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
                <Select
                  value={byFilter}
                  onValueChange={(value) => setByFilter(value as By)}
                >
                  <SelectTrigger className="w-[140px] h-9 border-none bg-muted/50 rounded-lg text-xs font-semibold focus:ring-0">
                    <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter Polls" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={By.ENTITY}>Admin Polls</SelectItem>
                    <SelectItem value={By.USER}>User Polls</SelectItem>
                    <SelectItem value={By.ALL}>All Polls</SelectItem>
                  </SelectContent>
                </Select>
             </EcosystemActionBar.Item>
             <EcosystemActionBar.Item>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                  onClick={() => refetch()}
                >
                  <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
                </Button>
             </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
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
