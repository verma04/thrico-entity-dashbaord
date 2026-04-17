"use client";

import React, { useState } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetRewards } from "@/graphql/actions/rewards";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: rewardsData,
    loading: rewardsLoading,
    refetch: refetchRewards,
  } = useGetRewards({
    pagination: { page: 1, limit: 100 },
  });

  const rewards = rewardsData?.getRewards || [];

  const filteredRewards = rewards.filter((reward: any) =>
    reward.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="bg-background/80 backdrop-blur-xl border-b border-border/40 py-2 sticky top-[112px] z-20"
      >
        <EcosystemActionBar.Group className="flex-1">
          <EcosystemActionBar.Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search within stock records..."
            className="max-w-md"
          />
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchRewards()}
              className="h-9 w-9 rounded-xl border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <RotateCw
                size={14}
                className={cn(rewardsLoading ? "animate-spin" : "")}
              />
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>
    </>
  );
}
