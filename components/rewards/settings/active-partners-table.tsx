"use client";

import React from "react";
import { Building2, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { BrandReward } from "./brand-rewards-dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActivePartner {
  id: string;
  name: string;
  logo: string;
  offers: number;
  redemptions: number;
  status: "Active" | "Paused";
  joinedDate: string;
  /** Rewards accepted by the admin during the approval flow */
  acceptedRewards?: Pick<BrandReward, "id" | "title" | "value" | "directLink" | "type">[];
}

interface ActivePartnersTableProps {
  partners: ActivePartner[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActivePartnersTable({ partners }: ActivePartnersTableProps) {
  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-semibold text-foreground uppercase tracking-[0.18em]">
            Active Partners
          </span>
          <span className="h-5 min-w-5 px-1.5 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
            {partners.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 px-3"
        >
          Manage All
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Brand
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Published Rewards
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Redemptions
              </TableHead>
              <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-widest text-muted-foreground" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {partners.map((brand) => (
              <TableRow key={brand.id} className="group border-border align-top">
                {/* Brand */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg border border-border shrink-0">
                      <AvatarImage src={brand.logo} alt={brand.name} />
                      <AvatarFallback className="text-xs font-semibold bg-muted">
                        {brand.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {brand.name}
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                        Since {brand.joinedDate}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Published rewards — direct links */}
                <TableCell className="py-3">
                  {brand.acceptedRewards && brand.acceptedRewards.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {brand.acceptedRewards.map((reward) => (
                        <a
                          key={reward.id}
                          href={reward.directLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 group/link w-fit"
                        >
                          <span className="text-[11px] font-medium text-foreground group-hover/link:text-primary transition-colors leading-none">
                            {reward.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            {reward.value}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/50 group-hover/link:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      {brand.offers} offer{brand.offers !== 1 ? "s" : ""}
                    </span>
                  )}
                </TableCell>

                {/* Redemptions */}
                <TableCell className="py-3 text-sm font-medium text-foreground">
                  {brand.redemptions.toLocaleString()}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] uppercase font-semibold tracking-wider",
                      brand.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {brand.status}
                  </Badge>
                </TableCell>

                {/* Action */}
                <TableCell className="py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
